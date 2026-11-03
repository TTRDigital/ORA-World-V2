import "server-only";
import { cache } from "react";
import { readClient } from "@/sanity/client";
import { figureToImageRef } from "@/sanity/image";
import * as q from "@/sanity/queries";
import * as seed from "@/content/seed";
import type {
  Activity,
  Amenity,
  Collection,
  Faq,
  FloorPlan,
  GalleryImage,
  GenericPage,
  HomeContent,
  ImageRef,
  Incentive,
  InvestmentStep,
  PointOfInterest,
  PortfolioLocation,
  PressArticle,
  Project,
  SiteSettings,
  TeamMember,
} from "@/content/types";

/**
 * Data layer. Tries Sanity first (when ORA2 env is set) and falls back to the typed seed per content type,
 * so a partially populated dataset still renders a complete site. Images from Sanity are projected into the
 * seed's ImageRef shape (focal point from the hotspot, never a blur).
 */
async function fetchOr<T>(query: string, fallback: T, project?: (raw: unknown) => T): Promise<T> {
  const client = readClient();
  if (!client) return fallback;
  try {
    const raw = await client.fetch(query, {}, { next: { revalidate: 300, tags: ["content"] } });
    if (raw == null || (Array.isArray(raw) && raw.length === 0)) return fallback;
    return project ? project(raw) : (raw as T);
  } catch (e) {
    console.error("[content] sanity fetch failed, using seed", e);
    return fallback;
  }
}

type Rec = Record<string, unknown>;
const fig = (v: unknown, fallback: ImageRef): ImageRef => figureToImageRef(v as never) ?? fallback;
const figs = (v: unknown, fallback: ImageRef[]): ImageRef[] =>
  Array.isArray(v) ? (v.map((x) => figureToImageRef(x as never)).filter(Boolean) as ImageRef[]) : fallback;
const mapSections = (v: unknown, fallback: Project["sections"]): Project["sections"] =>
  Array.isArray(v)
    ? v.map((s: Rec, i) => ({ ...(s as Project["sections"][number]), image: s.image ? (fig(s.image, fallback[i]?.image as ImageRef) ?? undefined) : undefined }))
    : fallback;

export const getSiteSettings = cache(() =>
  fetchOr<SiteSettings>(q.siteSettingsQ, seed.siteSettings, (raw) => {
    const r = raw as Rec;
    return {
      ...seed.siteSettings,
      ...(r as Partial<SiteSettings>),
      phone: (r.phone as string) || seed.siteSettings.phone,
      whatsapp: (r.whatsapp as string) || seed.siteSettings.whatsapp,
      email: (r.email as string) || seed.siteSettings.email,
      bookingUrl: (r.bookingUrl as string) || seed.siteSettings.bookingUrl,
      filmPoster: fig(r.filmPoster, seed.siteSettings.filmPoster),
    };
  }),
);

export const getHome = cache(() =>
  fetchOr<HomeContent>(q.homePageQ, seed.home, (raw) => {
    const r = raw as Rec;
    const s = seed.home;
    const m = <K extends keyof HomeContent>(k: K, extra: Partial<HomeContent[K]> = {}): HomeContent[K] =>
      ({ ...s[k], ...((r[k] as Rec) ?? {}), ...extra }) as HomeContent[K];
    const hero = (r.hero as Rec) ?? {};
    const rooms = (r.rooms as Rec) ?? {};
    const island = (r.island as Rec) ?? {};
    return {
      hero: m("hero", {
        thumbnails: Array.isArray(hero.thumbnails)
          ? hero.thumbnails.map((t: Rec, i: number) => ({ label: t.label as never, image: fig(t.image, s.hero.thumbnails[i]?.image ?? s.hero.thumbnails[0].image) }))
          : s.hero.thumbnails,
      }),
      numbers: m("numbers", { aerial: fig((r.numbers as Rec)?.aerial, s.numbers.aerial), beach: fig((r.numbers as Rec)?.beach, s.numbers.beach) }),
      explorer: m("explorer"),
      rooms: m("rooms", {
        rooms: Array.isArray(rooms.rooms)
          ? rooms.rooms.map((room: Rec, i: number) => ({ ...(room as unknown as HomeContent["rooms"]["rooms"][number]), hotspots: (room.hotspots as never) ?? [], image: fig(room.image, s.rooms.rooms[i]?.image ?? s.rooms.rooms[0].image) }))
          : s.rooms.rooms,
      }),
      resilience: m("resilience", { image: fig((r.resilience as Rec)?.image, s.resilience.image), features: ((r.resilience as Rec)?.features as never) ?? s.resilience.features }),
      living: m("living"),
      island: m("island", {
        places: Array.isArray(island.places)
          ? island.places.map((p: Rec, i: number) => ({ ...(p as unknown as HomeContent["island"]["places"][number]), image: fig(p.image, s.island.places[i]?.image ?? s.island.places[0].image) }))
          : s.island.places,
      }),
      compare: m("compare"),
      invest: m("invest"),
      portfolio: m("portfolio"),
      faq: m("faq"),
      visit: m("visit", { image: fig((r.visit as Rec)?.image, s.visit.image) }),
    };
  }),
);

