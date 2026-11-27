import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { PageHero } from "@/components/ui/PageHero";
import { LongevitySections } from "@/components/home/LongevitySections";
import { life } from "@/content/seed/images";

/** Longevity (client, 16 Nov): the preventive health and fitness sections, moved here from the homepage. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tn = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({
    locale,
    path: "/longevity",
    title: tn("longevity"),
    description: t(cip.who.intro, locale),
  });
}

export default async function LongevityPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: "nav" });
  // Client, 18 Nov: the page is all about longevity: the Longevity card, found by kind (not by position, which changed).
  const card = cip.different.items.find((it) => it.kind === "health")!;
  // Client, 18 Nov: the ocean-view spa film in the banner (its first frame as the still).
  const spaFilm = {
    ...life.spa,
    src: "/videos/clips/spa-ocean-poster.jpg",
    width: 1248,
    height: 704,
    focal: "50% 50%",
    alt: {
      en: "An ocean-view treatment room at the spa",
      es: "Una sala de tratamientos con vista al mar en el spa",
    },
    video: "/videos/clips/spa-ocean.mp4",
    poster: "/videos/clips/spa-ocean-poster.jpg",
  };
  return (
    <div className="flex flex-col">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: "ORA World", path: "/" },
          { name: tn("longevity"), path: "/longevity" },
        ])}
      />
      <PageHero
        locale={locale}
        label={tn("longevity")}
        headline={t(card.title, locale)}
        intro={t(card.text, locale)}
        image={spaFilm}
      />
      <LongevitySections locale={locale} />
    </div>
  );
}
