import { NextResponse } from "next/server";
import { GATE_COOKIE, gateOn, gateToken, safeEqual, safeNext } from "@/lib/demo-gate";
import { rateLimit } from "@/lib/rate-limit";

/**
 * The demo passcode screen (GET) and its check (POST). See src/lib/demo-gate.ts. The page is plain HTML with the
 * ORA palette, so it shows before anything of the site loads.
 */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function page(next: string, error: "" | "wrong" | "busy") {
  const msg = error === "wrong" ? "That passcode is not correct. Please try again." : error === "busy" ? "Too many attempts. Please wait a few minutes and try again." : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>ORA World · Private preview</title>
<style>
*{box-sizing:border-box}html,body{margin:0;height:100%}
body{min-height:100svh;display:grid;place-items:center;padding:24px;background:#F7F3EC;color:#2C2416;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
main{width:100%;max-width:420px;text-align:center}
img{height:110px;width:auto}
.eyebrow{margin:28px 0 0;font-size:12px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:#684D25}
h1{margin:14px 0 0;font:400 38px/1.1 "Cormorant Garamond",Georgia,"Times New Roman",serif}
h1 em{font-style:italic}
p.lead{margin:14px 0 0;font-size:16px;line-height:1.6;color:#5a4f42}
form{margin-top:32px;display:grid;gap:12px}
label{font-size:13px;font-weight:600;letter-spacing:.08em;text-align:left}
input{width:100%;min-height:52px;padding:0 16px;font:inherit;font-size:18px;letter-spacing:.12em;border:1px solid #CFC4B2;background:#fff;color:#2C2416;border-radius:0}
input:focus{outline:2px solid #A8864F;outline-offset:2px}
button{min-height:52px;border:0;background:#2C2416;color:#F7F3EC;font:600 13px system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.22em;text-transform:uppercase;cursor:pointer}
button:hover{background:#3d3220}
.err{margin:4px 0 0;color:#8a2c1d;font-size:14px}
.foot{margin-top:36px;font-size:12px;color:#7a6f60}
</style></head><body><main>
<img src="/brand/ora-world-logo-gold.png" alt="ORA World" width="160" height="110">
<p class="eyebrow">Private preview</p>
<h1>Tesoro del Mar, <em>by invitation</em></h1>
<p class="lead">This site is a private demo. Please enter the passcode you were given.</p>
<form method="post" action="/api/gate">
<input type="hidden" name="next" value="${esc(next)}">
<label for="code">Passcode</label>
<input id="code" name="passcode" type="password" autocomplete="current-password" required autofocus>
${msg ? `<p class="err" role="alert">${esc(msg)}</p>` : ""}
<button type="submit">Enter</button>
</form>
<p class="foot">© 2026 ORA World Puerto Rico</p>
</main></body></html>`;
}

const html = (body: string, status = 200) =>
  new NextResponse(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const e = url.searchParams.get("error");
  return html(page(safeNext(url.searchParams.get("next")), e === "wrong" || e === "busy" ? e : ""));
}

export async function POST(req: Request) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const form = await req.formData();
  const next = safeNext(String(form.get("next") || "/"));
  const back = (error: string) => NextResponse.redirect(new URL(`/api/gate?next=${encodeURIComponent(next)}&error=${error}`, req.url), 303);
  if (!gateOn(host)) return NextResponse.redirect(new URL(next, req.url), 303);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (!(await rateLimit(`gate:${ip}`, 10, 10 * 60_000))) return back("busy");
  const given = String(form.get("passcode") || "").trim();
  if (!safeEqual(given, String(process.env.ORA2_DEMO_PASSCODE).trim())) return back("wrong");
  const res = NextResponse.redirect(new URL(next, req.url), 303);
  res.cookies.set(GATE_COOKIE, await gateToken(), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
