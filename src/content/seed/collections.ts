import type { Collection, FloorPlan, L } from "../types";
import { tdm, life } from "./images";

/**
 * Tesoro Del Mar publishes "contemporary apartments and luxurious villas" plus 42 hotel suites and a
 * penthouse render. Bedroom counts, sizes and prices are not public and stay null ("To be confirmed").
 * The tower bands are illustrative until the client confirms the floor mapping.
 */
export const collections: Collection[] = [
  {
    slug: "penthouses",
    name: { en: "The Penthouses", es: "Los Penthouses" },
    tagline: { en: "Panoramic living at the crown of the tower", es: "Vida panorámica en la corona de la torre" },
    description: {
      en: [
        "Expansive windows frame sweeping views and bathe the interiors in natural light. Generous living spaces for entertaining, intimate alcoves for retreat and a private suite with ocean or garden views.",
      ],
      es: [
        "Amplios ventanales enmarcan vistas panorámicas y bañan los interiores de luz natural. Espacios generosos para recibir, rincones íntimos para el retiro y una suite privada con vistas al mar o al jardín.",
      ],
    },
    bedrooms: null,
    sizeRange: null,
    fromPrice: null,
    image: tdm.penthouseLiving,
    gallery: [tdm.penthouseLiving, tdm.penthouseDining, tdm.penthousePiano],
    features: [
      { en: "Floating staircase and double-height salon", es: "Escalera flotante y salón de doble altura" },
      { en: "Wrap-around cantilevered terraces", es: "Terrazas envolventes en voladizo" },
      { en: "Ocean views from the principal rooms", es: "Vistas al mar desde las estancias principales" },
      { en: "Two levels on floor 18 with a private elevator", es: "Dos niveles en el piso 18 con ascensor privado" },
    ],
    finishes: [
      { group: { en: "Living spaces", es: "Espacios de estar" }, items: [{ en: "Stone, wood and brushed metals", es: "Piedra, madera y metales cepillados" }, { en: "Floor-to-ceiling glazing", es: "Acristalamiento de piso a techo" }] },
    ],
    specs: [
      { label: { en: "Bedrooms", es: "Habitaciones" }, value: { en: "6 + 8 baths", es: "6 + 8 baños" } },
      { label: { en: "Interior", es: "Interior" }, value: { en: "9,807 sq ft", es: "9,807 pies²" } },
      { label: { en: "Terraces", es: "Terrazas" }, value: { en: "11,475 sq ft", es: "11,475 pies²" } },
    ],
    bands: [0, 1],
    views: ["ocean"],
    bedroomOptions: [6],
  },
  {
    slug: "residences",
    name: { en: "The Residences", es: "Las Residencias" },
    tagline: { en: "129 contemporary apartments with ocean and garden views", es: "129 apartamentos contemporáneos con vistas al mar y al jardín" },
    description: {
      en: [
        "Open-concept layouts that encourage flow and connection. Floor-to-ceiling windows invite the outdoors in, filling each space with light, views and serenity.",
        "Organic materials, clean lines and curated finishes echo the natural surroundings while delivering effortless luxury and comfort.",
      ],
      es: [
        "Distribuciones de concepto abierto que invitan al flujo y la conexión. Ventanales de piso a techo traen el exterior adentro y llenan cada espacio de luz, vistas y serenidad.",
        "Materiales orgánicos, líneas limpias y acabados seleccionados hacen eco del entorno natural con un lujo y una comodidad sin esfuerzo.",
      ],
    },
    bedrooms: null,
    sizeRange: null,
    fromPrice: null,
    image: tdm.aptLiving,
    gallery: [tdm.aptLiving, tdm.aptLiving2, tdm.aptBedroom, tdm.aptBedroom2, tdm.aptBath, tdm.aptBath2, tdm.aptStudy],
    features: [
      { en: "Private terraces that become daily sanctuaries", es: "Terrazas privadas que se convierten en santuarios diarios" },
      { en: "Ocean or garden views from every principal room", es: "Vistas al mar o al jardín desde cada estancia principal" },
      { en: "Open-concept living and dining", es: "Sala y comedor de concepto abierto" },
      { en: "10' ceilings and motorized shades in every room", es: "Techos de 10 pies y cortinas motorizadas en cada habitación" },
    ],
    finishes: [
      { group: { en: "Living spaces", es: "Espacios de estar" }, items: [{ en: "Floor-to-ceiling glazing", es: "Acristalamiento de piso a techo" }, { en: "Stone, wood and brushed metals", es: "Piedra, madera y metales cepillados" }, { en: "Eco-friendly finishes", es: "Acabados ecológicos" }, { en: "Large-format porcelain tile throughout", es: "Porcelanato de gran formato en toda la residencia" }] },
      { group: { en: "Kitchens", es: "Cocinas" }, items: [{ en: "Custom Italian cabinetry by Scavolini", es: "Gabinetes italianos a medida de Scavolini" }, { en: "Integrated Gaggenau appliance suite with built-in coffee machine", es: "Electrodomésticos integrados Gaggenau con cafetera empotrada" }, { en: "Quartzite countertops and backsplashes", es: "Encimeras y salpicaderos de cuarcita" }, { en: "Dornbracht fixtures", es: "Grifería Dornbracht" }] },
      { group: { en: "Home systems", es: "Sistemas del hogar" }, items: [{ en: "Crestron Home smart home technology", es: "Tecnología de hogar inteligente Crestron Home" }, { en: "Lutron motorized window shades", es: "Cortinas motorizadas Lutron" }, { en: "Mitsubishi Electric multi-split air", es: "Aire multi-split Mitsubishi Electric" }, { en: "Walk-in closets with Rimadesio built-ins", es: "Vestidores con muebles Rimadesio" }] },
    ],
    specs: [
      { label: { en: "Bedrooms", es: "Habitaciones" }, value: { en: "1 to 6", es: "1 a 6" } },
      { label: { en: "Interior", es: "Interior" }, value: { en: "942–4,666 sq ft", es: "942–4,666 pies²" } },
      { label: { en: "From", es: "Desde" }, value: { en: "$2,000 / sq ft", es: "$2,000 / pie²" } },
    ],
    bands: [2, 3, 4, 5, 6, 7],
    views: ["ocean", "garden"],
    bedroomOptions: [1, 2, 3, 4, 6],
  },
  {
    slug: "villas",
    name: { en: "The Villas", es: "Las Villas" },
    tagline: { en: "Luxurious villas within the landscape", es: "Villas de lujo integradas en el paisaje" },
    description: {
      en: [
        "Private villas landscaped with native plants and flowers, with cantilevered terraces that extend outward like wings and reflecting pools that foster tranquility.",
      ],
      es: [
        "Villas privadas ajardinadas con plantas y flores nativas, con terrazas en voladizo que se extienden como alas y espejos de agua que invitan a la calma.",
      ],
    },
    bedrooms: null,
    sizeRange: null,
    fromPrice: null,
    image: tdm.aerialVillas,
    gallery: [tdm.aerialVillas, life.poolTerrace, tdm.exteriorGolf],
    features: [
      { en: "Landscaped with native plants and flowers", es: "Ajardinadas con plantas y flores nativas" },
      { en: "Natural ventilation and daylight by design", es: "Ventilación natural y luz de día por diseño" },
      { en: "Reflecting pools and gentle cascades nearby", es: "Espejos de agua y cascadas suaves cerca" },
    ],
    finishes: [],
    specs: [
      { label: { en: "Bedrooms", es: "Habitaciones" }, value: null },
      { label: { en: "Size", es: "Tamaño" }, value: null },
      { label: { en: "From", es: "Desde" }, value: null },
    ],
    bands: [8, 9],
    views: ["garden", "mountain"],
    bedroomOptions: [],
  },
  {
    slug: "hotel-suites",
    name: { en: "Hotel Suites", es: "Suites de hotel" },
    tagline: { en: "42 suites in the boutique hotel at the community hub", es: "42 suites en el hotel boutique del centro de la comunidad" },
    description: {
      en: [
        "The community hub includes a state-of-the-art clubhouse and a boutique hotel, ensuring exceptional hospitality and recreational facilities for residents and their guests.",
      ],
      es: [
        "El centro de la comunidad incluye un clubhouse de última generación y un hotel boutique, garantizando hospitalidad y espacios recreativos excepcionales para residentes e invitados.",
      ],
    },
    bedrooms: null,
    sizeRange: null,
    fromPrice: null,
    image: tdm.hotelSuite,
    gallery: [tdm.hotelSuite, tdm.foyerSignage, tdm.foyerReception],
    features: [
      { en: "42 suites beside the clubhouse", es: "42 suites junto al clubhouse" },
      { en: "Hospitality and recreation at the hub", es: "Hospitalidad y recreación en el centro" },
      { en: "Ownership model to be confirmed", es: "Modelo de propiedad por confirmar" },
    ],
    finishes: [],
    specs: [
      { label: { en: "Suites", es: "Suites" }, value: { en: "42", es: "42" } },
      { label: { en: "Size", es: "Tamaño" }, value: null },
      { label: { en: "Ownership", es: "Propiedad" }, value: null },
    ],
    bands: [10, 11],
    views: ["garden"],
    bedroomOptions: [],
  },
];

