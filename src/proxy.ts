import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { redirects } from "@/content/seed/redirects";
import { GATE_COOKIE, gateOn, gateToken } from "@/lib/demo-gate";

const intl = createIntlMiddleware(routing);

const ATTR_COOKIE = "ora2_attr";
const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
] as const;

/**
 * Next 16 proxy (formerly middleware): locale routing, seeded redirects and a first-touch attribution
 * cookie (UTM, click ids, referrer, landing page) that /api/lead attaches to every lead.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Demo passcode gate (src/lib/demo-gate.ts): on the gated hosts, nothing shows until the passcode is entered.
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const gated = gateOn(host);
  if (gated && request.cookies.get(GATE_COOKIE)?.value !== (await gateToken())) {
    const url = request.nextUrl.clone();
    url.pathname = "/api/gate";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url, 307);
  }

  // Seeded redirects (old oraworld.com paths and v1 paths → v2 URLs). Locale-agnostic.
  const stripped = pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
  const hit = redirects.find((r) => r.from === stripped);
  if (hit) {
    const locale = pathname.match(/^\/(en|es)(?=\/|$)/)?.[1] ?? routing.defaultLocale;
    const url = request.nextUrl.clone();
    const [path, hash] = hit.to.split("#");
    url.pathname = `/${locale}${path === "/" ? "" : path}`;
    url.hash = hash ? `#${hash}` : "";
    return NextResponse.redirect(url, hit.permanent ? 308 : 307);
  }

  const response = intl(request);

  if (!request.cookies.get(ATTR_COOKIE)) {
    const params = request.nextUrl.searchParams;
    const attr: Record<string, string> = {};
    for (const k of ATTR_KEYS) {
      const v = params.get(k);
      if (v) attr[k] = v.slice(0, 200);
    }
    const referrer = request.headers.get("referer");
    if (referrer && !referrer.includes(request.nextUrl.host)) attr.referrer = referrer.slice(0, 300);
    attr.landing = (pathname + search).slice(0, 300);
    attr.firstSeen = new Date().toISOString();
    response.cookies.set(ATTR_COOKIE, encodeURIComponent(JSON.stringify(attr)), {
      maxAge: 60 * 60 * 24 * 90,
      sameSite: "lax",
      path: "/",
    });
  }
  if (gated) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Everything except API routes, Next internals, the Studio and static files.
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
