/**
 * Seeds the ORA2 Sanity dataset from src/content/seed. Uploads each local image once (cached by path),
 * then createOrReplace documents with stable ids so the script is idempotent.
 *   NEXT_PUBLIC_ORA2_SANITY_PROJECT_ID=... ORA2_SANITY_WRITE_TOKEN=... pnpm seed
 */
import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import path from "node:path";
import * as seed from "../src/content/seed";
import type { ImageRef } from "../src/content/types";

const projectId = process.env.NEXT_PUBLIC_ORA2_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_ORA2_SANITY_DATASET || "production";
const token = process.env.ORA2_SANITY_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_ORA2_SANITY_PROJECT_ID and ORA2_SANITY_WRITE_TOKEN (never the NEXT_PUBLIC_SANITY_* of the other site).");
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: "2025-10-01", useCdn: false });
const assets = new Map<string, string>();

async function figure(img: ImageRef | null | undefined) {
  if (!img) return undefined;
  let id = assets.get(img.src);
  if (!id) {
    const file = path.join("public", img.src);
    const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
    id = asset._id;
    assets.set(img.src, id);
    console.log("uploaded", img.src);
  }
  const [fx, fy] = img.focal.split(" ").map((v) => parseFloat(v) / 100);
  return {
    _type: "figure",
    asset: { _type: "reference", _ref: id },
    hotspot: { x: fx, y: fy, width: 0.3, height: 0.3 },
    crop: { top: 0, bottom: 0, left: 0, right: 0 },
    alt: img.alt,
    caption: img.caption,
    rendering: !!img.rendering,
    placeholder: !!img.placeholder,
    credit: img.credit,
  };
}
const figures = async (list: ImageRef[]) => Promise.all(list.map(figure));
const slug = (s: string) => ({ _type: "slug", current: s });
const keyed = <T extends object>(list: T[]) => list.map((item, i) => ({ _key: `k${i}`, ...item }));

async function run() {
  const docs: Record<string, unknown>[] = [];
  const s = seed.siteSettings;
  docs.push({ _id: "siteSettings", _type: "siteSettings", ...s, filmPoster: await figure(s.filmPoster), filmMp4: undefined, filmWebm: undefined, brochureUrl: undefined, brokerKitUrl: undefined, social: keyed(s.social) });
  const h = seed.home;
  docs.push({
    _id: "homePage",
    _type: "homePage",
    hero: { ...h.hero, stats: keyed(h.hero.stats), thumbnails: keyed(await Promise.all(h.hero.thumbnails.map(async (t) => ({ label: t.label, image: await figure(t.image) })))) },
    numbers: { ...h.numbers, aerial: await figure(h.numbers.aerial), beach: await figure(h.numbers.beach), stats: keyed(h.numbers.stats) },
    explorer: h.explorer,
    rooms: { ...h.rooms, rooms: keyed(await Promise.all(h.rooms.rooms.map(async (r) => ({ ...r, image: await figure(r.image), hotspots: keyed(r.hotspots) })))) },
    resilience: { ...h.resilience, image: await figure(h.resilience.image), features: keyed(h.resilience.features.map((f) => ({ ...f, points: keyed(f.points) }))) },
    living: { ...h.living, familyItems: keyed(h.living.familyItems), petItems: keyed(h.living.petItems) },
    island: { ...h.island, places: keyed(await Promise.all(h.island.places.map(async (p) => ({ ...p, image: await figure(p.image) })))) },
    compare: h.compare,
    invest: h.invest,
    portfolio: h.portfolio,
    faq: h.faq,
    visit: { ...h.visit, image: await figure(h.visit.image) },
  });
  for (const p of seed.projects) docs.push({ _id: `project-${p.slug}`, _type: "project", ...p, slug: slug(p.slug), hero: await figure(p.hero), gallery: keyed(await figures(p.gallery)), facts: keyed(p.facts), sections: keyed(await Promise.all(p.sections.map(async (x) => ({ ...x, image: await figure(x.image) })))) });
  for (const c of seed.collections) docs.push({ _id: `collection-${c.slug}`, _type: "collection", ...c, slug: slug(c.slug), image: await figure(c.image), gallery: keyed(await figures(c.gallery)), features: keyed(c.features), finishes: keyed(c.finishes.map((f) => ({ ...f, items: keyed(f.items) }))), specs: keyed(c.specs.map((x) => ({ ...x, confirmed: x.value != null }))) });
  for (const p of seed.floorPlans) docs.push({ _id: `plan-${p.slug}`, _type: "floorPlan", ...p, slug: slug(p.slug), image: await figure(p.image), keyplan: await figure(p.keyplan), pdf: undefined, highlights: keyed(p.highlights) });
  for (const a of seed.amenities) docs.push({ _id: `amenity-${a.slug}`, _type: "amenity", ...a, slug: slug(a.slug), image: await figure(a.image) });
  for (const a of seed.activities) docs.push({ _id: `activity-${a.slug}`, _type: "activity", ...a, slug: slug(a.slug), image: await figure(a.image), items: keyed(a.items) });
  for (const g of seed.galleryImages) docs.push({ _id: `gallery-${g.id}`, _type: "galleryImage", category: g.category, caption: g.caption, image: await figure(g.image) });
  for (const m of seed.team) docs.push({ _id: `team-${m.slug}`, _type: "teamMember", ...m, slug: slug(m.slug), portrait: await figure(m.portrait) });
  for (const p of seed.pointsOfInterest) docs.push({ _id: `poi-${p.slug}`, _type: "pointOfInterest", ...p, slug: slug(p.slug) });
  for (const f of seed.faqs) docs.push({ _id: `faq-${f.slug}`, _type: "faq", ...f, slug: slug(f.slug) });
  for (const i of seed.incentives) docs.push({ _id: `incentive-${i.slug}`, _type: "incentive", ...i, slug: slug(i.slug) });
  for (const st of seed.investmentSteps) docs.push({ _id: `step-${st.order}`, _type: "investmentStep", ...st });
  for (const [i, l] of seed.portfolio.entries()) docs.push({ _id: `portfolio-${l.slug}`, _type: "portfolioLocation", ...l, slug: slug(l.slug), image: await figure(l.image), order: i });
  for (const p of seed.pages) docs.push({ _id: `page-${p.slug}`, _type: "page", ...p, slug: slug(p.slug), hero: await figure(p.hero), sections: keyed(await Promise.all(p.sections.map(async (x) => ({ ...x, image: await figure(x.image) })))) });
  for (const [i, r] of seed.redirects.entries()) docs.push({ _id: `redirect-${i}`, _type: "redirect", ...r });

  let tx = client.transaction();
  for (const d of docs) tx = tx.createOrReplace(d as never);
  await tx.commit();
  console.log(`${docs.length} documents written to ${projectId}/${dataset}`);
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
