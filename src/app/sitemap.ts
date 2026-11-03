import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";
import { getCollections, getFloorPlans, getPress, getProjects } from "@/lib/content";

const staticPaths = ["", "/residences", "/residences/plans", "/residences/compare", "/living", "/place", "/place/gallery", "/place/tour", "/invest", "/portfolio", "/visit", "/brokers", "/careers", "/hotel-development", "/faq", "/privacy", "/terms", "/accessibility", "/legal-disclaimer"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, plans, projects, press] = await Promise.all([getCollections(), getFloorPlans(), getProjects(), getPress()]);
  const paths = [
    ...staticPaths,
    ...collections.map((c) => `/residences/${c.slug}`),
    ...plans.map((p) => `/residences/plans/${p.slug}`),
    ...projects.map((p) => `/place/${p.slug}`),
    ...(press.length ? ["/press", ...press.map((a) => `/press/${a.slug}`)] : []),
  ];
  const now = new Date();
  return paths.map((p) => ({
    url: `${SITE_URL}/en${p}`,
    lastModified: now,
    alternates: { languages: { en: `${SITE_URL}/en${p}`, es: `${SITE_URL}/es${p}` } },
  }));
}
