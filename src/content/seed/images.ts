import manifest from "../images.json";
import type { ImageRef, L } from "../types";

type Key = keyof typeof manifest;
type Opts = { caption?: L; rendering?: boolean; placeholder?: boolean; credit?: string };

/**
 * Every image carries a focal point (CSS object-position). Rule of thumb from the client's feedback
 * ("no image cutting from the top, especially the towers"): tower exteriors 50% 10–20%, aerials 50% 40%,
 * interiors and photography 50% 50% unless the subject sits elsewhere. No blur data anywhere.
 */
export function img(key: Key, focal: string, alt: L, opts: Opts = {}): ImageRef {
  const m = manifest[key];
  return { src: m.src, width: m.width, height: m.height, focal, alt, ...opts };
}

const R = { rendering: true } as const;

/* ---- Tesoro Del Mar render set (oraworld.com, July 2025) ---- */
export const tdm = {
  exteriorPull: img(
    "tdm-exterior-pull",
    "50% 12%",
    {
      en: "Tesoro Del Mar: the curved towers above the resort pool, framed by palms",
      es: "Tesoro Del Mar: las torres curvas sobre la piscina del resort, enmarcadas por palmeras",
    },
    R,
  ),
  exteriorRoad: img(
    "tdm-exterior-road",
    "50% 15%",
    {
      en: "The curved towers of Tesoro Del Mar from the palm-lined arrival road",
      es: "Las torres curvas de Tesoro Del Mar desde la vía de llegada bordeada de palmeras",
    },
    R,
  ),
  exteriorGolf: img(
    "tdm-exterior-golf",
    "50% 20%",
    {
      en: "Tesoro Del Mar seen across the landscaped green",
      es: "Tesoro Del Mar visto a través de las áreas verdes ajardinadas",
    },
    R,
  ),
  aerialTowers: img(
    "tdm-aerial-001",
    "50% 40%",
    {
      en: "Aerial view of the Tesoro Del Mar towers in tropical forest",
      es: "Vista aérea de las torres de Tesoro Del Mar entre el bosque tropical",
    },
    R,
  ),
  aerialCoast: img(
    "tdm-aerial-002",
    "50% 40%",
    {
      en: "Aerial view of Tesoro Del Mar above a turquoise cove on the north coast",
      es: "Vista aérea de Tesoro Del Mar sobre una cala turquesa de la costa norte",
    },
    R,
  ),
  aerialVillas: img(
    "tdm-aerial-003",
    "50% 40%",
    {
      en: "Aerial view of the towers and the villa neighbourhood at Tesoro Del Mar",
      es: "Vista aérea de las torres y el vecindario de villas de Tesoro Del Mar",
    },
    R,
  ),
  aerialForest: img(
    "tdm-aerial-004",
    "55% 40%",
    {
      en: "Tesoro Del Mar towers rising from the forest canopy",
      es: "Las torres de Tesoro Del Mar emergiendo del dosel del bosque",
    },
    R,
  ),
  foyerAtrium: img(
    "tdm-foyer-001",
    "50% 50%",
    {
      en: "Double-height lobby with a stone column and gallery level",
      es: "Vestíbulo de doble altura con columna de piedra y nivel de galería",
    },
    R,
  ),
  foyerLounge: img(
    "tdm-foyer-002",
    "50% 50%",
    { en: "Lobby lounge in travertine and warm wood", es: "Salón del vestíbulo en travertino y madera cálida" },
    R,
  ),
  foyerReception: img(
    "tdm-foyer-004",
    "50% 50%",
    { en: "Reception desk beneath a living green wall", es: "Recepción bajo un muro verde vivo" },
    R,
  ),
  foyerSignage: img(
    "tdm-foyer-005",
    "50% 50%",
    {
      en: "The Tesoro Del Mar foyer with its name on the stone wall",
      es: "El vestíbulo de Tesoro Del Mar con su nombre en el muro de piedra",
    },
    R,
  ),
  aptLiving: img(
    "tdm-apt-living-003",
    "50% 50%",
    { en: "Open living and dining room in apartment 1403", es: "Sala y comedor abiertos del apartamento 1403" },
    R,
  ),
  aptLiving2: img(
    "tdm-apt-living-004",
    "50% 50%",
    {
      en: "Living room with floor-to-ceiling glass in apartment 1403",
      es: "Sala con ventanales de piso a techo en el apartamento 1403",
    },
    R,
  ),
  aptBedroom: img(
    "tdm-apt-master-bedroom",
    "50% 50%",
    { en: "Primary bedroom in apartment 1403", es: "Dormitorio principal del apartamento 1403" },
    R,
  ),
  aptBedroom2: img(
    "tdm-apt-bedroom-2",
    "50% 50%",
    {
      en: "Second bedroom with an ocean view in apartment 1403",
      es: "Segundo dormitorio con vista al mar en el apartamento 1403",
    },
    R,
  ),
  aptBath: img(
    "tdm-apt-master-bath-001",
    "50% 50%",
    { en: "Primary bathroom in onyx and marble", es: "Baño principal en ónix y mármol" },
    R,
  ),
  aptBath2: img(
    "tdm-apt-master-bath-002",
    "50% 50%",
    { en: "Freestanding bath before an onyx wall", es: "Bañera exenta frente a un muro de ónix" },
    R,
  ),
  aptStudy: img(
    "tdm-apt-study",
    "50% 50%",
    {
      en: "Study with built-in shelving in apartment 1403",
      es: "Estudio con estanterías integradas en el apartamento 1403",
    },
    R,
  ),
  hotelSuite: img(
    "tdm-hotel-210",
    "50% 50%",
    { en: "Hotel suite 210 bedroom", es: "Dormitorio de la suite de hotel 210" },
    R,
  ),
  penthouseDining: img(
    "tdm-penthouse-001",
    "50% 50%",
    { en: "Penthouse dining and living room facing the sea", es: "Comedor y sala del penthouse frente al mar" },
    R,
  ),
  penthouseLiving: img(
    "tdm-penthouse-002",
    "50% 50%",
    { en: "Penthouse living room with a floating staircase", es: "Sala del penthouse con escalera flotante" },
    R,
  ),
  penthousePiano: img(
    "tdm-penthouse-003",
    "50% 50%",
    {
      en: "Penthouse living room with a grand piano and floor-to-ceiling glass",
      es: "Sala del penthouse con piano de cola y ventanales de piso a techo",
    },
    R,
  ),
};