const PLANS_PDF = "https://storage.googleapis.com/msgsndr/h3BreqRip5vgBRyV1wRf/media/6969467ce125ef29bd593468.pdf";
const OCEAN: L = { en: "Ocean view with wrap-around terrace", es: "Vista al mar con terraza envolvente" };
const CEIL: L = { en: "10' ceilings", es: "Techos de 10 pies" };
const ELEV: L = { en: "Private elevator", es: "Ascensor privado" };
const also = (u: string[]): L => ({ en: `Same layout: ${u.join(", ")}`, es: `Misma distribución: ${u.join(", ")}` });

/**
 * Phase 1 floor plans (Tower 1, floors 5–18), transcribed from the sales team's "TESORO DEL MAR DORADO" PDF.
 * One entry per distinct layout; the image is that layout's page from the PDF and the PDF link opens on it.
 * Figures are as printed on the representative unit's page (floors 5, 7, 10, 11, 13, 16, 17, 18). On floors 6, 8,
 * 9, 12, 14 and 15 (and 1101, 1104) the PDF repeats the interior figure as "exterior"; those misprints are not used.
 * No availability or unit prices are published, so status is "inquire" and fromPrice stays null.
 */
const plan = (p: {
  unit: string;
  page: number;
  collection: string;
  bedrooms: number;
  bathrooms: number;
  powder?: number;
  interiorSqFt: number;
  exteriorSqFt: number | null;
  floors: string;
  ocean: boolean;
  units: string[];
  highlights?: L[];
  name?: L;
}): FloorPlan => ({
  slug: p.unit === "ph" ? "penthouse" : `residence-${p.unit}`,
  name: p.name ?? { en: `Residence ${p.unit}`, es: `Residencia ${p.unit}` },
  collection: p.collection,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
  powder: p.powder,
  interiorSqFt: p.interiorSqFt,
  exteriorSqFt: p.exteriorSqFt,
  orientation: null,
  view: p.ocean ? OCEAN : null,
  building: "Tower 1",
  floors: p.floors,
  status: "inquire",
  fromPrice: null,
  image: {
    src: `/images/plans/tdm/plan-${p.unit}.jpg`,
    width: 2200,
    height: 1700,
    focal: "50% 50%",
    alt: {
      en: `Phase 1 floor plan, ${p.name?.en ?? `residence ${p.unit}`}: ${p.bedrooms} bedrooms, ${p.interiorSqFt.toLocaleString("en-US")} sq ft interior`,
      es: `Plano de la Fase 1, ${p.name?.es ?? `residencia ${p.unit}`}: ${p.bedrooms} dormitorios, ${p.interiorSqFt.toLocaleString("en-US")} pies cuadrados interiores`,
    },
  },
  keyplan: null,
  keyplanPosition: null,
  pdf: `${PLANS_PDF}#page=${p.page}`,
  highlights: [CEIL, ...(p.ocean ? [OCEAN] : []), ...(p.highlights ?? []), also(p.units)],
  units: p.units,
  placeholder: false,
});

