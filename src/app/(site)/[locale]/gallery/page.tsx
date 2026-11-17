import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ImageRef, L, Locale } from "@/content/types";
import { tdm } from "@/content/seed/images";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { GalleryWall, type WallItem } from "@/components/gallery/GalleryWall";

/**
 * Gallery (client, 17 Nov: "add a gallery at the top of the page that shows all the images and everything we have,
 * based on the presentation"): the Tesoro del Mar renders and short films only, in the order of a visit.
 */
const film = (name: string, w: number, h: number, alt: L): ImageRef => ({ src: `/videos/clips/${name}-poster.jpg`, width: w, height: h, focal: "50% 50%", alt, rendering: true, video: `/videos/clips/${name}.mp4`, poster: `/videos/clips/${name}-poster.jpg` });

const ENTRIES: { key: string; group: WallItem["group"]; title: L; image: ImageRef }[] = [
  { key: "jet", group: "amenities", title: { en: "Arrival by private jet", es: "Llegada en jet privado" }, image: { ...film("jet-arrival", 1632, 544, { en: "The ORA World jet on the apron, guests stepping down to the tarmac", es: "El jet de ORA World en la plataforma, con huéspedes bajando a la pista" }), focal: "24% 60%" } },
  { key: "aerial-coast", group: "architecture", title: { en: "Above the cove", es: "Sobre la cala" }, image: tdm.aerialCoast },
  { key: "aerial-towers", group: "architecture", title: { en: "The towers in the forest", es: "Las torres en el bosque" }, image: tdm.aerialTowers },
  { key: "aerial-forest", group: "architecture", title: { en: "Rising from the canopy", es: "Sobre el dosel" }, image: tdm.aerialForest },
  { key: "aerial-villas", group: "architecture", title: { en: "Towers and villas", es: "Torres y villas" }, image: tdm.aerialVillas },
  { key: "road", group: "architecture", title: { en: "The arrival road", es: "La vía de llegada" }, image: tdm.exteriorRoad },
  { key: "entrance", group: "architecture", title: { en: "The entrance", es: "La entrada" }, image: tdm.entrance },
  { key: "foyer", group: "amenities", title: { en: "The lobby", es: "El vestíbulo" }, image: tdm.foyerAtrium },
  { key: "reception", group: "amenities", title: { en: "Reception", es: "Recepción" }, image: tdm.foyerReception },
  { key: "lounge", group: "amenities", title: { en: "Lobby lounge", es: "Salón del vestíbulo" }, image: tdm.foyerLounge },
  { key: "signage", group: "amenities", title: { en: "Lobby seating", es: "Zona de estar del vestíbulo" }, image: tdm.foyerSignage },
  { key: "pool", group: "amenities", title: { en: "Pool deck", es: "Piscina" }, image: tdm.exteriorPull },
  { key: "putting", group: "amenities", title: { en: "Putting course", es: "Campo de putting" }, image: tdm.exteriorGolf },
  { key: "gym", group: "amenities", title: { en: "Fitness center", es: "Gimnasio" }, image: tdm.gym },
  { key: "living", group: "residences", title: { en: "Living and dining", es: "Sala y comedor" }, image: tdm.aptLiving },
  { key: "living-2", group: "residences", title: { en: "Living room", es: "Sala" }, image: tdm.aptLiving2 },
  { key: "kitchen", group: "residences", title: { en: "Gourmet kitchen", es: "Cocina gourmet" }, image: tdm.kitchenWine },
  { key: "suite", group: "residences", title: { en: "Primary suite", es: "Suite principal" }, image: tdm.masterSuite },
  { key: "bedroom-ocean", group: "residences", title: { en: "Ocean-view bedroom", es: "Dormitorio con vista al mar" }, image: tdm.bedroomOcean },
  { key: "guest", group: "residences", title: { en: "Guest bedroom", es: "Dormitorio de invitados" }, image: tdm.aptBedroom },
  { key: "bath", group: "residences", title: { en: "Primary bath", es: "Baño principal" }, image: tdm.aptBath2 },
  { key: "vanity", group: "residences", title: { en: "Double vanity", es: "Doble lavabo" }, image: tdm.vanity },
  { key: "powder", group: "residences", title: { en: "Powder room", es: "Medio baño" }, image: tdm.powderRoom },
  { key: "study", group: "residences", title: { en: "Study", es: "Estudio" }, image: tdm.aptStudy },
  { key: "suite-hotel", group: "residences", title: { en: "Hotel suite", es: "Suite de hotel" }, image: tdm.hotelSuite },
  { key: "ph-living", group: "residences", title: { en: "Penthouse living", es: "Salón del penthouse" }, image: tdm.penthouseLiving },
  { key: "ph-stair", group: "residences", title: { en: "Penthouse, two levels", es: "Penthouse, dos niveles" }, image: film("p25-penthouse-living-a", 1248, 704, { en: "The two-level penthouse living room with its floating stair", es: "El salón de dos niveles del penthouse con su escalera flotante" }) },
  { key: "ph-stair-2", group: "residences", title: { en: "The floating stair", es: "La escalera flotante" }, image: film("p25-penthouse-living-b", 1248, 704, { en: "The penthouse living room and its floating marble stair", es: "El salón del penthouse y su escalera flotante de mármol" }) },
  { key: "ph-dining", group: "residences", title: { en: "Penthouse dining", es: "Comedor del penthouse" }, image: tdm.penthouseDining },
  { key: "ph-piano", group: "residences", title: { en: "Penthouse salon", es: "Salón del penthouse" }, image: tdm.penthousePiano },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/gallery",
    title: locale === "es" ? "Galería" : "Gallery",
    description: locale === "es" ? "Renders y películas de Tesoro del Mar: arquitectura, amenidades y residencias." : "Tesoro del Mar renders and films: architecture, amenities and residences.",
  });
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => l[locale] || l.en;
  const items: WallItem[] = ENTRIES.map((e) => ({ key: e.key, group: e.group, title: x(e.title), image: e.image, video: e.image.video, poster: e.image.poster }));
  const films = items.filter((i) => i.video).length;
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: es ? "Galería" : "Gallery", path: "/gallery" }])} />
      <section aria-labelledby="gallery-title" className="bg-bone px-5 pt-14 pb-16 md:px-10 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-12">
            <div>
              <p className="eyebrow">
                <span className="rule" aria-hidden />
                Tesoro del Mar
              </p>
              <h1 id="gallery-title" className="mt-5 font-[family-name:var(--font-display)] text-[44px] leading-[1.05] font-normal text-charcoal md:text-[64px]">
                {es ? "Galería" : "Gallery"}
              </h1>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]">
              {es
                ? `${items.length} vistas de Tesoro del Mar, ${films} de ellas en movimiento: la llegada, la arquitectura, las amenidades y las residencias. Representaciones conceptuales del artista.`
                : `${items.length} views of Tesoro del Mar, ${films} of them in motion: the arrival, the architecture, the amenities and the residences. Artist's conceptual renderings.`}
            </p>
          </div>
          <div className="mt-10 md:mt-12">
            <GalleryWall
              items={items}
              locale={locale}
              labels={{
                all: es ? "Todo" : "All",
                films: es ? "Películas" : "Films",
                residences: es ? "Residencias" : "Residences",
                amenities: es ? "Amenidades" : "Amenities",
                architecture: es ? "Arquitectura" : "Architecture",
                film: es ? "Película" : "Film",
                close: es ? "Cerrar" : "Close",
                prev: es ? "Anterior" : "Previous",
                next: es ? "Siguiente" : "Next",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
