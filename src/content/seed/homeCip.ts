import type { L } from "../types";

/**
 * Homepage story (client, 10 Nov 2026 call): who ORA World is, why Puerto Rico (Act 60), longevity, what ORA World
 * offers, how ORA World helps, then one call to action, "Inquire". Layout after theresidencesatcipriani.com.
 *
 * Sources, nothing invented: oraworld.com (mission, "Beyond expectations", Act 60 explainer), the TDM Brochure
 * (p3–p7), the Phase 1 floor plans and the sales team's prospect email. Rules from the call: never name the owner;
 * no promises of helicopter or airport pickups; brochure and floor plans are offered through the inquiry form.
 */
export const cip = {
  hero: {
    title: { en: "A life to treasure", es: "Una vida para atesorar" } as L,
    sub: { en: "Tesoro Del Mar · Dorado, Puerto Rico", es: "Tesoro Del Mar · Dorado, Puerto Rico" } as L,
  },

  /* 01 Who is ORA World */
  who: {
    eyebrow: { en: "Who we are", es: "Quiénes somos" } as L,
    title: { en: "Beyond expectations", es: "Más allá de lo esperado" } as L,
    intro: {
      en: "ORA World creates thoughtfully crafted communities in Puerto Rico where longevity, luxury and nature exist in perfect harmony.",
      es: "ORA World crea comunidades concebidas con esmero en Puerto Rico, donde la longevidad, el lujo y la naturaleza conviven en perfecta armonía.",
    } as L,
    body: {
      en: "Our mission is to revolutionize Puerto Rico's real estate landscape with luxurious, eco-friendly developments that blend modern elegance with the island's natural beauty. Tesoro Del Mar in Dorado is the first expression of ORA World: a new vision for living rooted in freedom, connection and purpose.",
      es: "Nuestra misión es revolucionar el panorama inmobiliario de Puerto Rico con desarrollos de lujo y ecológicos que integran la elegancia moderna con la belleza natural de la isla. Tesoro Del Mar, en Dorado, es la primera expresión de ORA World: una nueva visión de vida basada en la libertad, la conexión y el propósito.",
    } as L,
    facts: [
      { value: "60", label: { en: "residences in Phase One", es: "residencias en la Fase Uno" } as L },
      { value: "65,000+", label: { en: "sq ft of amenities", es: "pies² de amenidades" } as L },
      { value: "30", label: { en: "minutes from San Juan", es: "minutos de San Juan" } as L },
      { value: "1–6", label: { en: "bedrooms, plus the penthouse", es: "dormitorios, más el penthouse" } as L },
    ],
  },

  /* 02 Why Puerto Rico: taxes */
  why: {
    eyebrow: { en: "Why Puerto Rico", es: "Por qué Puerto Rico" } as L,
    title: { en: "Keep more of what you earn", es: "Conserve más de lo que gana" } as L,
    intro: {
      en: "Puerto Rico combines favorable tax advantages with the status of a US jurisdiction. Under Act 60, qualifying residents pay 0% tax on capital gains and dividends and just 4% on qualified income.",
      es: "Puerto Rico combina ventajas fiscales favorables con la condición de jurisdicción de Estados Unidos. Bajo la Ley 60, los residentes que califican pagan 0% sobre ganancias de capital y dividendos y solo 4% sobre ingresos elegibles.",
    } as L,
    bullets: [
      { en: "Personal benefits require bona fide residency: generally 183 days a year in Puerto Rico", es: "Los beneficios personales exigen residencia bona fide: en general 183 días al año en Puerto Rico" },
      { en: "Qualifying export-service companies can see corporate rates as low as 4%", es: "Las empresas de servicios de exportación que califican pueden tener tasas corporativas de hasta 4%" },
      { en: "One application to the DDEC, then a decree with your benefits and obligations", es: "Una solicitud ante el DDEC y luego un decreto con sus beneficios y obligaciones" },
    ] as L[],
    stats: [
      { value: "0%", label: { en: "on capital gains and dividends", es: "sobre ganancias de capital y dividendos" } as L },
      { value: "4%", label: { en: "on qualified income", es: "sobre ingresos elegibles" } as L },
      { value: "183", label: { en: "days a year for bona fide residency", es: "días al año para residencia bona fide" } as L },
    ],
    note: {
      en: "General information, not tax or legal advice. Eligibility depends on your circumstances; consult a qualified tax advisor.",
      es: "Información general, no asesoría fiscal ni legal. La elegibilidad depende de su situación; consulte a un asesor fiscal calificado.",
    } as L,
    link: { en: "How Act 60 works", es: "Cómo funciona la Ley 60" } as L,
  },

  /* 03 Longevity */
  longevity: {
    eyebrow: { en: "Longevity", es: "Longevidad" } as L,
    title: { en: "Live well, for longer", es: "Vivir bien, por más tiempo" } as L,
    intro: {
      en: "ORA World is focused on improving the health and wellness of its owners. Tesoro Del Mar is designed around longevity and quality of life, with access to modern amenities, healthcare, education and entertainment.",
      es: "ORA World se enfoca en mejorar la salud y el bienestar de sus propietarios. Tesoro Del Mar está pensado para la longevidad y la calidad de vida, con acceso a amenidades modernas, salud, educación y entretenimiento.",
    } as L,
    bullets: [
      { en: "A nutritionist on staff", es: "Nutricionista en el equipo" },
      { en: "Fitness center and pilates studio", es: "Gimnasio y estudio de pilates" },
      { en: "Spa for massage, treatments and salon services", es: "Spa para masajes, tratamientos y salón" },
      { en: "Outdoor yoga terrace", es: "Terraza de yoga al aire libre" },
      { en: "Two-mile walking path through gardens", es: "Sendero de dos millas entre jardines" },
      { en: "Steps from the beach and a national park", es: "A pasos de la playa y de un parque nacional" },
    ] as L[],
  },

  /* 04 Step inside: tour and film */
  tour: {
    eyebrow: { en: "Step inside", es: "Recorra" } as L,
    title: { en: "See it for yourself", es: "Véalo usted mismo" } as L,
    intro: {
      en: "Walk the ORA World 360° collection at your own pace, or watch the short film about the resort community.",
      es: "Recorra la colección 360° de ORA World a su ritmo, o vea la película corta sobre la comunidad.",
    } as L,
  },

  /* 05 Residences (with the penthouse) */
  residences: {
    eyebrow: { en: "Residences", es: "Residencias" } as L,
    title: { en: "Inspired by flight", es: "Inspiradas en el vuelo" } as L,
    intro: {
      en: "Curved towers arc like wings, spacious balconies stretch toward the sea and glass facades dissolve the boundary between home and horizon.",
      es: "Las torres curvas se arquean como alas, los amplios balcones se extienden hacia el mar y las fachadas de vidrio borran el límite entre hogar y horizonte.",
    } as L,
    bullets: [
      { en: "Water views from every residence", es: "Vista al agua desde cada residencia" },
      { en: "Oversized balconies and wrap-around terraces", es: "Balcones amplios y terrazas envolventes" },
      { en: "10' ceilings; private elevators in most residences", es: "Techos de 10 pies; ascensor privado en la mayoría de las residencias" },
      { en: "Scavolini kitchens with Gaggenau appliances", es: "Cocinas Scavolini con electrodomésticos Gaggenau" },
      { en: "1 to 6 bedrooms, floors 5 to 17", es: "De 1 a 6 dormitorios, pisos 5 al 17" },
      { en: "The Penthouse: floor 18, two levels, 9,807 sq ft", es: "El Penthouse: piso 18, dos niveles, 9,807 pies²" },
    ] as L[],
  },

  /* 06 Amenities */
  amenities: {
    eyebrow: { en: "Amenities", es: "Amenidades" } as L,
    title: { en: "Ease, elevated", es: "La comodidad, elevada" } as L,
    intro: { en: "Over 65,000 sq ft of bespoke indoor and outdoor amenities.", es: "Más de 65,000 pies² de amenidades interiores y exteriores." } as L,
    groups: [
      {
        label: { en: "Clubhouse", es: "Clubhouse" } as L,
        items: [
          { en: "Members-only club, 14,000 sq ft", es: "Club privado de 14,000 pies²" },
          { en: "Fine-dining restaurant", es: "Restaurante de alta cocina" },
          { en: "Rooftop pool, sundeck and pool bar", es: "Piscina en la azotea, solárium y bar" },
          { en: "Business center, open 24/7", es: "Centro de negocios 24/7" },
        ] as L[],
      },
      {
        label: { en: "Resort", es: "Resort" } as L,
        items: [
          { en: "Resort-style pool and poolside bar", es: "Piscina estilo resort y bar" },
          { en: "18-hole putting course", es: "Campo de putting de 18 hoyos" },
          { en: "Beach club and boat slipway", es: "Club de playa y rampa para botes" },
          { en: "Tennis and golf simulator", es: "Tenis y simulador de golf" },
        ] as L[],
      },
    ],
  },

  /* 07 Private charters (how ORA World takes care of you). No helicopter, helipad or pickup claims. */
  charters: {
    eyebrow: { en: "Private charters", es: "Vuelos chárter privados" } as L,
    title: { en: "Fly private to Puerto Rico", es: "Vuele privado a Puerto Rico" } as L,
    intro: {
      en: "Owners at Tesoro Del Mar have private charter flights to their condo in Puerto Rico and back to the United States.",
      es: "Los propietarios de Tesoro Del Mar cuentan con vuelos chárter privados a su condominio en Puerto Rico y de regreso a Estados Unidos.",
    } as L,
    bullets: [
      { en: "Private jet charters through ORA World Jet", es: "Vuelos privados con ORA World Jet" },
      { en: "About 30 minutes from San Juan's international airport", es: "A unos 30 minutos del aeropuerto internacional de San Juan" },
      { en: "A private lobby attended 24/7, with valet parking", es: "Vestíbulo privado atendido 24/7, con valet" },
      { en: "A luxury house car and golf cart service", es: "Auto de la casa y servicio de carrito de golf" },
    ] as L[],
  },

  /* 08 Floor plans and pricing */
  plans: {
    eyebrow: { en: "Floor plans and pricing", es: "Planos y precios" } as L,
    title: { en: "Phase One", es: "Fase Uno" } as L,
    intro: {
      en: "60 residences on floors 5 to 18 of Tower 1. Early pre-construction pricing averages $2,250 per sq ft; later units will likely be sold at higher rates.",
      es: "60 residencias en los pisos 5 al 18 de la Torre 1. Los precios iniciales de preconstrucción promedian $2,250 por pie²; es probable que las unidades posteriores se vendan a precios más altos.",
    } as L,
    tiers: [
      { label: { en: "Lower units", es: "Unidades bajas" } as L, value: "$2,000" },
      { label: { en: "Average", es: "Promedio" } as L, value: "$2,250" },
      { label: { en: "Higher units", es: "Unidades altas" } as L, value: "$2,500" },
    ],
    plansNote: {
      en: "Inquire to receive the complete Phase 1 floor plans and the project presentation.",
      es: "Consulte para recibir los planos completos de la Fase 1 y la presentación del proyecto.",
    } as L,
  },

  /* 09 Three steps (approved on the call) */
  steps: {
    eyebrow: { en: "Your path to Tesoro Del Mar", es: "Su camino a Tesoro Del Mar" } as L,
    title: { en: "Three steps", es: "Tres pasos" } as L,
    items: [
      {
        title: { en: "Discover the island", es: "Descubra la isla" } as L,
        text: {
          en: "Watch the film, walk the 360° tour and see how Act 60 and Puerto Rico's north shore fit your plans.",
          es: "Vea la película, recorra el tour 360° y descubra cómo la Ley 60 y la costa norte de Puerto Rico encajan en sus planes.",
        } as L,
        href: "#virtual-tour",
        link: { en: "Step inside", es: "Recorrer" } as L,
      },
      {
        title: { en: "Choose your residence", es: "Elija su residencia" } as L,
        text: {
          en: "Sixty residences on floors 5 to 18, from one bedroom with den to the two-level penthouse.",
          es: "Sesenta residencias en los pisos 5 al 18, de un dormitorio con estudio al penthouse de dos niveles.",
        } as L,
        href: "#floor-plans",
        link: { en: "See the floor plans", es: "Ver los planos" } as L,
      },
      {
        title: { en: "Arrive in Dorado", es: "Llegue a Dorado" } as L,
        text: {
          en: "Inquire, and our sales team will follow up with pricing, availability and a visit to Tesoro Del Mar.",
          es: "Consulte, y nuestro equipo de ventas le enviará precios, disponibilidad y una visita a Tesoro Del Mar.",
        } as L,
        href: "#inquire",
        link: { en: "Inquire", es: "Consultar" } as L,
      },
    ],
    address: { en: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692", es: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692" } as L,
  },

  /* 10 Inquire */
  inquire: {
    eyebrow: { en: "Inquire", es: "Consultar" } as L,
    title: { en: "Inquire about Tesoro Del Mar", es: "Consulte por Tesoro Del Mar" } as L,
    intro: {
      en: "Tell us about your plans. Our sales team will follow up personally.",
      es: "Cuéntenos sus planes. Nuestro equipo de ventas le responderá personalmente.",
    } as L,
    bullets: [
      { en: "Current Phase 1 pricing and availability", es: "Precios y disponibilidad actuales de la Fase 1" },
      { en: "The Phase 1 floor plans and project presentation", es: "Los planos de la Fase 1 y la presentación del proyecto" },
      { en: "A private call or a visit to Dorado", es: "Una llamada privada o una visita a Dorado" },
    ] as L[],
  },
};
