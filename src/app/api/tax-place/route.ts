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
  if (!(await rateLimit(`taxplace:${ip}`, 20, 10 * 60_000)))
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 5 || q.length > 200)
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  const url = new URL(CENSUS);
  url.search = new URLSearchParams({
    address: q,
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    layers: "States,Counties,Incorporated Places,Unified School Districts",
    format: "json",
  }).toString();
  let match: { matchedAddress: string; geographies: Record<string, Geo[]> } | undefined;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12_000), cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as {
      result?: { addressMatches?: { matchedAddress: string; geographies: Record<string, Geo[]> }[] };
    };
    match = json.result?.addressMatches?.[0];
  } catch {
    return NextResponse.json({ ok: false, error: "lookup_failed" }, { status: 502 });
  }
  if (!match) {
    // Client, 27 Nov: the address is the only input, so a city or ZIP without a street still finds the state; the
    // state's typical local tax applies (locals: null).
    const code = stateFromText(q);
    if (!code) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    return NextResponse.json(
      { ok: true, code, matched: null, areas: [], locals: null, partial: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const g = match.geographies;
  const state = g["States"]?.[0]?.STUSAB ?? "";
  const county = g["Counties"]?.[0];
  const place = g["Incorporated Places"]?.[0];
  const district = g["Unified School Districts"]?.[0];
  const placeName = place?.NAME ?? "";
  const code = state === "NY" && placeName === "New York city" ? "NYC" : state;
  if (!JURISDICTIONS.some((j) => j.code === code))
    return NextResponse.json({ ok: false, error: "outside_us_states" }, { status: 404 });

  const locals: LocalTax[] = [];
  const areas: string[] = [county?.NAME, placeName, district?.NAME].filter((x): x is string => !!x);
  const c = county?.GEOID ?? "";
  if (state === "MD" && LOCAL.MD[c]) {
    const m = LOCAL.MD[c];
    locals.push(
      m.brackets
        ? { name: `${m.name} income tax`, base: "taxable", brackets: m.brackets, band: m.mode === "band" }
        : { name: `${m.name} income tax`, base: "taxable", flat: m.rate },
    );
  }
  if (state === "IN" && LOCAL.IN[c])
    locals.push({ name: `${LOCAL.IN[c].name} income tax`, base: "taxable", flat: LOCAL.IN[c].rate });
  if (state === "MI" && LOCAL.MI[placeName]) {
    const m = LOCAL.MI[placeName];
    // The exemption is per person, so a married couple filing jointly has two.
    locals.push({
      name: `${m.name} city income tax`,
      base: "gain",
      flat: m.rate,
      minus: m.exemption,
      mfj: { minus: m.exemption * 2 },
    });
  }
  if (code === "NYC") {
    const nyc = JURISDICTIONS.find((j) => j.code === "NYC")?.local;
    if (nyc) locals.push(nyc);
  }
  if (state === "NY" && placeName === LOCAL.YONKERS.place)
    locals.push({ name: "Yonkers resident surcharge", base: "stateTax", flat: LOCAL.YONKERS.rate });
  if (state === "OR") {
    if (LOCAL.OR.metroPlaces.includes(placeName))
      locals.push({
        name: "Metro supportive housing services tax",
        base: "taxable",
        brackets: [
          [0, 0],
          [LOCAL.OR.metroThreshold, LOCAL.OR.metroRate],
        ],
        mfj: {
          brackets: [
            [0, 0],
            [LOCAL.OR.metroThresholdJoint, LOCAL.OR.metroRate],
          ],
        },
      });
    if (c === LOCAL.OR.multnomahFips)
      locals.push({
        name: "Multnomah County Preschool for All tax",
        base: "taxable",
        brackets: [[0, 0], ...LOCAL.OR.multnomah],
        mfj: { brackets: [[0, 0], ...LOCAL.OR.multnomahJoint] },
      });
  }
  const sd = district?.GEOID ?? "";
  if (state === "OH" && LOCAL.OH[sd]?.base === "traditional")
    locals.push({ name: LOCAL.OH[sd].name, base: "taxable", flat: LOCAL.OH[sd].rate });
  if (state === "IA" && LOCAL.IA[sd])
    locals.push({ name: `${LOCAL.IA[sd].name} surtax`, base: "stateTax", flat: LOCAL.IA[sd].rate });

  return NextResponse.json(
    { ok: true, code, matched: match.matchedAddress, areas, locals: locals.filter((l) => l.flat !== 0) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

const STATE_NAMES: Record<string, string> = Object.fromEntries(
  JURISDICTIONS.filter((j) => j.code !== "NYC").map((j) => [j.name.toLowerCase(), j.code]),
);

/** A US state from free text: New York City first, then a full state name, then a two-letter code after a comma or
 *  before a ZIP ("Miami, FL", "Austin TX 78701"). */
function stateFromText(text: string): string | null {
  const t = ` ${text.toLowerCase().replace(/[.]/g, "")} `;
  if (/\b(new york city|nyc|manhattan|brooklyn|queens|bronx|staten island)\b/.test(t)) return "NYC";
  // A two-letter code at the end wins ("Kansas City, MO", "Washington, DC").
  const m = text
    .toUpperCase()
    .replace(/[.]/g, "")
    .match(/(?:,\s*|\s)([A-Z]{2})(?:\s+\d{5}(?:-\d{4})?)?\s*$/);
  if (m && JURISDICTIONS.some((j) => j.code === m[1])) return m[1];
  if (/\b(washington,? dc|district of columbia)\b/.test(t)) return "DC";
  // Longest names first, so "west virginia" beats "virginia" and "missouri" is tried before "kansas".
  const name = Object.keys(STATE_NAMES)
    .sort((x, y) => y.length - x.length)
    .find((n) => new RegExp(`[\\s,]${n}[\\s,]`).test(t));
  if (name) return STATE_NAMES[name];
  const zip = text.match(/\b(\d{5})(?:-\d{4})?\b/);
  return zip ? stateFromZip(Number(zip[1].slice(0, 3))) : null;
}

/** USPS ZIP prefixes (first three digits) by state, for a ZIP typed without a street. */
const ZIP3: [number, number, string][] = [
  [5, 5, "NY"],
  [10, 27, "MA"],
  [28, 29, "RI"],
  [30, 38, "NH"],
  [39, 49, "ME"],
  [50, 54, "VT"],
  [55, 55, "MA"],
  [56, 59, "VT"],
  [60, 69, "CT"],
  [70, 89, "NJ"],
  [100, 149, "NY"],
  [150, 196, "PA"],
  [197, 199, "DE"],
  [200, 200, "DC"],
  [201, 201, "VA"],
  [202, 205, "DC"],
  [206, 219, "MD"],
  [220, 246, "VA"],
  [247, 268, "WV"],
  [270, 289, "NC"],
  [290, 299, "SC"],
  [300, 319, "GA"],
  [320, 349, "FL"],
  [350, 369, "AL"],
  [370, 385, "TN"],
  [386, 397, "MS"],
  [398, 399, "GA"],
  [400, 427, "KY"],
  [430, 459, "OH"],
  [460, 479, "IN"],
  [480, 499, "MI"],
  [500, 528, "IA"],
  [530, 549, "WI"],
  [550, 567, "MN"],
  [569, 569, "DC"],
  [570, 577, "SD"],
  [580, 588, "ND"],
  [590, 599, "MT"],
  [600, 629, "IL"],
  [630, 658, "MO"],
  [660, 679, "KS"],
  [680, 693, "NE"],
  [700, 714, "LA"],
  [716, 729, "AR"],
  [730, 732, "OK"],
  [733, 733, "TX"],
  [734, 749, "OK"],
  [750, 799, "TX"],
  [800, 816, "CO"],
  [820, 831, "WY"],
  [832, 838, "ID"],
  [840, 847, "UT"],
  [850, 865, "AZ"],
  [870, 884, "NM"],
  [885, 885, "TX"],
  [889, 898, "NV"],
  [900, 961, "CA"],
  [967, 968, "HI"],
  [970, 979, "OR"],
  [980, 994, "WA"],
  [995, 999, "AK"],
];
/** New York City's five boroughs: Manhattan 100-102, Staten Island 103, the Bronx 104, Queens 110, 111, 113, 114 and
 *  116, Brooklyn 112. */
const NYC_ZIP3 = [100, 101, 102, 103, 104, 110, 111, 112, 113, 114, 116];
const stateFromZip = (z3: number) =>
  NYC_ZIP3.includes(z3) ? "NYC" : (ZIP3.find(([lo, hi]) => z3 >= lo && z3 <= hi)?.[2] ?? null);