const den: L = { en: "Den (148 sq ft)", es: "Estudio (148 pies cuadrados)" };
const wine: L = { en: "Wine cellar", es: "Cava de vinos" };
const twoBalconies: L = { en: "Two balconies", es: "Dos balcones" };
const chef: L = { en: "Chef's kitchen", es: "Cocina de chef" };

export const floorPlans: FloorPlan[] = [
  plan({ unit: "501", page: 2, collection: "residences", bedrooms: 2, bathrooms: 2, interiorSqFt: 990, exteriorSqFt: 112, floors: "5–6", ocean: false, units: ["508", "601", "608"] }),
  plan({ unit: "502", page: 3, collection: "residences", bedrooms: 2, bathrooms: 2, interiorSqFt: 942, exteriorSqFt: 435, floors: "5–6", ocean: true, units: ["507 (944 sq ft)", "602", "607"] }),
  plan({ unit: "503", page: 4, collection: "residences", bedrooms: 1, bathrooms: 2, interiorSqFt: 1104, exteriorSqFt: 232, floors: "5–6", ocean: true, units: ["506", "603", "606"], highlights: [den, ELEV] }),
  plan({ unit: "504", page: 5, collection: "residences", bedrooms: 2, bathrooms: 2, powder: 1, interiorSqFt: 1393, exteriorSqFt: 181, floors: "5–6", ocean: true, units: ["505", "604", "605"], highlights: [ELEV, wine] }),
  plan({ unit: "701", page: 18, collection: "residences", bedrooms: 2, bathrooms: 2, powder: 1, interiorSqFt: 1522, exteriorSqFt: 408, floors: "7–9", ocean: true, units: ["706 (1,520 sq ft)", "801", "806", "901", "906"], highlights: [ELEV, twoBalconies] }),
  plan({ unit: "702", page: 19, collection: "residences", bedrooms: 2, bathrooms: 2, powder: 1, interiorSqFt: 1410, exteriorSqFt: 367, floors: "7–9", ocean: true, units: ["705", "802", "805", "902", "905"], highlights: [ELEV] }),
  plan({ unit: "703", page: 20, collection: "residences", bedrooms: 2, bathrooms: 2, powder: 1, interiorSqFt: 1586, exteriorSqFt: 184, floors: "7–9", ocean: true, units: ["704", "803", "804", "903", "904"], highlights: [ELEV] }),
  plan({ unit: "1001", page: 36, collection: "residences", bedrooms: 3, bathrooms: 3, powder: 1, interiorSqFt: 2147, exteriorSqFt: 551, floors: "10–12", ocean: true, units: ["1004", "1101", "1104", "1201", "1204"], highlights: [ELEV, twoBalconies, wine] }),
  plan({ unit: "1002", page: 37, collection: "residences", bedrooms: 3, bathrooms: 3, powder: 1, interiorSqFt: 2477, exteriorSqFt: 408, floors: "10", ocean: true, units: ["1003 (2,478 sq ft)"], highlights: [ELEV, wine] }),
  plan({ unit: "1102", page: 41, collection: "residences", bedrooms: 3, bathrooms: 3, powder: 1, interiorSqFt: 2477, exteriorSqFt: 408, floors: "11–12", ocean: true, units: ["1103 (2,478 sq ft)", "1202", "1203"], highlights: [ELEV] }),
  plan({ unit: "1301", page: 48, collection: "residences", bedrooms: 4, bathrooms: 4, powder: 1, interiorSqFt: 3061, exteriorSqFt: 776, floors: "13–15", ocean: true, units: ["1303", "1401", "1403", "1501", "1503"], highlights: [ELEV, twoBalconies, wine] }),
  plan({ unit: "1302", page: 49, collection: "residences", bedrooms: 4, bathrooms: 4, powder: 1, interiorSqFt: 3289, exteriorSqFt: 368, floors: "13–15", ocean: true, units: ["1402", "1502"], highlights: [ELEV] }),
  plan({ unit: "1601", page: 57, collection: "residences", bedrooms: 6, bathrooms: 6, powder: 1, interiorSqFt: 4663, exteriorSqFt: 959, floors: "16", ocean: true, units: ["1602 (960 sq ft exterior)"], highlights: [ELEV, twoBalconies, wine] }),
  plan({ unit: "1701", page: 59, collection: "residences", bedrooms: 6, bathrooms: 6, powder: 1, interiorSqFt: 4666, exteriorSqFt: 959, floors: "17", ocean: true, units: ["1702 (960 sq ft exterior)"], highlights: [ELEV, chef, wine] }),
  plan({
    unit: "ph",
    name: { en: "The Penthouse", es: "El Penthouse" },
    page: 61,
    collection: "penthouses",
    bedrooms: 6,
    bathrooms: 8,
    powder: 2,
    interiorSqFt: 9807,
    exteriorSqFt: 11475,
    floors: "18 (two levels)",
    ocean: true,
    units: ["one residence, floor 18"],
    highlights: [ELEV, chef, { en: "Gym, two studies and recreation areas", es: "Gimnasio, dos estudios y áreas recreativas" }],
  }),
];
