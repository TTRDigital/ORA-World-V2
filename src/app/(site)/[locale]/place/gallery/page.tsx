import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getGallery } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { FeaturedCarousel } from "@/components/gallery/FeaturedCarousel";
import { optimisedImage } from "@/lib/image-props";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tg = await getTranslations({ locale, namespace: "gallery" });
  return pageMetadata({ locale, path: "/place/gallery", title: tg("title"), description: locale === "es" ? "Renders de Tesoro Del Mar y Dorado Waterfalls, exteriores, interiores, amenidades y estilo de vida." : "Tesoro Del Mar and Dorado Waterfalls renders: exteriors, interiors, amenities and lifestyle." });
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [images, tg, tn, tfc] = await Promise.all([getGallery(), getTranslations({ locale, namespace: "gallery" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "galleryCarousel" })]);
  // Featured: the landscape renders (exteriors, interiors, Dorado Waterfalls), never the portrait lifestyle photos.
  const featured = images
    .filter((g) => g.image.rendering && g.image.width / g.image.height > 1.5)
    .slice(0, 10)
    .map((g) => optimisedImage(g.image, locale, "(max-width: 767px) 80vw, (max-width: 1199px) 55vw, 560px"));
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("place"), path: "/place" }, { name: tg("title"), path: "/place/gallery" }])} />
      <PageHero locale={locale} label={tn("place")} headline={tg("title")} intro={locale === "es" ? "Cada imagen es una representación conceptual del artista, con su punto focal para que las torres nunca se recorten." : "Every image is an artist's conceptual rendering, each with a focal point so the towers are never cropped."} compact />
      <section className="panel panel-bone overflow-hidden py-10 md:py-14" aria-label={tfc("label")}>
        <p className="label container-x mb-6" data-reveal>{tfc("label")}</p>
        <FeaturedCarousel slides={featured} />
      </section>
      <section className="panel panel-travertine container-x section-y" aria-label={tg("title")}>
        <GalleryGrid images={images} locale={locale} />
      </section>
    </div>
  );
}
