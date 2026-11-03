import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/lead-schema";
import { rateLimit } from "@/lib/rate-limit";
import { writeClient } from "@/sanity/client";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (!(await rateLimit(`news:${ip}`, 5, 10 * 60_000))) return NextResponse.json({ ok: false }, { status: 429 });
  const parsed = newsletterSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  if (parsed.data.company) return NextResponse.json({ ok: true });
  const webhook = process.env.CRM_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-ORA-Secret": process.env.CRM_WEBHOOK_SECRET || "" },
      body: JSON.stringify({ variant: "newsletter", email: parsed.data.email, locale: parsed.data.locale, submittedAt: new Date().toISOString(), site: "oraworld-v2" }),
      signal: AbortSignal.timeout(8000),
    }).catch(() => {});
  }
  const client = writeClient();
  if (client) await client.create({ _type: "lead", variant: "newsletter", email: parsed.data.email, locale: parsed.data.locale, submittedAt: new Date().toISOString() }).catch(() => {});
  return NextResponse.json({ ok: true });
}
