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
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tn = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({ locale, path: "/longevity", title: tn("longevity"), description: t(cip.who.intro, locale) });
}

export default async function LongevityPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: "nav" });
  const card = cip.different.items[0];
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("longevity"), path: "/longevity" }])} />
      <PageHero locale={locale} label="ORA World" headline={t(card.title, locale)} intro={t(card.text, locale)} image={life.spa} />
      <LongevitySections locale={locale} />
    </div>
  );
}
