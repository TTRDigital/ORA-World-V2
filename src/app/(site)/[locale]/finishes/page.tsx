import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ImageRef, L, Locale } from "@/content/types";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { scavolini } from "@/content/seed/finishes";
import { FinishPalette } from "@/components/finishes/FinishPalette";
import { ProductGrid } from "@/components/finishes/ProductGrid";
import Image from "next/image";
import { SelectionTray } from "@/components/finishes/SelectionTray";

/**
 * Finishes (client, 18 Nov: "a page all about the finishes in the presentation, really nice and clean, divided like the
 * presentation: kitchen finishes, kitchen appliances, counters, closets..."). Every brand, product and finish name is
 * as printed on the presentation's finish boards; selections are subject to the Offering Plan.
 */
type Swatch = { name: string; src?: string; color?: string; group?: string };
type Prod = { name: L; maker?: string; spec?: L; src: string; photo?: boolean };
type Chapter = { photos?: string[]; products?: Prod[]; id: string; group: L; label: L; title: L; intro: L; brands: string; board: ImageRef; items: L[]; swatches?: Swatch[]; swatchLabel?: L };

const board = (file: string, en: string, es: string): ImageRef => ({ src: `/images/presentation/${file}.jpg`, width: 1600, height: 776, focal: "50% 50%", alt: { en, es } });
const KITCHEN: L = { en: "Kitchen", es: "Cocina" };


