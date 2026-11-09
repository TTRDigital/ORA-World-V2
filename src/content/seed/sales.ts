import type { L } from "../types";

/**
 * Sales facts from the ORA World prospect email (sent by the sales team to interested buyers) and the Phase 1
 * documents linked from it. Verbatim figures; pricing is early pre-construction pricing and may change.
 */
export const pricing = {
  phase: { en: "Phase 1 · Tesoro Del Mar", es: "Fase 1 · Tesoro Del Mar" } as L,
  averagePerSqFt: 2250,
  lowerPerSqFt: 2000,
  higherPerSqFt: 2500,
  note: {
    en: "Early pre-construction pricing. Later units will likely be sold at higher rates.",
    es: "Precios iniciales de preconstrucción. Es probable que las unidades posteriores se vendan a precios más altos.",
  } as L,
  plansNote: { en: "Phase 1 floor plans, subject to change.", es: "Planos de la Fase 1, sujetos a cambios." } as L,
};

/** "All the units in Tesoro Del Mar have nice water views and come with oversized balconies … amazing amenities such
 *  as a nutritionist on staff and private charter flights" (prospect email). */
export const ownerHighlights: L[] = [
  { en: "Water views from every residence", es: "Vista al agua desde cada residencia" },
  { en: "Oversized balconies for outdoor living", es: "Balcones amplios para vivir al aire libre" },
  { en: "A nutritionist on staff", es: "Nutricionista en el equipo" },
  { en: "Private charter flights to Puerto Rico and back to the United States", es: "Vuelos chárter privados a Puerto Rico y de regreso a Estados Unidos" },
];

export const charters = {
  body: {
    en: "Owners at Tesoro Del Mar have private charter flights to their condo in Puerto Rico and back to the United States, so the trip home is as considered as the home itself.",
    es: "Los propietarios de Tesoro Del Mar cuentan con vuelos chárter privados a su condominio en Puerto Rico y de regreso a Estados Unidos, para que el viaje a casa sea tan cuidado como la casa misma.",
  } as L,
  points: [
    { en: "Private charter flights to your condo in Puerto Rico and back to the United States", es: "Vuelos chárter privados a su condominio en Puerto Rico y de regreso a Estados Unidos" },
    { en: "Private helipads, luxury shuttles and chauffeur services", es: "Helipuertos privados, traslados de lujo y servicio de chofer" },
    { en: "About 30 minutes from San Juan's international airport", es: "A unos 30 minutos del aeropuerto internacional de San Juan" },
  ] as L[],
};

/** Homepage amenities, from the TDM Brochure's "Exceptional amenities" lists (p5–p7). Six groups and a short list. */
export const amenityGroups: { key: string; title: L; text: L; image: "gym" | "golf" | "coast" | "lounge" | "study" | "entrance" }[] = [
  {
    key: "clubhouse",
    title: { en: "The Clubhouse", es: "El Clubhouse" },
    text: {
      en: "An on-premises, members-only club with 14,000 sq ft of social and productivity spaces: café, bakery and corner store, a fine-dining restaurant and rooftop pool bar.",
      es: "Un club privado para miembros con 14,000 pies² de espacios sociales y de trabajo: café, panadería y tienda, un restaurante de alta cocina y bar en la piscina de la azotea.",
    },
    image: "lounge",
  },
  {
    key: "wellness",
    title: { en: "Wellness", es: "Bienestar" },
    text: {
      en: "A state-of-the-art fitness center and pilates studio, a spa for massage, treatments and salon services, and an outdoor yoga terrace.",
      es: "Un gimnasio de última generación y estudio de pilates, un spa para masajes, tratamientos y salón, y una terraza de yoga al aire libre.",
    },
    image: "gym",
  },
  {
    key: "pool",
    title: { en: "Pool and putting course", es: "Piscina y campo de putting" },
    text: {
      en: "An outdoor resort-style pool with sundeck and poolside bar beside a next-generation 18-hole putting course.",
      es: "Una piscina estilo resort con solárium y bar junto a un campo de putting de 18 hoyos de nueva generación.",
    },
    image: "golf",
  },
  {
    key: "beach",
    title: { en: "Beach club and slipway", es: "Club de playa y rampa" },
    text: {
      en: "A beach club with food and beverage service, reached by the walking path or golf cart, and a slipway for easy boat launching.",
      es: "Un club de playa con servicio de comida y bebida, al que se llega por el sendero o en carrito de golf, y una rampa para botar embarcaciones.",
    },
    image: "coast",
  },
  {
    key: "work",
    title: { en: "Work", es: "Trabajo" },
    text: {
      en: "A business center with conference rooms, reservable private offices, a coffee bar, high-speed Wifi and IT services available 24/7.",
      es: "Un centro de negocios con salas de conferencias, oficinas privadas reservables, coffee bar, Wifi de alta velocidad y servicios de TI 24/7.",
    },
    image: "study",
  },
  {
    key: "arrival",
    title: { en: "Arrival and service", es: "Llegada y servicio" },
    text: {
      en: "A porte-cochère with a private residential lobby attended 24/7, valet and self-parking, and a luxury house car and golf cart service.",
      es: "Un pórtico con vestíbulo residencial privado atendido 24/7, valet y estacionamiento propio, y servicio de auto de la casa y carrito de golf.",
    },
    image: "entrance",
  },
];

export const amenityExtras: L[] = [
  { en: "Tennis courts", es: "Canchas de tenis" },
  { en: "Half basketball court", es: "Media cancha de baloncesto" },
  { en: "Beach volleyball and beach tennis", es: "Voleibol y tenis de playa" },
  { en: "Programmable golf simulator and lounge", es: "Simulador de golf programable y salón" },
  { en: "Two-mile walking path through landscaped gardens", es: "Sendero de dos millas entre jardines" },
  { en: "Resident lounge with curated art and bar service", es: "Salón de residentes con arte y servicio de bar" },
  { en: "Private, secure climate-controlled storage", es: "Almacenamiento privado, seguro y climatizado" },
];
