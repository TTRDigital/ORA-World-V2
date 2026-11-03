import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { TourEmbed } from "@/components/place/TourEmbed";
import { tdm } from "@/content/seed/images";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tt = await getTranslations({ locale, namespace: "tour" });
  return pageMetadata({ locale, path: "/place/tour", title: tt("title"), description: locale === "es" ? "Recorra ORA World en 360° y vea la película." : "Walk ORA World in 360° and watch the film." });
}

export default async function TourPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [settings, tt, tn] = await Promise.all([getSiteSettings(), getTranslations({ locale, namespace: "tour" }), getTranslations({ locale, namespace: "nav" })]);
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("place"), path: "/place" }, { name: tt("title"), path: "/place/tour" }])} />
      <PageHero locale={locale} label={tn("place")} headline={tt("title")} intro={tt("tourNote")} compact />
      <section className="panel panel-basalt on-dark container-x section-y" data-tone="dark" aria-label={tt("title")}>
        <TourEmbed vrUrl={settings.vrTourUrl} youtubeId={settings.filmYoutubeId} poster={tdm.penthouseDining} locale={locale} />
      </section>
    </div>
  );
}
