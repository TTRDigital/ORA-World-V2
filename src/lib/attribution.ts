/**
 * Where the visitor came from, captured in the browser and sent with every lead (Kia, 22 Nov 2026).
 *
 * - Captured on the first page view of a visit and kept for the visit in sessionStorage, plus a first-party
 *   cookie for 30 days so a return visit within that window keeps its first touch.
 * - First touch wins. The one exception: a later page view that arrives from an ad (it carries a UTM tag or a
 *   click id) replaces the stored set with that ad.
 * - No third-party calls: this only reads the URL and document.referrer.
 */

export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "oppref",
  "msclkid",
  "ttclid",
] as const;

export const ATTRIBUTION_FIELDS = [...ATTRIBUTION_PARAMS, "referrer", "landing"] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];
export type Attribution = Partial<Record<AttributionField, string>>;

const KEY = "ora_attr";
const COOKIE_DAYS = 30;
const MAX = 500;

function clean(value: string | null | undefined) {
  const v = (value ?? "").trim();
  return v ? v.slice(0, MAX) : undefined;
}

function parse(raw: string | null | undefined): Attribution | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const out: Attribution = {};
    for (const k of ATTRIBUTION_FIELDS) {
      const v = typeof obj[k] === "string" ? clean(obj[k] as string) : undefined;
      if (v) out[k] = v;
    }
    return out;
  } catch {
    return null;
  }
}

function readSession(): Attribution | null {
  try {
    return parse(window.sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}

function readCookie(): Attribution | null {
  try {
    const hit = document.cookie.split("; ").find((c) => c.startsWith(`${KEY}=`));
    return hit ? parse(decodeURIComponent(hit.slice(KEY.length + 1))) : null;
  } catch {
    return null;
  }
}

function saveSession(json: string) {
  try {
    window.sessionStorage.setItem(KEY, json);
  } catch {}
}

function save(attr: Attribution) {
  const json = JSON.stringify(attr);
  saveSession(json);
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${KEY}=${encodeURIComponent(json)}; Max-Age=${COOKIE_DAYS * 24 * 60 * 60}; Path=/; SameSite=Lax${secure}`;
  } catch {}
}

/** Builds the set for the current page view: the tracked URL parameters, an outside referrer, and the landing page. */
function fromLocation(): Attribution {
  const url = new URL(window.location.href);
  const attr: Attribution = {};
  for (const k of ATTRIBUTION_PARAMS) {
    const v = clean(url.searchParams.get(k));
    if (v) attr[k] = v;
  }
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.hostname !== url.hostname) attr.referrer = clean(document.referrer);
  } catch {}
  attr.landing = clean(url.pathname + url.search);
  return attr;
}

/** Runs on every page view. Stores the first touch, or replaces it when this view arrives from an ad. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const current = fromLocation();
  const isAd = ATTRIBUTION_PARAMS.some((k) => current[k]);
  const stored = readSession() ?? readCookie();
  if (isAd) {
    save(current);
  } else if (stored) {
    // Keep the first touch. On a return visit, copy the cookie into this visit's sessionStorage without
    // renewing the cookie, so the first touch still expires 30 days after it was captured.
    if (!readSession()) saveSession(JSON.stringify(stored));
  } else {
    save(current);
  }
}

/** The stored set, ready to spread into the lead payload under the same field names. */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return readSession() ?? readCookie() ?? {};
}
