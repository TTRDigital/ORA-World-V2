import type { Metadata } from "next";
import { SITE_URL, IS_PROD } from "./utils";
import type { Locale } from "@/content/types";
import { LEGAL_NOTICE } from "@/content/seed/site";

const pathFor = (locale: Locale, path: string) => `/${locale}${path === "/" ? "" : path}`;

/** Canonical + hreflang + OG for a localized route. */
export function pageMetadata(opts: { locale: Locale; path: string; title: string; description: string; image?: string; noIndex?: boolean }): Metadata {
  const canonical = `${SITE_URL}${pathFor(opts.locale, opts.path)}`;
  const og = opts.image || `${SITE_URL}/api/og?title=${encodeURIComponent(opts.title)}&locale=${opts.locale}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical,
      languages: { en: `${SITE_URL}${pathFor("en", opts.path)}`, es: `${SITE_URL}${pathFor("es", opts.path)}`, "x-default": `${SITE_URL}${pathFor("en", opts.path)}` },
    },
    openGraph: { title: opts.title, description: opts.description, url: canonical, siteName: "ORA World", locale: opts.locale === "es" ? "es_PR" : "en_US", type: "website", images: [{ url: og, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [og] },
    robots: opts.noIndex || !IS_PROD ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const organizationLd = (locale: Locale) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ORA World",
  url: `${SITE_URL}/${locale}`,
  logo: `${SITE_URL}/brand/ora-world-logo-gold.png`,
  address: { "@type": "PostalAddress", streetAddress: "Tesoro Del Mar", addressLocality: "Dorado, Vega Alta", addressRegion: "PR", postalCode: "00692", addressCountry: "PR" },
  sameAs: ["https://www.oraworld.com"],
});

export const residenceLd = (locale: Locale, name: string, description: string, image: string) => ({
  "@context": "https://schema.org",
  "@type": "Residence",
  name,
  description,
  image,
  url: `${SITE_URL}/${locale}/residences`,
  address: { "@type": "PostalAddress", addressLocality: "Dorado, Vega Alta", addressRegion: "PR", postalCode: "00692", addressCountry: "PR" },
});

export const placeLd = (locale: Locale, name: string, description: string, path: string, image: string, lat: number | null, lng: number | null) => ({
  "@context": "https://schema.org",
  "@type": "Place",
  name,
  description,
  image,
  url: `${SITE_URL}/${locale}${path}`,
  ...(lat && lng ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } } : {}),
  address: { "@type": "PostalAddress", addressLocality: "Dorado", addressRegion: "PR", addressCountry: "PR" },
});

export const breadcrumbLd = (locale: Locale, items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${pathFor(locale, it.path)}` })),
});

export const faqLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
});

export { LEGAL_NOTICE };
