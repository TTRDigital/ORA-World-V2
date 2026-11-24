import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { LOCAL } from "@/content/localTaxRates";
import { JURISDICTIONS, type LocalTax } from "@/content/capitalGainsRates";

/**
 * Address lookup for the Act 60 calculator (client meeting, 24 Nov: "put the address and it picks up state, city and
 * other taxes"). The address goes to the US Census Bureau geocoder (a free public service, no key) to find the state,
 * county, city and school district; this route then returns only the local income taxes that reach capital gains
 * there. The address is not stored or logged.
 */
const CENSUS = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";

type Geo = { GEOID?: string; NAME?: string; STUSAB?: string };

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (!(await rateLimit(`taxplace:${ip}`, 20, 10 * 60_000))) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 8 || q.length > 200) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  const url = new URL(CENSUS);
  url.search = new URLSearchParams({ address: q, benchmark: "Public_AR_Current", vintage: "Current_Current", layers: "States,Counties,Incorporated Places,Unified School Districts", format: "json" }).toString();
  let match: { matchedAddress: string; geographies: Record<string, Geo[]> } | undefined;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12_000), cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { result?: { addressMatches?: { matchedAddress: string; geographies: Record<string, Geo[]> }[] } };
    match = json.result?.addressMatches?.[0];
  } catch {
    return NextResponse.json({ ok: false, error: "lookup_failed" }, { status: 502 });
  }
  if (!match) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const g = match.geographies;
  const state = g["States"]?.[0]?.STUSAB ?? "";
  const county = g["Counties"]?.[0];
  const place = g["Incorporated Places"]?.[0];
  const district = g["Unified School Districts"]?.[0];
  const placeName = place?.NAME ?? "";
  const code = state === "NY" && placeName === "New York city" ? "NYC" : state;
  if (!JURISDICTIONS.some((j) => j.code === code)) return NextResponse.json({ ok: false, error: "outside_us_states" }, { status: 404 });

  const locals: LocalTax[] = [];
  const areas: string[] = [county?.NAME, placeName, district?.NAME].filter((x): x is string => !!x);
  const c = county?.GEOID ?? "";
  if (state === "MD" && LOCAL.MD[c]) {
    const m = LOCAL.MD[c];
    locals.push(m.brackets ? { name: m.name, base: "taxable", brackets: m.brackets, band: m.mode === "band" } : { name: m.name, base: "taxable", flat: m.rate });
  }
  if (state === "IN" && LOCAL.IN[c]) locals.push({ name: LOCAL.IN[c].name, base: "taxable", flat: LOCAL.IN[c].rate });
  if (state === "MI" && LOCAL.MI[placeName]) {
    const m = LOCAL.MI[placeName];
    locals.push({ name: `${m.name} city income tax`, base: "gain", flat: m.rate, minus: m.exemption });
  }
  if (code === "NYC") {
    const nyc = JURISDICTIONS.find((j) => j.code === "NYC")?.local;
    if (nyc) locals.push(nyc);
  }
  if (state === "NY" && placeName === LOCAL.YONKERS.place) locals.push({ name: "Yonkers resident surcharge", base: "stateTax", flat: LOCAL.YONKERS.rate });
  if (state === "OR") {
    if (LOCAL.OR.metroPlaces.includes(placeName)) locals.push({ name: "Metro supportive housing services tax", base: "taxable", brackets: [[0, 0], [LOCAL.OR.metroThreshold, LOCAL.OR.metroRate]] });
    if (c === LOCAL.OR.multnomahFips) locals.push({ name: "Multnomah County Preschool for All tax", base: "taxable", brackets: [[0, 0], ...LOCAL.OR.multnomah] });
  }
  const sd = district?.GEOID ?? "";
  if (state === "OH" && LOCAL.OH[sd]?.base === "traditional") locals.push({ name: LOCAL.OH[sd].name, base: "taxable", flat: LOCAL.OH[sd].rate });
  if (state === "IA" && LOCAL.IA[sd]) locals.push({ name: `${LOCAL.IA[sd].name} surtax`, base: "stateTax", flat: LOCAL.IA[sd].rate });

  return NextResponse.json(
    { ok: true, code, matched: match.matchedAddress, areas, locals: locals.filter((l) => l.flat !== 0) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