/* ---- Dorado Waterfalls (oraworld.com) ---- */
export const dw = {
  avenue: img(
    "dw-exterior-1",
    "50% 20%",
    {
      en: "Dorado Waterfalls: tiered towers along a palm-lined avenue",
      es: "Dorado Waterfalls: torres escalonadas a lo largo de una avenida de palmeras",
    },
    R,
  ),
  masterplan: img(
    "dw-exterior-2",
    "50% 40%",
    {
      en: "Dorado Waterfalls master plan beside the river and mountains",
      es: "Plan maestro de Dorado Waterfalls junto al río y las montañas",
    },
    R,
  ),
  valley: img(
    "dw-exterior-3",
    "50% 30%",
    { en: "Dorado Waterfalls towers along the valley", es: "Torres de Dorado Waterfalls a lo largo del valle" },
    R,
  ),
  terraces: img(
    "dw-exterior-4",
    "50% 30%",
    {
      en: "Green terraces stepping down the Dorado Waterfalls towers",
      es: "Terrazas verdes escalonadas en las torres de Dorado Waterfalls",
    },
    R,
  ),
  lobby: img(
    "dw-interior-1",
    "50% 50%",
    { en: "Dorado Waterfalls lobby with a living wall", es: "Vestíbulo de Dorado Waterfalls con muro vivo" },
    R,
  ),
  suite: img(
    "dw-interior-3",
    "50% 50%",
    { en: "A Dorado Waterfalls bedroom suite", es: "Una suite de dormitorio en Dorado Waterfalls" },
    R,
  ),
  lounge: img(
    "dw-interior-4",
    "50% 50%",
    { en: "Dorado Waterfalls residence lounge", es: "Salón de una residencia de Dorado Waterfalls" },
    R,
  ),
  waterWall: img(
    "dw-interior-9",
    "50% 50%",
    { en: "Cascading water wall inside Dorado Waterfalls", es: "Muro de agua en cascada en Dorado Waterfalls" },
    R,
  ),
  bar: img(
    "dw-interior-12",
    "50% 50%",
    { en: "Dorado Waterfalls lounge bar", es: "Bar lounge de Dorado Waterfalls" },
    R,
  ),
  living: img(
    "dw-interior-15",
    "50% 50%",
    { en: "Dorado Waterfalls open-plan living room", es: "Sala de concepto abierto en Dorado Waterfalls" },
    R,
  ),
  dining: img(
    "dw-interior-16",
    "50% 50%",
    { en: "Dorado Waterfalls dining room", es: "Comedor en Dorado Waterfalls" },
    R,
  ),
};