export const getProjects = cache(() =>
  fetchOr<Project[]>(q.projectsQ, seed.projects, (raw) =>
    (raw as Rec[]).map((p, i) => {
      const f = seed.projects.find((x) => x.slug === p.slug) ?? seed.projects[i] ?? seed.projects[0];
      return { ...f, ...(p as Partial<Project>), hero: fig(p.hero, f.hero), gallery: figs(p.gallery, f.gallery), sections: mapSections(p.sections, f.sections) } as Project;
    }),
  ),
);
export const getProject = cache(async (slug: string) => (await getProjects()).find((p) => p.slug === slug) ?? null);

export const getCollections = cache(() =>
  fetchOr<Collection[]>(q.collectionsQ, seed.collections, (raw) =>
    (raw as Rec[]).map((c, i) => {
      const f = seed.collections.find((x) => x.slug === c.slug) ?? seed.collections[i] ?? seed.collections[0];
      return { ...f, ...(c as Partial<Collection>), image: fig(c.image, f.image), gallery: figs(c.gallery, f.gallery) } as Collection;
    }),
  ),
);
export const getCollection = cache(async (slug: string) => (await getCollections()).find((c) => c.slug === slug) ?? null);

export const getFloorPlans = cache(() =>
  fetchOr<FloorPlan[]>(q.floorPlansQ, seed.floorPlans, (raw) =>
    (raw as Rec[]).map((p, i) => {
      const f = seed.floorPlans.find((x) => x.slug === p.slug) ?? seed.floorPlans[i] ?? seed.floorPlans[0];
      return { ...f, ...(p as Partial<FloorPlan>), image: fig(p.image, f.image), keyplan: p.keyplan ? fig(p.keyplan, f.keyplan as ImageRef) : f.keyplan } as FloorPlan;
    }),
  ),
);
export const getFloorPlan = cache(async (slug: string) => (await getFloorPlans()).find((p) => p.slug === slug) ?? null);

export const getAmenities = cache(() =>
  fetchOr<Amenity[]>(q.amenitiesQ, seed.amenities, (raw) =>
    (raw as Rec[]).map((a, i) => ({ ...(seed.amenities[i] ?? seed.amenities[0]), ...(a as Partial<Amenity>), image: fig(a.image, seed.amenities[i]?.image ?? seed.amenities[0].image) }) as Amenity),
  ),
);
export const getActivities = cache(() =>
  fetchOr<Activity[]>(q.activitiesQ, seed.activities, (raw) =>
    (raw as Rec[]).map((a, i) => ({ ...(seed.activities[i] ?? seed.activities[0]), ...(a as Partial<Activity>), image: fig(a.image, seed.activities[i]?.image ?? seed.activities[0].image) }) as Activity),
  ),
);
export const getGallery = cache(() =>
  fetchOr<GalleryImage[]>(q.galleryQ, seed.galleryImages, (raw) =>
    (raw as Rec[]).map((g, i) => ({ ...(g as Partial<GalleryImage>), image: fig(g.image, seed.galleryImages[i]?.image ?? seed.galleryImages[0].image) }) as GalleryImage),
  ),
);
export const getTeam = cache(() =>
  fetchOr<TeamMember[]>(q.teamQ, seed.team, (raw) =>
    (raw as Rec[]).map((m) => ({ ...(m as Partial<TeamMember>), portrait: m.portrait ? figureToImageRef(m.portrait as never) : null }) as TeamMember),
  ).then((list) => list.filter((m) => !m.placeholder)),
);
export const getPois = cache(() => fetchOr<PointOfInterest[]>(q.poisQ, seed.pointsOfInterest));
export const getFaqs = cache(() => fetchOr<Faq[]>(q.faqsQ, seed.faqs));
export const getPress = cache(() =>
  fetchOr<PressArticle[]>(q.pressQ, seed.press, (raw) =>
    (raw as Rec[]).map((a) => ({ ...(a as Partial<PressArticle>), image: a.image ? figureToImageRef(a.image as never) : null }) as PressArticle),
  ).then((list) => list.filter((a) => !a.placeholder)),
);
export const getInvestmentSteps = cache(() => fetchOr<InvestmentStep[]>(q.stepsQ, seed.investmentSteps));
export const getIncentives = cache(() => fetchOr<Incentive[]>(q.incentivesQ, seed.incentives));
export const getPortfolio = cache(() =>
  fetchOr<PortfolioLocation[]>(q.portfolioQ, seed.portfolio, (raw) =>
    (raw as Rec[]).map((l) => ({ ...(l as Partial<PortfolioLocation>), image: l.image ? figureToImageRef(l.image as never) : null, pin: (l.pin as PortfolioLocation["pin"]) ?? null }) as PortfolioLocation),
  ),
);
export const getPages = cache(() =>
  fetchOr<GenericPage[]>(q.pagesQ, seed.pages, (raw) =>
    (raw as Rec[]).map((p) => {
      const f = seed.pages.find((x) => x.slug === p.slug);
      return { ...f, ...(p as Partial<GenericPage>), hero: p.hero ? (figureToImageRef(p.hero as never) ?? f?.hero) : f?.hero, sections: mapSections(p.sections, f?.sections ?? []) } as GenericPage;
    }),
  ),
);
export const getPage = cache(async (slug: string) => (await getPages()).find((p) => p.slug === slug) ?? null);
