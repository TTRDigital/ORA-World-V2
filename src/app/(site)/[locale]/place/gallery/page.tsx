import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getGallery } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tg = await getTranslations({ locale, namespace: "gallery" });
  return pageMetadata({ locale, path: "/place/gallery", title: tg("title"), description: locale === "es" ? "Renders de Tesoro Del Mar y Dorado Waterfalls, exteriores, interiores, amenidades y estilo de vida." : "Tesoro Del Mar and Dorado Waterfalls renders: exteriors, interiors, amenities and lifestyle." });
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [images, tg, tn] = await Promise.all([getGallery(), getTranslations({ locale, namespace: "gallery" }), getTranslations({ locale, namespace: "nav" })]);
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("place"), path: "/place" }, { name: tg("title"), path: "/place/gallery" }])} />
      <PageHero locale={locale} label={tn("place")} headline={tg("title")} intro={locale === "es" ? "Cada imagen es una representación conceptual del artista, con su punto focal para que las torres nunca se recorten." : "Every image is an artist's conceptual rendering, each with a focal point so the towers are never cropped."} compact />
      <section className="panel panel-travertine container-x section-y" aria-label={tg("title")}>
        <GalleryGrid images={images} locale={locale} />
      </section>
    </div>
  );
}