/* ---- Portfolio renders, one per location (oraworld.com/our-residences) ---- */
export const places = {
  theTop: img(
    "the-top",
    "50% 20%",
    {
      en: "The Top: curved towers and terraced villas above the treeline",
      es: "The Top: torres curvas y villas escalonadas sobre la arboleda",
    },
    R,
  ),
  naguabo: img(
    "naguabo",
    "50% 40%",
    {
      en: "Naguabo: towers and a marina around a hidden bay",
      es: "Naguabo: torres y una marina alrededor de una bahía escondida",
    },
    R,
  ),
  naguaboBay: img(
    "naguabo-bay",
    "50% 40%",
    {
      en: "Naguabo: residential towers set into a green hillside bay",
      es: "Naguabo: torres residenciales en una bahía de laderas verdes",
    },
    R,
  ),
  loizaOcean: img(
    "loiza-ocean",
    "50% 35%",
    { en: "Loíza Ocean: glass towers on the shoreline", es: "Loíza Ocean: torres de cristal frente al mar" },
    R,
  ),
  loizaRiverCity: img(
    "loiza-river-city",
    "50% 35%",
    {
      en: "Loíza River City: towers above a palm-lined beach",
      es: "Loíza River City: torres sobre una playa bordeada de palmeras",
    },
    R,
  ),
  loizaCountryside: img(
    "loiza-countryside",
    "50% 45%",
    {
      en: "Loíza Countryside Estates: aerial view of the lagoon community",
      es: "Loíza Countryside Estates: vista aérea de la comunidad de la laguna",
    },
    R,
  ),
  ceiba: img(
    "ceiba",
    "50% 40%",
    {
      en: "Costa del Este, Ceiba: architectural massing study of the towers",
      es: "Costa del Este, Ceiba: estudio volumétrico de las torres",
    },
    R,
  ),
  guayama: img(
    "guayama",
    "50% 50%",
    { en: "Guayama: site plan along the coast", es: "Guayama: plano del sitio a lo largo de la costa" },
    R,
  ),
  coastalAerial: img(
    "coastal-aerial",
    "50% 40%",
    { en: "Aerial view of a coastal ORA World community", es: "Vista aérea de una comunidad costera de ORA World" },
    R,
  ),
  balconyDetail: img(
    "balcony-detail",
    "35% 40%",
    {
      en: "Detail of the curved balconies against the Caribbean sky",
      es: "Detalle de los balcones curvos contra el cielo caribeño",
    },
    R,
  ),
};