const CHAPTERS: Chapter[] = [
  {
    id: "cabinetry",
    photos: ["/images/finishes/p/cab-3.jpg","/images/finishes/p/cab-1.jpg","/images/finishes/p/cab-2.jpg"],
    group: KITCHEN,
    label: { en: "Cabinetry", es: "Gabinetes" },
    title: { en: "Italian cabinetry, your palette", es: "Gabinetes italianos, su paleta" },
    intro: {
      en: "Custom Scavolini cabinetry in 71 finishes: walnuts and oaks, fluted slats, lacquers and soft greys.",
      es: "Gabinetes Scavolini a medida en 71 acabados: nogales y robles, listones acanalados, lacados y grises suaves.",
    },
    brands: "Scavolini",
    board: board("fin-palette", "The Scavolini finishes palette: woods, lacquers and slatted fronts", "La paleta de acabados Scavolini: maderas, lacados y frentes de listones"),
    items: [
      { en: "Walnut and oak veneers", es: "Chapas de nogal y roble" },
      { en: "Vertical and horizontal slats", es: "Listones verticales y horizontales" },
      { en: "Matt and glossy lacquers", es: "Lacados mate y brillante" },
      { en: "Glass-front display cabinets", es: "Vitrinas con frente de vidrio" },
    ],
    swatchLabel: { en: "All 71 finishes", es: "Los 71 acabados" },
    swatches: scavolini,
  },
  {
    id: "countertops",
    group: KITCHEN,
    label: { en: "Countertops", es: "Encimeras" },
    title: { en: "Sintered stone counters", es: "Encimeras de piedra sinterizada" },
    intro: {
      en: "Neolith surfaces for counters, islands and backsplashes, in four stones.",
      es: "Superficies Neolith para encimeras, islas y salpicaderos, en cuatro piedras.",
    },
    brands: "Neolith",
    board: board("fin-countertops", "Neolith countertops: Sofia Cuprum, Calacatta, Zaha Stone and Mont Blanc", "Encimeras Neolith: Sofia Cuprum, Calacatta, Zaha Stone y Mont Blanc"),
    items: [
      { en: "Sofia Cuprum", es: "Sofia Cuprum" },
      { en: "Calacatta", es: "Calacatta" },
      { en: "Zaha Stone", es: "Zaha Stone" },
      { en: "Mont Blanc", es: "Mont Blanc" },
    ],
    swatchLabel: { en: "The four stones", es: "Las cuatro piedras" },
    swatches: [
      { name: "Sofia Cuprum", src: "/images/finishes/sw-sofia-cuprum.jpg" },
      { name: "Calacatta", src: "/images/finishes/sw-calacatta.jpg" },
      { name: "Zaha Stone", src: "/images/finishes/neolith-zaha-stone.jpg" },
      { name: "Mont Blanc", src: "/images/finishes/sw-mont-blanc.jpg" },
    ],
  },
  {
    id: "appliances",
    products: [{ src: "/images/finishes/p/fridge.jpg", name: { en: "Refrigerator column", es: "Columna refrigerador" }, maker: "Gaggenau", spec: { en: "Vario 400 · RC 472 · fully integrated, 30 in", es: "Vario 400 · RC 472 · totalmente integrada, 30 pulg." } },
      { src: "/images/finishes/p/freezer.jpg", name: { en: "Freezer column", es: "Columna congelador" }, maker: "Gaggenau", spec: { en: "Vario 400 · RF 471 · fully integrated, 30 in", es: "Vario 400 · RF 471 · totalmente integrada, 30 pulg." } },
      { src: "/images/finishes/p/oven.jpg", name: { en: "Oven", es: "Horno" }, maker: "Gaggenau", spec: { en: "Expressive · GO 480/481 · steel behind smoked glass, 30 in", es: "Expressive · GO 480/481 · acero tras vidrio ahumado, 30 pulg." } },
      { src: "/images/finishes/p/combi.jpg", name: { en: "Combi-microwave oven", es: "Horno combinado con microondas" }, maker: "Gaggenau", spec: { en: "Expressive · GM 480/481 · 30 in", es: "Expressive · GM 480/481 · 30 pulg." } },
      { src: "/images/finishes/p/cooktop.jpg", name: { en: "Induction cooktop", es: "Placa de inducción" }, maker: "Gaggenau", spec: { en: "Vario 400 full surface · CX 492 · 36 in", es: "Vario 400 de superficie completa · CX 492 · 36 pulg." } },
      { src: "/images/finishes/p/espresso.jpg", name: { en: "Espresso machine", es: "Cafetera espresso" }, maker: "Gaggenau", spec: { en: "Expressive · GC 461 · fully automatic, plumbed", es: "Expressive · GC 461 · totalmente automática, con toma de agua" } },
      { src: "/images/finishes/p/dishwasher.jpg", name: { en: "Dishwasher", es: "Lavavajillas" }, maker: "Gaggenau", spec: { en: "400 series · 24 in · very quiet, 42 dB", es: "Serie 400 · 24 pulg. · muy silencioso, 42 dB" } },
      { src: "/images/finishes/p/wine.jpg", name: { en: "Wine storage", es: "Cava de vinos" }, maker: "Gaggenau", spec: { en: "200 series · RW 404 · under-counter, 24 in", es: "Serie 200 · RW 404 · bajo encimera, 24 pulg." } },
      { src: "/images/finishes/p/hood.jpg", name: { en: "Insert hood", es: "Campana empotrada" }, maker: "Thermador", spec: { en: "Masterpiece · VCI6B30ZS · 30 in", es: "Masterpiece · VCI6B30ZS · 30 pulg." } },
      { src: "/images/finishes/p/washer.jpg", name: { en: "Compact washer", es: "Lavadora compacta" }, maker: "Bosch", spec: { en: "500 Series · WGB24600UC · 24 in, Home Connect", es: "Serie 500 · WGB24600UC · 24 pulg., Home Connect" } },
      { src: "/images/finishes/p/dryer.jpg", name: { en: "Heat pump dryer", es: "Secadora con bomba de calor" }, maker: "Bosch", spec: { en: "500 Series · WQB245B0UC · 24 in, Home Connect", es: "Serie 500 · WQB245B0UC · 24 pulg., Home Connect" } }],
    group: KITCHEN,
    label: { en: "Appliances", es: "Electrodomésticos" },
    title: { en: "A fully integrated suite", es: "Una línea totalmente integrada" },
    intro: {
      en: "Gaggenau in the kitchen, a Thermador hood, and a Bosch washer and dryer pair.",
      es: "Gaggenau en la cocina, una campana Thermador y una lavadora y secadora Bosch.",
    },
    brands: "Gaggenau · Thermador · Bosch",
    board: board("fin-appliances", "The appliance suite: Gaggenau, Thermador and Bosch", "La línea de electrodomésticos: Gaggenau, Thermador y Bosch"),
    items: [
      { en: "Gaggenau Vario 400 refrigerator and freezer columns", es: "Columnas de refrigerador y congelador Gaggenau Vario 400" },
      { en: "Gaggenau Expressive oven and combi-microwave oven", es: "Horno y horno combinado con microondas Gaggenau Expressive" },
      { en: "Gaggenau Vario 400 full-surface induction cooktop", es: "Placa de inducción de superficie completa Gaggenau Vario 400" },
      { en: "Gaggenau fully automatic espresso machine", es: "Cafetera espresso totalmente automática Gaggenau" },
      { en: "Gaggenau 400 series dishwasher", es: "Lavavajillas Gaggenau serie 400" },
      { en: "Gaggenau under-counter wine storage", es: "Cava de vinos bajo encimera Gaggenau" },
      { en: "Thermador 30-inch custom insert hood", es: "Campana Thermador empotrada de 30 pulgadas" },
      { en: "Bosch 500 Series compact washer and heat pump dryer", es: "Lavadora compacta y secadora con bomba de calor Bosch serie 500" },
    ],
  },
  {
    id: "kitchen-fixtures",
    products: [{ src: "/images/finishes/p/faucets.jpg", name: { en: "Pull-down faucet", es: "Grifo extraíble" }, maker: "Dornbracht", spec: { en: "Single lever with spray, in four finishes", es: "Monomando con rociador, en cuatro acabados" } },
      { src: "/images/finishes/p/sink.jpg", name: { en: "Undermount sink", es: "Fregadero bajo encimera" }, spec: { en: "Single bowl, 32 in, with accessories", es: "Una cuba, 32 pulg., con accesorios" }, photo: true },
      { src: "/images/finishes/p/strainer.jpg", name: { en: "Sink strainer", es: "Colador de fregadero" }, spec: { en: "Duostrainer drain with tailpiece", es: "Desagüe Duostrainer con tubo" } }],
    group: KITCHEN,
    label: { en: "Kitchen fixtures", es: "Grifería de cocina" },
    title: { en: "The faucet and the sink", es: "La grifería y el fregadero" },
    intro: {
      en: "A Dornbracht pull-down faucet over an undermount sink.",
      es: "Un grifo extraíble Dornbracht sobre un fregadero bajo encimera.",
    },
    brands: "Dornbracht",
    board: board("fin-kitchen-fixtures", "Dornbracht kitchen faucets and the undermount sink", "Grifería de cocina Dornbracht y el fregadero bajo encimera"),
    items: [
      { en: "Single-lever pull-down mixer with spray function", es: "Mezclador monomando extraíble con función de rociador" },
      { en: "Undermount single-bowl kitchen sink with accessories", es: "Fregadero bajo encimera de una cuba con accesorios" },
      { en: "Sink drain and strainer", es: "Desagüe y colador del fregadero" },
    ],
  },
  {
    id: "bath",
    products: [{ src: "/images/finishes/p/lav-mixer.jpg", name: { en: "Lavatory mixer", es: "Mezclador de lavabo" }, maker: "Dornbracht", spec: { en: "Meta · three-hole, brushed champagne", es: "Meta · tres orificios, champán cepillado" } },
      { src: "/images/finishes/p/tub-mixer.jpg", name: { en: "Tub mixer", es: "Mezclador de bañera" }, maker: "Dornbracht", spec: { en: "Meta · wall-mounted, with hand shower set", es: "Meta · de pared, con teléfono de ducha" } },
      { src: "/images/finishes/p/rain-shower.jpg", name: { en: "Rain shower", es: "Ducha de lluvia" }, maker: "Dornbracht", spec: { en: "Wall head and arm", es: "Rociador y brazo de pared" } },
      { src: "/images/finishes/p/slide-bar.jpg", name: { en: "Slide bar", es: "Barra deslizante" }, maker: "Dornbracht", spec: { en: "Shower slide bar set", es: "Barra de ducha deslizante" } },
      { src: "/images/finishes/p/hand-shower.jpg", name: { en: "Hand shower", es: "Teléfono de ducha" }, maker: "Dornbracht", spec: { en: "Brushed champagne", es: "Champán cepillado" } },
      { src: "/images/finishes/p/thermostat.jpg", name: { en: "Concealed thermostat", es: "Termostato empotrado" }, maker: "Dornbracht", spec: { en: "Brushed champagne", es: "Champán cepillado" } },
      { src: "/images/finishes/p/tub.jpg", name: { en: "Freestanding tub", es: "Bañera exenta" }, spec: { en: "Marquis 7034 Metro · white", es: "Marquis 7034 Metro · blanca" } },
      { src: "/images/finishes/p/toilet.jpg", name: { en: "Wall-hung toilet", es: "Inodoro suspendido" }, spec: { en: "RP compact", es: "RP compacto" } },
      { src: "/images/finishes/p/flush-plate.jpg", name: { en: "Flush plate", es: "Placa de descarga" }, maker: "Geberit", spec: { en: "Round, brushed champagne", es: "Redonda, champán cepillado" } },
      { src: "/images/finishes/p/robe-hook.jpg", name: { en: "Robe hook", es: "Colgador" }, maker: "Dornbracht", spec: { en: "Brushed champagne", es: "Champán cepillado" } },
      { src: "/images/finishes/p/tissue.jpg", name: { en: "Tissue holder", es: "Portarrollos" }, maker: "Dornbracht", spec: { en: "Brushed champagne", es: "Champán cepillado" } }],
    group: { en: "Bath", es: "Baño" },
    label: { en: "Bath", es: "Baño" },
    title: { en: "Brushed champagne, throughout the bath", es: "Champán cepillado en todo el baño" },
    intro: {
      en: "Dornbracht fixtures in brushed champagne, a freestanding tub and a wall-hung toilet.",
      es: "Grifería Dornbracht en champán cepillado, bañera exenta e inodoro suspendido.",
    },
    brands: "Dornbracht",
    board: board("fin-bath-fixtures", "Dornbracht bath fixtures in brushed champagne with a freestanding tub", "Grifería de baño Dornbracht en champán cepillado con bañera exenta"),
    items: [
      { en: "Meta three-hole lavatory mixer", es: "Mezclador de lavabo Meta de tres orificios" },
      { en: "Meta tub mixer with hand shower set", es: "Mezclador de bañera Meta con teléfono de ducha" },
      { en: "Shower rain head, slide bar and hand shower", es: "Ducha de lluvia, barra deslizante y teléfono de ducha" },
      { en: "Concealed thermostat", es: "Termostato empotrado" },
      { en: "Freestanding soaking tub", es: "Bañera exenta" },
      { en: "Compact wall-hung toilet and Geberit flush plate", es: "Inodoro suspendido compacto y placa Geberit" },
      { en: "Robe hook and tissue holder", es: "Colgador y portarrollos" },
    ],
  },
  {
    id: "closets",
    photos: ["/images/finishes/p/closet-2.jpg","/images/finishes/p/closet-1.jpg"],
    group: { en: "Closets", es: "Vestidores" },
    label: { en: "Closets", es: "Vestidores" },
    title: { en: "Walk-in closets, built in", es: "Vestidores a medida" },
    intro: {
      en: "Rimadesio wardrobes and walk-in systems: glass doors, lit shelving and warm wood.",
      es: "Armarios y vestidores Rimadesio: puertas de vidrio, estantes iluminados y madera cálida.",
    },
    brands: "Rimadesio",
    board: board("fin-closets", "Rimadesio wardrobes and a glass-fronted walk-in closet", "Armarios Rimadesio y un vestidor con frente de vidrio"),
    items: [
      { en: "Built-in wardrobes", es: "Armarios empotrados" },
      { en: "Glass-fronted walk-in closets", es: "Vestidores con frente de vidrio" },
      { en: "Integrated lighting", es: "Iluminación integrada" },
    ],
  },
  {
    id: "lighting",
    products: [{ src: "/images/finishes/p/q3.jpg", name: { en: "Q3 ceiling lamp", es: "Lámpara de techo Q3" }, maker: "Baxter", spec: { en: "Crystal cube chandelier", es: "Lámpara de cristal en cubo" }, photo: true },
      { src: "/images/finishes/p/coordinates.jpg", name: { en: "Coordinates suspension", es: "Suspensión Coordinates" }, maker: "Flos", spec: { en: "Brass lines of light", es: "Líneas de luz en latón" } },
      { src: "/images/finishes/p/selene.jpg", name: { en: "Selene", es: "Selene" }, maker: "ClassiCon", spec: { en: "Cascade of glass globes", es: "Cascada de globos de vidrio" } },
      { src: "/images/finishes/p/laird.jpg", name: { en: "Laird More and Wand", es: "Laird More y Wand" }, maker: "Lamptron", spec: { en: "Slim pendants in clusters", es: "Colgantes finos en grupo" } },
      { src: "/images/finishes/p/larseric.jpg", name: { en: "Larseric", es: "Larseric" }, maker: "Lamptron", spec: { en: "Long sculpted fixture", es: "Lámpara alargada escultórica" } },
      { src: "/images/finishes/p/ring.jpg", name: { en: "Ring suspension", es: "Suspensión en anillo" }, maker: "Moooi", spec: { en: "Branches of leaf-shaped lights", es: "Ramas de luces en forma de hoja" } },
      { src: "/images/finishes/p/formagenda.jpg", name: { en: "Pendant", es: "Colgante" }, maker: "Formagenda", spec: { en: "Stacked opal globes", es: "Globos opalinos apilados" } },
      { src: "/images/finishes/p/sanssouci.jpg", name: { en: "Suspension", es: "Suspensión" }, maker: "Sans Souci", spec: { en: "Gold-touched glass leaves", es: "Hojas de vidrio con toques dorados" } },
      { src: "/images/finishes/p/torsade.jpg", name: { en: "Torsade wall lamp", es: "Aplique Torsade" }, maker: "Carlyle Collective", spec: { en: "Polished gold", es: "Oro pulido" } }],
    group: { en: "Lighting", es: "Iluminación" },
    label: { en: "Lighting", es: "Iluminación" },
    title: { en: "Light, by designers", es: "Luz, de diseñadores" },
    intro: {
      en: "Statement pendants and wall lights from Italian and European houses.",
      es: "Lámparas colgantes y apliques de casas italianas y europeas.",
    },
    brands: "Baxter · Flos · Lamptron · ClassiCon · Formagenda · Moooi · Sans Souci · Carlyle Collective",
    board: board("fin-lighting", "Designer lighting: Baxter, Flos, Lamptron and ClassiCon", "Iluminación de diseño: Baxter, Flos, Lamptron y ClassiCon"),
    items: [
      { en: "Q3 ceiling lamp by Baxter", es: "Lámpara de techo Q3 de Baxter" },
      { en: "Coordinates suspension by Flos", es: "Suspensión Coordinates de Flos" },
      { en: "Selene by ClassiCon", es: "Selene de ClassiCon" },
      { en: "Laird More and Wand pendants", es: "Colgantes Laird More y Wand" },
      { en: "Larseric long fixture by Lamptron", es: "Lámpara alargada Larseric de Lamptron" },
      { en: "Torsade wall lamp by Carlyle Collective", es: "Aplique Torsade de Carlyle Collective" },
    ],
  },
  {
    id: "shades",
    photos: ["/images/finishes/p/shade-1.jpg","/images/finishes/p/shade-app.jpg","/images/finishes/p/shade-3.jpg"],
    group: { en: "Smart home", es: "Casa inteligente" },
    label: { en: "Shades", es: "Cortinas" },
    title: { en: "Shades that move with the sun", es: "Cortinas que se mueven con el sol" },
    intro: {
      en: "Lutron motorized shades in every room, set by scene or from your phone.",
      es: "Cortinas motorizadas Lutron en cada habitación, por escena o desde su teléfono.",
    },
    brands: "Lutron",
    board: board("fin-shades", "Lutron motorized shades over the ocean, with the app", "Cortinas motorizadas Lutron frente al mar, con la aplicación"),
    items: [
      { en: "Motorized roller shades and sheers", es: "Cortinas enrollables y visillos motorizados" },
      { en: "Scenes from the app", es: "Escenas desde la aplicación" },
      { en: "Slim, recessed headrails", es: "Cabezales delgados y empotrados" },
    ],
  },
  {
    id: "smart-home",
    photos: ["/images/finishes/p/crestron-room.jpg","/images/finishes/p/crestron-app.jpg"],
    group: { en: "Smart home", es: "Casa inteligente" },
    label: { en: "Smart home", es: "Casa inteligente" },
    title: { en: "A Crestron Home is simply smart", es: "Un hogar Crestron es simplemente inteligente" },
    intro: {
      en: "Climate, security, locks, lighting, shades and audio, from one app or a keypad on the wall.",
      es: "Clima, seguridad, cerraduras, iluminación, cortinas y audio, desde una aplicación o un teclado en la pared.",
    },
    brands: "Crestron Home",
    board: board("fin-crestron", "Crestron Home: the app, a living room and the keypad finishes", "Crestron Home: la aplicación, una sala y los acabados de los teclados"),
    items: [
      { en: "Thermostat", es: "Termostato" },
      { en: "Security", es: "Seguridad" },
      { en: "Door locks and alarms", es: "Cerraduras y alarmas" },
      { en: "Lighting", es: "Iluminación" },
      { en: "Shading", es: "Cortinas" },
      { en: "Audio", es: "Audio" },
    ],
    swatchLabel: { en: "Keypad finishes", es: "Acabados de los teclados" },
    swatches: [
      { name: "Brushed Brass", color: "linear-gradient(135deg,#e7cf98,#b8975a)" },
      { name: "Dark Nickel", color: "linear-gradient(135deg,#c9c7c4,#8c8a87)" },
      { name: "Dark Bronze", color: "linear-gradient(135deg,#9a8378,#5d4a42)" },
      { name: "Brushed Black", color: "linear-gradient(135deg,#55575b,#26272a)" },
    ],
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/finishes",
    title: locale === "es" ? "Acabados" : "Finishes",
    description:
      locale === "es"
        ? "Los acabados de Tesoro del Mar: gabinetes Scavolini, encimeras Neolith, electrodomésticos Gaggenau, grifería Dornbracht, vestidores Rimadesio, Lutron y Crestron."
        : "The Tesoro del Mar finishes: Scavolini cabinetry, Neolith counters, Gaggenau appliances, Dornbracht fixtures, Rimadesio closets, Lutron and Crestron.",
  });
}

