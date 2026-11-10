import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { leadSchema } from "@/lib/lead-schema";
import { rateLimit } from "@/lib/rate-limit";
import { writeClient } from "@/sanity/client";
import { sendConfirmationEmail } from "@/lib/email";

/**
 * Lead intake: Zod validation, honeypot with silent success, Turnstile when keys exist, rate limiting,
 * then (1) POST to CRM_WEBHOOK_URL with the first-touch attribution, (2) a Sanity lead document,
 * (3) a Resend confirmation behind EMAIL_ENABLED.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (!(await rateLimit(`lead:${ip}`, 8, 10 * 60_000))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  }
  const data = parsed.data;
  if (data.company) return NextResponse.json({ ok: true }); // honeypot: pretend success

  if (process.env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(data.turnstileToken || "", ip);
    if (!ok) return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });
  }

  const store = await cookies();
  let attribution: Record<string, unknown> = {};
  try {
    attribution = JSON.parse(decodeURIComponent(store.get("ora2_attr")?.value || "{}"));
  } catch {}

  const submittedAt = new Date().toISOString();
  const { turnstileToken: _t, company: _c, ...fields } = data;
  void _t;
  void _c;
  const payload = { ...fields, attribution, userAgent: req.headers.get("user-agent"), ip, submittedAt, site: "oraworld-v2" };

  let crmStatus = "skipped";
  const webhook = process.env.CRM_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-ORA-Secret": process.env.CRM_WEBHOOK_SECRET || "" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      crmStatus = res.ok ? "sent" : `failed:${res.status}`;
    } catch (e) {
      crmStatus = `failed:${(e as Error).message}`;
    }
  }

  const client = writeClient();
  if (client) {
    await client
      .create({
        _type: "lead",
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        role: fields.role,
        variant: fields.variant,
        message: [fields.message, fields.licence && `Licence: ${fields.licence}`, fields.brokerage && `Brokerage: ${fields.brokerage}`, fields.client && `Client: ${fields.client}`, fields.visitMode && `Visit: ${fields.visitMode}`, fields.preferred && `Preferred: ${fields.preferred}`, fields.source && `Source: ${fields.source}`, fields.goal && `Goal: ${fields.goal}`].filter(Boolean).join("\n"),
        locale: fields.locale,
        page: fields.page,
        answers: fields.answers ? JSON.stringify(fields.answers) : undefined,
        attribution: JSON.stringify(attribution),
        submittedAt,
        crmStatus,
      })
      .catch((e) => console.error("[lead] sanity save failed", e));
  }

  await sendConfirmationEmail({ to: data.email, name: data.name, locale: data.locale }).catch((e) => console.error("[lead] email failed", e));
  return NextResponse.json({ ok: true, crmStatus });
}

async function verifyTurnstile(token: string, ip: string) {
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  });
  const json = (await res.json()) as { success: boolean };
  return json.success;
}