/* ---- Lifestyle photography from oraworld.com (licences to be confirmed, see CONTENT-TODO.md) ---- */
export const life = {
  beach: img("life-beach", "50% 55%", {
    en: "Turquoise cove with a leaning palm on Puerto Rico's north coast",
    es: "Cala turquesa con una palmera inclinada en la costa norte de Puerto Rico",
  }),
  sailing: img("life-sailing", "50% 50%", {
    en: "A sailboat on open Caribbean water",
    es: "Un velero en aguas abiertas del Caribe",
  }),
  rainforest: img("life-rainforest", "50% 40%", {
    en: "Hikers beneath the canopy of a tropical rainforest",
    es: "Senderistas bajo el dosel de un bosque tropical",
  }),
  adventure: img("life-adventure", "50% 45%", {
    en: "Hikers resting on a ridge above a green valley",
    es: "Senderistas descansando en una cresta sobre un valle verde",
  }),
  culinary: img("life-culinary", "50% 50%", {
    en: "Friends sharing a table of island dishes",
    es: "Amigos compartiendo una mesa de platos isleños",
  }),
  toast: img("life-toast", "50% 45%", {
    en: "A toast with red wine at a candle-lit table",
    es: "Un brindis con vino tinto en una mesa a la luz de las velas",
  }),
  reception: img("life-reception", "50% 45%", {
    en: "Guests mingling at an evening reception",
    es: "Invitados conversando en una recepción nocturna",
  }),
  jet: img("life-jet", "50% 50%", {
    en: "A private jet and car at golden hour",
    es: "Un jet privado y un automóvil al atardecer",
  }),
  atv: img("life-atv", "50% 45%", {
    en: "Friends on an all-terrain excursion",
    es: "Amigos en una excursión todoterreno",
  }),
  familyPool: img("life-family-pool", "50% 40%", {
    en: "A mother and children laughing in a family pool",
    es: "Una madre y sus hijos riendo en una piscina familiar",
  }),
  gym: img("life-gym", "50% 40%", {
    en: "Strength training in a fitness center",
    es: "Entrenamiento de fuerza en un gimnasio",
  }),
  spa: img("life-spa", "50% 50%", {
    en: "A spa treatment room with soft light",
    es: "Una sala de tratamientos de spa con luz suave",
  }),
  poolTerrace: img(
    "life-pool-terrace",
    "50% 30%",
    {
      en: "Pool terrace beneath a cantilevered glass pavilion",
      es: "Terraza de piscina bajo un pabellón de cristal en voladizo",
    },
    R,
  ),
  running: img("life-running", "50% 45%", {
    en: "A couple running a tree-lined trail",
    es: "Una pareja corriendo por un sendero arbolado",
  }),
  surf: img("life-surf", "50% 50%", {
    en: "A surfer carving a turquoise wave",
    es: "Un surfista en una ola turquesa",
  }),
  waterpark: img("life-waterpark", "50% 50%", {
    en: "Children on a water slide",
    es: "Niños en un tobogán de agua",
  }),
  kite: img("life-kite", "50% 45%", {
    en: "Children flying a kite in a field at sunset",
    es: "Niños volando una cometa en un campo al atardecer",
  }),
  graduation: img("life-graduation", "50% 50%", {
    en: "Graduation caps thrown into a blue sky",
    es: "Birretes de graduación lanzados al cielo azul",
  }),
  shopping: img("life-shopping", "50% 40%", {
    en: "A woman with shopping bags in a glass arcade",
    es: "Una mujer con bolsas de compras en una galería acristalada",
  }),
  motherChild: img("life-mother-child", "50% 45%", {
    en: "A mother and toddler playing with blocks",
    es: "Una madre y su niño jugando con bloques",
  }),
  pets: img("life-pets", "50% 55%", {
    en: "A girl playing fetch with a golden retriever",
    es: "Una niña jugando a la pelota con un golden retriever",
  }),
};
