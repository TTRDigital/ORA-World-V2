import type { Collection, FloorPlan } from "../types";
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
    ],
    finishes: [
      { group: { en: "Living spaces", es: "Espacios de estar" }, items: [{ en: "Stone, wood and brushed metals", es: "Piedra, madera y metales cepillados" }, { en: "Floor-to-ceiling glazing", es: "Acristalamiento de piso a techo" }] },
    ],
    specs: [
      { label: { en: "Bedrooms", es: "Habitaciones" }, value: null },
      { label: { en: "Size", es: "Tamaño" }, value: null },
      { label: { en: "From", es: "Desde" }, value: null },
    ],
    bands: [0, 1],
    views: ["ocean"],
    bedroomOptions: [],
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
    ],
    finishes: [
      { group: { en: "Living spaces", es: "Espacios de estar" }, items: [{ en: "Floor-to-ceiling glazing", es: "Acristalamiento de piso a techo" }, { en: "Stone, wood and brushed metals", es: "Piedra, madera y metales cepillados" }, { en: "Eco-friendly finishes", es: "Acabados ecológicos" }] },
      { group: { en: "Kitchens and baths", es: "Cocinas y baños" }, items: [{ en: "Natural stone surfaces", es: "Superficies de piedra natural" }, { en: "Cabinetry and appliance brands to be confirmed", es: "Marcas de gabinetes y electrodomésticos por confirmar" }] },
    ],
    specs: [
      { label: { en: "Bedrooms", es: "Habitaciones" }, value: null },
      { label: { en: "Size", es: "Tamaño" }, value: null },
      { label: { en: "From", es: "Desde" }, value: null },
    ],
    bands: [2, 3, 4, 5, 6, 7],
    views: ["ocean", "garden"],
    bedroomOptions: [],
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

/**
 * Illustrative floor plans. No plans are public, so these schematic SVG drawings exercise the filters,
 * the gate, the comparison and the keyplan. Every one is flagged placeholder and labelled as such.
 */
const plan = (
  p: Omit<FloorPlan, "image" | "keyplan" | "keyplanPosition" | "pdf" | "placeholder"> & { kp: [number, number, number, number] },
): FloorPlan => ({
  ...p,
  image: {
    src: `/images/plans/${p.slug}.svg`,
    width: 1200,
    height: 900,
    focal: "50% 50%",
    alt: { en: `Illustrative floor plan ${p.name.en}`, es: `Plano ilustrativo ${p.name.es}` },
    placeholder: true,
  },
  keyplan: {
    src: `/images/plans/keyplan.svg`,
    width: 800,
    height: 800,
    focal: "50% 50%",
    alt: { en: "Keyplan of the building level", es: "Plano clave del nivel" },
    placeholder: true,
  },
  keyplanPosition: { x: p.kp[0], y: p.kp[1], w: p.kp[2], h: p.kp[3] },
  pdf: null,
  placeholder: true,
});

export const floorPlans: FloorPlan[] = [
  plan({ slug: "residence-a1", name: { en: "Residence A1", es: "Residencia A1" }, collection: "residences", bedrooms: 1, bathrooms: 1.5, interiorSqFt: null, exteriorSqFt: null, orientation: "N", view: { en: "Ocean", es: "Mar" }, building: "Tower I", floors: null, status: "available", fromPrice: null, highlights: [{ en: "Corner exposure", es: "Esquina" }, { en: "Terrace off the living room", es: "Terraza desde la sala" }], kp: [8, 10, 28, 32] }),
  plan({ slug: "residence-b1", name: { en: "Residence B1", es: "Residencia B1" }, collection: "residences", bedrooms: 2, bathrooms: 2, interiorSqFt: null, exteriorSqFt: null, orientation: "NE", view: { en: "Ocean and garden", es: "Mar y jardín" }, building: "Tower I", floors: null, status: "available", fromPrice: null, highlights: [{ en: "Split-bedroom layout", es: "Habitaciones separadas" }], kp: [38, 10, 30, 32] }),
  plan({ slug: "residence-b2", name: { en: "Residence B2", es: "Residencia B2" }, collection: "residences", bedrooms: 2, bathrooms: 2.5, interiorSqFt: null, exteriorSqFt: null, orientation: "S", view: { en: "Garden and mountains", es: "Jardín y montañas" }, building: "Tower II", floors: null, status: "reserved", fromPrice: null, highlights: [{ en: "Den convertible to study", es: "Estudio convertible" }], kp: [70, 10, 22, 32] }),
  plan({ slug: "residence-c1", name: { en: "Residence C1", es: "Residencia C1" }, collection: "residences", bedrooms: 3, bathrooms: 3.5, interiorSqFt: null, exteriorSqFt: null, orientation: "NW", view: { en: "Ocean", es: "Mar" }, building: "Tower II", floors: null, status: "available", fromPrice: null, highlights: [{ en: "Two terraces", es: "Dos terrazas" }], kp: [8, 56, 40, 34] }),
  plan({ slug: "villa-v1", name: { en: "Villa V1", es: "Villa V1" }, collection: "villas", bedrooms: 4, bathrooms: 4.5, interiorSqFt: null, exteriorSqFt: null, orientation: "E", view: { en: "Garden", es: "Jardín" }, building: "Villas", floors: "2", status: "available", fromPrice: null, highlights: [{ en: "Private pool", es: "Piscina privada" }], kp: [52, 56, 40, 34] }),
  plan({ slug: "penthouse-ph1", name: { en: "Penthouse PH1", es: "Penthouse PH1" }, collection: "penthouses", bedrooms: 4, bathrooms: 5.5, interiorSqFt: null, exteriorSqFt: null, orientation: "N", view: { en: "Panoramic ocean", es: "Mar panorámico" }, building: "Tower I", floors: null, status: "available", fromPrice: null, highlights: [{ en: "Wrap-around terrace", es: "Terraza envolvente" }, { en: "Full floor", es: "Planta completa" }], kp: [8, 10, 84, 80] }),
];