export default async function FinishesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => l[locale] || l.en;
  const tn = await getTranslations({ locale, namespace: "nav" });
  const zoomLabels = { close: es ? "Cerrar" : "Close" };
  const paletteLabels = { all: es ? "Todos" : "All", add: es ? "Añadir a mi selección" : "Add to my selection", added: es ? "En mi selección" : "In my selection", preview: es ? "Vista previa" : "Preview" };
  const paletteGroups: [string, string][] = [
    ["wood", es ? "Maderas" : "Woods"],
    ["lacquer", es ? "Lacados" : "Lacquers"],
    ["texture", es ? "Texturas" : "Textures"],
    ["colour", es ? "Colores suaves" : "Soft colours"],
  ];
  const hero: ImageRef = { src: "/images/presentation/kitchen.jpg", width: 2000, height: 1126, focal: "50% 50%", alt: { en: "The gourmet kitchen with Scavolini cabinetry and a glass wine wall", es: "La cocina gourmet con gabinetes Scavolini y cava de vidrio" } };
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("finishes"), path: "/finishes" }])} />
      <PageHero
        locale={locale}
        label={tn("finishes")}
        headline={es ? "Cada línea fluye con propósito" : "Every line flows with purpose"}
        intro={es ? "Superficies y acabados seleccionados para elevar el día a día: de los gabinetes italianos a la casa inteligente, todo lo que puede elegir." : "Surfaces and finishes selected to elevate the every day: from Italian cabinetry to the smart home, everything you can choose."}
        image={hero}
      />

      {/* Chapter index, sticky under the header. */}
      <nav aria-label={es ? "Capítulos" : "Chapters"} className="sticky top-[80px] z-30 border-y border-travertine-deep/60 bg-bone/95 backdrop-blur-sm lg:top-[96px]">
        <ul className="no-scrollbar mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-5 py-3 md:px-10 xl:px-0">
          {CHAPTERS.map((c) => (
            <li key={c.id} className="shrink-0">
              <a href={`#${c.id}`} className="inline-flex min-h-10 items-center rounded-full px-4 text-[11px] font-semibold tracking-[0.18em] whitespace-nowrap text-charcoal uppercase ring-1 ring-travertine-deep transition-colors hover:bg-charcoal hover:text-bone hover:ring-charcoal">
                {x(c.label)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {CHAPTERS.map((c, i) => (
        <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className={cn("scroll-mt-[150px] border-b border-travertine-deep/60 px-5 py-16 md:px-10 md:py-24 lg:scroll-mt-[170px]", i % 2 ? "bg-white" : "bg-bone")}>
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-12">
              <div>
                <p className="eyebrow">
                  <span className="rule" aria-hidden />
                  {x(c.group)}
                  {x(c.group) !== x(c.label) && <> · {x(c.label)}</>}
                </p>
                <h2 id={`${c.id}-title`} className="mt-5 font-[family-name:var(--font-display)] text-[34px] leading-[1.08] font-normal text-charcoal md:text-[48px]">
                  {x(c.title)}
                </h2>
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-ink uppercase">{c.brands}</p>
                <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]">{x(c.intro)}</p>
              </div>
            </div>

            {/* Client, 18 Nov: the finishes as part of the site, not as brochure boards: lifestyle photos as a clean
                mosaic, each product on its own card (a card opens a pop-up). */}
            {c.photos && (
              <div className={cn("mt-10 grid gap-3 md:mt-12 md:gap-4", c.photos.length === 3 ? "md:grid-cols-[1.4fr_1fr] md:grid-rows-2" : "md:grid-cols-[1.5fr_1fr]")}>
                {c.photos.map((src, k) => (
                  <div key={src} className={cn("relative min-h-[240px] overflow-hidden rounded-[20px] bg-travertine md:min-h-[300px]", c.photos!.length === 3 && k === 0 && "md:row-span-2 md:min-h-[520px]")}>
                    <Image src={src} alt="" fill unoptimized className="object-cover" style={{ objectPosition: "50% 50%" }} />
                  </div>
                ))}
              </div>
            )}
            {c.products && (
              <div className="mt-10 md:mt-12">
                <ProductGrid items={c.products.map((p) => ({ name: x(p.name), maker: p.maker, spec: p.spec && x(p.spec), src: p.src, photo: p.photo }))} close={zoomLabels.close} />
              </div>
            )}

            {c.swatches && (
              <div className="mt-12 md:mt-14">
                <FinishPalette chips={c.swatches} category={x(c.label)} dense={c.swatches.length > 8} groups={c.swatches.length > 8 ? paletteGroups : undefined} labels={{ ...paletteLabels, preview: c.swatchLabel ? x(c.swatchLabel) : paletteLabels.preview }} />
              </div>
            )}

            {!c.products && (
            <ul className="mt-10 border-t border-travertine-deep md:mt-12 md:grid md:grid-cols-2 md:gap-x-12">
              {c.items.map((it) => (
                <li key={it.en} className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline border-b border-travertine-deep py-3.5 text-[15px] text-charcoal">
                  <span aria-hidden className="text-brass">—</span>
                  {x(it)}
                </li>
              ))}
            </ul>
            )}
          </div>
        </section>
      ))}

      <SelectionTray
        labels={{
          mine: es ? "Mi selección" : "My selection",
          send: es ? "Enviar con mi consulta" : "Send with my inquiry",
          clear: es ? "Borrar" : "Clear",
          remove: es ? "Quitar" : "Remove",
          show: es ? "Ver" : "Show",
          hide: es ? "Ocultar" : "Hide",
        }}
      />

      <section aria-labelledby="finishes-close" data-tone="dark" className="on-dark bg-basalt px-5 py-16 text-center text-bone md:px-10 md:py-20">
        <div className="mx-auto max-w-[880px]">
          <h2 id="finishes-close" className="font-[family-name:var(--font-display)] text-[30px] leading-tight font-normal md:text-[42px]">
            {es ? "Elija sus acabados con nosotros" : "Choose your finishes with us"}
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-bone/80">
            {es ? "Añada a su selección los acabados que le gusten y envíela con su consulta; le acompañamos en cada elección." : "Add the finishes you like to your selection and send it with your inquiry; we walk you through every choice."}
          </p>
          <Link href="/#inquire" className="cta mt-8 inline-flex min-h-[52px] px-8" data-track="cta_inquire" data-track-label="finishes">
            {es ? "Consultar" : "Inquire"} <ArrowRight width={14} height={14} />
          </Link>
          <p className="mx-auto mt-8 max-w-[64ch] text-[12.5px] leading-relaxed text-bone/60">
            {es
              ? "Marcas, productos y acabados según la presentación de Tesoro del Mar; las selecciones y su disponibilidad están sujetas al Plan de Oferta."
              : "Brands, products and finishes as shown in the Tesoro del Mar presentation; selections and availability are subject to the Offering Plan."}
          </p>
        </div>
      </section>
    </div>
  );
}
