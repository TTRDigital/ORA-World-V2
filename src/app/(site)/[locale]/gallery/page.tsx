import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ImageRef, L, Locale } from "@/content/types";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { GalleryWall, type WallItem } from "@/components/gallery/GalleryWall";

/**
 * Gallery (client, 17 Nov: "add a gallery at the top of the page that shows all the images and everything we have,
 * based on the presentation"): the Tesoro del Mar renders only (18 Nov: actual images, not videos), in the order of a visit.
 */

// Client, 18 Nov: "pull all images from the presentation": the presentation's own image set (near-duplicates left out),
// in its order, as stills (no films).
type G = WallItem["group"];
const P = (file: string, w: number, h: number, en: string, es: string, focal = "50% 50%"): ImageRef => ({ src: `/images/presentation/${file}.jpg`, width: w, height: h, focal, alt: { en, es }, rendering: true });
const ENTRIES: { key: string; group: G; title: L; image: ImageRef }[] = [
  { key: "aerial-coast", group: "architecture", title: { en: "Above the cove", es: "Sobre la cala" }, image: P("aerial-coast", 2000, 1125, "Tesoro del Mar from the air, above a sandy cove on the north coast", "Tesoro del Mar desde el aire, sobre una cala de arena en la costa norte", "50% 40%") },
  { key: "aerial-community", group: "architecture", title: { en: "The community", es: "La comunidad" }, image: P("aerial-community", 1600, 900, "The towers and the community in the forest above the sea", "Las torres y la comunidad en el bosque sobre el mar", "50% 40%") },
  { key: "towers", group: "architecture", title: { en: "Inspired by flight", es: "Inspiradas en el vuelo" }, image: P("towers-garden", 2000, 1125, "The curved towers above landscaped gardens and palms", "Las torres curvas sobre jardines y palmeras", "50% 20%") },
  { key: "entrance", group: "architecture", title: { en: "The arrival", es: "La llegada" }, image: P("entrance", 2000, 1996, "The tower entrance beneath a sculpted canopy", "La entrada de la torre bajo un pórtico escultórico", "50% 45%") },
  { key: "foyer", group: "amenities", title: { en: "The foyer", es: "El vestíbulo" }, image: P("foyer", 2000, 1125, "The double-height foyer in marble and wood", "El vestíbulo de doble altura en mármol y madera") },
  { key: "pool", group: "amenities", title: { en: "Pool cabana", es: "Cabaña de la piscina" }, image: P("pool-cabana", 2000, 1125, "A poolside cabana beneath the towers", "Una cabaña junto a la piscina bajo las torres", "50% 30%") },
  { key: "putting", group: "amenities", title: { en: "Putting course", es: "Campo de putting" }, image: P("putting-green-wide", 2000, 1125, "The putting course and palm gardens between the towers", "El campo de putting y los jardines entre las torres") },
  { key: "gym", group: "amenities", title: { en: "Fitness center", es: "Gimnasio" }, image: P("gym", 2000, 1126, "The fitness center with garden views", "El gimnasio con vista al jardín") },
  { key: "dining", group: "residences", title: { en: "Living and dining", es: "Sala y comedor" }, image: P("dining", 2000, 1126, "Open living and dining room with a marble kitchen island", "Sala y comedor abiertos con isla de cocina en mármol") },
  { key: "kitchen", group: "residences", title: { en: "The gourmet kitchen", es: "La cocina gourmet" }, image: P("kitchen", 2000, 1126, "The gourmet kitchen with its glass wine wall", "La cocina gourmet con su cava de vidrio") },
  { key: "bedroom-primary", group: "residences", title: { en: "Primary suite", es: "Suite principal" }, image: P("bedroom-primary", 2000, 1125, "The primary suite with a sculpted headboard wall", "La suite principal con cabecero escultórico") },
  { key: "bedroom-ocean", group: "residences", title: { en: "Home and horizon", es: "Hogar y horizonte" }, image: P("bedroom-ocean", 2000, 1125, "A bedroom with floor-to-ceiling glass facing the Atlantic", "Un dormitorio con ventanal de piso a techo frente al Atlántico") },
  { key: "bedroom-suite", group: "residences", title: { en: "Bedroom suite", es: "Dormitorio" }, image: P("bedroom-suite", 2000, 1126, "A bedroom suite in warm wood and linen", "Un dormitorio en madera cálida y lino") },
  { key: "bath-primary", group: "residences", title: { en: "Primary bath", es: "Baño principal" }, image: P("bath-primary", 2000, 1125, "The primary bath with a double marble vanity", "El baño principal con doble lavabo de mármol") },
  { key: "bath-tub", group: "residences", title: { en: "Soaking tub", es: "Bañera" }, image: P("bath-tub", 2000, 1125, "A freestanding soaking tub in onyx and marble", "Una bañera exenta en ónix y mármol") },
  { key: "bath-guest", group: "residences", title: { en: "Guest bath", es: "Baño de invitados" }, image: P("bath-guest", 2000, 1126, "A guest bath with a stone vessel sink", "Un baño de invitados con lavabo de piedra") },
  { key: "study", group: "residences", title: { en: "Study", es: "Estudio" }, image: P("study", 2000, 1125, "A study with built-in shelving and ocean light", "Un estudio con estanterías y luz del mar") },
  { key: "ph-living", group: "residences", title: { en: "The Penthouse", es: "El Penthouse" }, image: P("ph-living", 2000, 1125, "The double-height penthouse living room", "El salón de doble altura del penthouse") },
  { key: "ph-stair", group: "residences", title: { en: "Penthouse, two levels", es: "Penthouse, dos niveles" }, image: P("ph-stair", 2000, 1125, "The penthouse floating staircase", "La escalera flotante del penthouse") },
  { key: "ph-piano", group: "residences", title: { en: "Penthouse salon", es: "Salón del penthouse" }, image: P("ph-piano", 2000, 1125, "The penthouse salon with a grand piano", "El salón del penthouse con piano de cola") },
  { key: "fin-palette", group: "finishes", title: { en: "Palette", es: "Paleta" }, image: P("fin-palette", 1600, 776, "The finishes palette: wood, stone and fabric samples", "La paleta de acabados: muestras de madera, piedra y tela") },
  { key: "fin-countertops", group: "finishes", title: { en: "Countertops", es: "Encimeras" }, image: P("fin-countertops", 1600, 776, "Neolith countertop surfaces", "Superficies de encimera Neolith") },
  { key: "fin-cabinetry", group: "finishes", title: { en: "Cabinetry", es: "Gabinetes" }, image: P("fin-cabinetry", 1600, 776, "Custom Italian cabinetry", "Gabinetes italianos a medida") },
  { key: "fin-appliances", group: "finishes", title: { en: "Appliances", es: "Electrodomésticos" }, image: P("fin-appliances", 1600, 776, "The integrated appliance suite", "La línea integrada de electrodomésticos") },
  { key: "fin-kitchen-fixtures", group: "finishes", title: { en: "Kitchen fixtures", es: "Grifería de cocina" }, image: P("fin-kitchen-fixtures", 1600, 776, "Kitchen faucets and sink", "Grifería y fregadero de cocina") },
  { key: "fin-bath-fixtures", group: "finishes", title: { en: "Bath fixtures", es: "Grifería de baño" }, image: P("fin-bath-fixtures", 1600, 776, "Dornbracht bath fixtures and a freestanding tub", "Grifería de baño Dornbracht y bañera exenta") },
  { key: "fin-closets", group: "finishes", title: { en: "Closets", es: "Vestidores" }, image: P("fin-closets", 1600, 776, "Walk-in closets with custom built-ins", "Vestidores con muebles a medida") },
  { key: "fin-lighting", group: "finishes", title: { en: "Lighting", es: "Iluminación" }, image: P("fin-lighting", 1600, 776, "Designer pendant lighting", "Lámparas colgantes de diseño") },
  { key: "fin-lighting-2", group: "finishes", title: { en: "Lighting, continued", es: "Iluminación, continuación" }, image: P("fin-lighting-2", 1600, 776, "Designer lighting in the living spaces", "Iluminación de diseño en las áreas sociales") },
  { key: "fin-shades", group: "finishes", title: { en: "Motorized shades", es: "Cortinas motorizadas" }, image: P("fin-shades", 1600, 776, "Motorized window shades", "Cortinas motorizadas") },
  { key: "fin-crestron", group: "finishes", title: { en: "Smart home", es: "Casa inteligente" }, image: P("fin-crestron", 1600, 776, "Crestron smart home controls", "Controles de casa inteligente Crestron") },
  { key: "life-dive", group: "lifestyle", title: { en: "Diving", es: "Buceo" }, image: P("life-dive", 700, 460, "A diver among fish in clear Caribbean water", "Un buzo entre peces en aguas claras del Caribe") },
  { key: "life-kids", group: "lifestyle", title: { en: "Family pool", es: "Piscina familiar" }, image: P("life-kids", 537, 806, "Children playing in the pool", "Niños jugando en la piscina", "50% 40%") },
  { key: "life-run", group: "lifestyle", title: { en: "A morning run", es: "Una carrera matutina" }, image: P("life-run", 1371, 1152, "Two residents running through the gardens", "Dos residentes corriendo entre los jardines", "50% 40%") },
  { key: "life-spa", group: "lifestyle", title: { en: "Spa", es: "Spa" }, image: P("life-spa", 615, 922, "A spa treatment room with candles and fern", "Una sala de tratamientos de spa con velas y helecho") },
  { key: "flag", group: "lifestyle", title: { en: "Tesoro del Mar", es: "Tesoro del Mar" }, image: P("flag", 1400, 1267, "The Tesoro del Mar flag against the sky", "La bandera de Tesoro del Mar contra el cielo") },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/gallery",
    title: locale === "es" ? "Galería" : "Gallery",
    description: locale === "es" ? "Renders de Tesoro del Mar: arquitectura, amenidades y residencias." : "Tesoro del Mar renders: architecture, amenities and residences.",
  });
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => l[locale] || l.en;
  // Client, 18 Nov: actual images, not videos: the still renders only.
  const items: WallItem[] = ENTRIES.map((e) => ({ key: e.key, group: e.group, title: x(e.title), image: e.image }));
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
                ? `Las ${items.length} imágenes de la presentación de Tesoro del Mar: arquitectura, amenidades, residencias, acabados y estilo de vida. Las representaciones son conceptuales del artista.`
                : `All ${items.length} images from the Tesoro del Mar presentation: architecture, amenities, residences, finishes and lifestyle. Renderings are artist's concepts.`}
            </p>
          </div>
          <div className="mt-10 md:mt-12">
            <GalleryWall
              items={items}
              locale={locale}
              labels={{
                all: es ? "Todo" : "All",
                residences: es ? "Residencias" : "Residences",
                amenities: es ? "Amenidades" : "Amenities",
                architecture: es ? "Arquitectura" : "Architecture",
                finishes: es ? "Acabados" : "Finishes",
                lifestyle: es ? "Estilo de vida" : "Lifestyle",
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
