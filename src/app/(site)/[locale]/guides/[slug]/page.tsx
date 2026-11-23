import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { guides, getGuide, GUIDE_PUBLISHED } from "@/content/guides";
import { getSiteSettings } from "@/lib/content";
import { JsonLd, faqLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/utils";
import { GuideArticle } from "@/components/guides/GuideArticle";

// The project sets no NEXT_PUBLIC_SITE_URL yet, so SITE_URL falls back to localhost; on a Vercel preview the guides'
// canonical, Open Graph and schema URLs use the deployment's branch address instead.
const BASE = process.env.NEXT_PUBLIC_SITE_URL ? SITE_URL : process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : SITE_URL;
/**
 * Buyer guides (TTR-2508). English only for now: the Spanish address sends visitors to Version B's Spanish homepage.
 * Staged for approval: always noindex until Kia and the client approve them (SOP website-approval).
 */
// Prerendered under both locales (the parent layout supplies the locale); the Spanish ones are static redirects.
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

type Params = Promise<{ locale: Locale; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  const url = `${BASE}/en/guides/${g.slug}`;
  const image = `${BASE}${g.hero.src}`;
  return {
    title: { absolute: g.metaTitle },
    description: g.metaDescription,
    alternates: { canonical: url, languages: { en: url, "x-default": url } },
    openGraph: { type: "article", title: g.metaTitle, description: g.metaDescription, url, siteName: "ORA World", locale: "en_US", publishedTime: GUIDE_PUBLISHED, images: [{ url: image, width: g.hero.width, height: g.hero.height, alt: g.hero.alt.en }] },
    twitter: { card: "summary_large_image", title: g.metaTitle, description: g.metaDescription, images: [image] },
    robots: { index: false, follow: false },
  };
}

export default async function GuidePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  if (locale !== "en") redirect(`/${locale}/b`);
  setRequestLocale(locale);
  const settings = await getSiteSettings();
  const url = `${BASE}/en/guides/${g.slug}`;
  const org = { "@type": "Organization", name: "ORA World", url: "https://www.oraworld.com", logo: { "@type": "ImageObject", url: `${BASE}/brand/ora-world-logo-gold.png` } };
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.metaDescription,
    image: [`${BASE}${g.hero.src}`],
    datePublished: GUIDE_PUBLISHED,
    dateModified: GUIDE_PUBLISHED,
    inLanguage: "en-US",
    author: org,
    publisher: org,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    about: {
      "@type": "Place",
      name: "Tesoro Del Mar",
      address: { "@type": "PostalAddress", addressLocality: "Dorado, Vega Alta", addressRegion: "PR", postalCode: "00692", addressCountry: "PR" },
      geo: { "@type": "GeoCoordinates", latitude: settings.siteLat, longitude: settings.siteLng },
    },
  };
  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={faqLd(g.faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ORA World", item: `${BASE}/en/b` },
            { "@type": "ListItem", position: 2, name: g.cardTitle, item: url },
          ],
        }}
      />
      {/* TTR-3011 (Kia, Nov 23): no calendar or booking on the website, so the guide's call buttons and links open the inquiry form. */}
      <GuideArticle guide={g} bookingUrl={null} legalNotice={settings.legalNotice} />
    </>
  );
}
