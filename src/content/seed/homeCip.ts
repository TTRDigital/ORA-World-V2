import type { L } from "../types";

/**
 * Homepage copy for the Cipriani-style layout (client reference: theresidencesatcipriani.com). Every line comes from
 * the TDM Brochure, the Phase 1 floor plans or the sales team's prospect email; titles reuse the brochure's own
 * headings ("A life to treasure", "Ease, elevated", "Inspired by flight", "A rare vantage").
 */
export const cip = {
  hero: {
    title: { en: "A life to treasure", es: "Una vida para atesorar" } as L,
    sub: { en: "Tesoro Del Mar · An ORA World residence · Dorado, Puerto Rico", es: "Tesoro Del Mar · Una residencia ORA World · Dorado, Puerto Rico" } as L,
  },
  tour: {
    eyebrow: { en: "Virtual tour", es: "Recorrido virtual" } as L,
    title: { en: "Step inside", es: "Entre" } as L,
    intro: {
      en: "Walk the ORA World 360° collection at your own pace, or watch the short film about the resort community and its focus on the health and wellness of owners.",
      es: "Recorra la colección 360° de ORA World a su ritmo, o vea la película corta sobre la comunidad y su enfoque en la salud y el bienestar de los propietarios.",
    } as L,
  },
  amenities: {
    eyebrow: { en: "Amenities & features", es: "Amenidades y servicios" } as L,
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
        label: { en: "Features", es: "Servicios" } as L,
        items: [
          { en: "Fitness center, pilates and spa", es: "Gimnasio, pilates y spa" },
          { en: "18-hole putting course", es: "Campo de putting de 18 hoyos" },
          { en: "Beach club and boat slipway", es: "Club de playa y rampa para botes" },
          { en: "Lobby attended 24/7, valet", es: "Vestíbulo atendido 24/7 y valet" },
        ] as L[],
      },
    ],
  },
  residences: {
    eyebrow: { en: "Residences", es: "Residencias" } as L,
    title: { en: "Inspired by flight", es: "Inspiradas en el vuelo" } as L,
    intro: {
      en: "Curved towers arc like wings, spacious balconies stretch toward the sea and glass facades dissolve the boundary between home and horizon.",
      es: "Las torres curvas se arquean como alas, los amplios balcones se extienden hacia el mar y las fachadas de vidrio borran el límite entre hogar y horizonte.",
    } as L,
    bullets: [
      { en: "10' ceilings", es: "Techos de 10 pies" },
      { en: "All-glass façade", es: "Fachada totalmente de vidrio" },
      { en: "1 to 6 bedroom residences", es: "Residencias de 1 a 6 dormitorios" },
      { en: "Private elevators", es: "Ascensores privados" },
      { en: "Oversized balconies", es: "Balcones amplios" },
      { en: "Water views from every residence", es: "Vista al agua desde cada residencia" },
    ] as L[],
  },
  penthouse: {
    eyebrow: { en: "Penthouse", es: "Penthouse" } as L,
    title: { en: "The Penthouse", es: "El Penthouse" } as L,
    intro: {
      en: "The crown of Tower 1: floor 18 on two levels, with 9,807 sq ft inside and 11,475 sq ft of balconies and terraces.",
      es: "La corona de la Torre 1: el piso 18 en dos niveles, con 9,807 pies² interiores y 11,475 pies² de balcones y terrazas.",
    } as L,
    bullets: [
      { en: "6 bedrooms, 8 baths and 2 powder rooms", es: "6 dormitorios, 8 baños y 2 medios baños" },
      { en: "Private elevator", es: "Ascensor privado" },
      { en: "Chef's kitchen and wine cellar", es: "Cocina de chef y cava" },
      { en: "Gym, two studies and recreation areas", es: "Gimnasio, dos estudios y áreas recreativas" },
    ] as L[],
  },
  plans: {
    eyebrow: { en: "Floor plans", es: "Planos" } as L,
    title: { en: "Phase 1 pricing", es: "Precios de la Fase 1" } as L,
    intro: {
      en: "60 residences on floors 5 to 18 of Tower 1. Early pre-construction pricing averages $2,250 per sq ft; later units will likely be sold at higher rates.",
      es: "60 residencias en los pisos 5 al 18 de la Torre 1. Los precios iniciales de preconstrucción promedian $2,250 por pie²; es probable que las unidades posteriores se vendan a precios más altos.",
    } as L,
    tiers: [
      { label: { en: "Lower units", es: "Unidades bajas" } as L, value: "$2,000" },
      { label: { en: "Average", es: "Promedio" } as L, value: "$2,250" },
      { label: { en: "Higher units", es: "Unidades altas" } as L, value: "$2,500" },
    ],
  },
  charters: {
    eyebrow: { en: "Private charters", es: "Vuelos chárter privados" } as L,
    title: { en: "Fly private to Puerto Rico", es: "Vuele privado a Puerto Rico" } as L,
    bullets: [
      { en: "Private charter flights to your condo in Puerto Rico and back to the United States", es: "Vuelos chárter privados a su condominio en Puerto Rico y de regreso a Estados Unidos" },
      { en: "Private jet charters by Ora World Jet and Ora Lift vertical take-off and landing vehicles", es: "Jets privados de Ora World Jet y vehículos de despegue y aterrizaje vertical Ora Lift" },
      { en: "Luxury house car and golf cart service", es: "Auto de la casa y servicio de carrito de golf" },
    ] as L[],
  },
  location: {
    eyebrow: { en: "Location", es: "Ubicación" } as L,
    title: { en: "A rare vantage", es: "Una posición única" } as L,
    intro: {
      en: "On Puerto Rico's northern shore in Dorado, where gentle waves meet soft-sand shores and a coastal park unfolds just beyond.",
      es: "En la costa norte de Puerto Rico, en Dorado, donde las olas suaves llegan a playas de arena fina y un parque costero se abre justo al lado.",
    } as L,
    address: { en: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692", es: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692" } as L,
    bullets: [
      { en: "Steps from the beach and national park", es: "A pasos de la playa y del parque nacional" },
      { en: "About 30 minutes from San Juan and its international airport", es: "A unos 30 minutos de San Juan y su aeropuerto internacional" },
      { en: "0% tax on capital gains and dividends, 4% on qualified income under Act 60", es: "0% de impuesto sobre ganancias de capital y dividendos, 4% sobre ingresos elegibles bajo la Ley 60" },
      { en: "A US jurisdiction", es: "Jurisdicción de Estados Unidos" },
    ] as L[],
  },
  contact: {
    eyebrow: { en: "Contact", es: "Contacto" } as L,
    title: { en: "Request pricing and availability", es: "Solicite precios y disponibilidad" } as L,
    intro: {
      en: "Tell us what you are looking for. Our agent, Reza, will follow up with pricing, floor plans and availability.",
      es: "Cuéntenos qué busca. Nuestro agente, Reza, le enviará precios, planos y disponibilidad.",
    } as L,
    bullets: [
      { en: "Current Phase 1 pricing", es: "Precios actuales de la Fase 1" },
      { en: "Floor plans matched to your layout", es: "Planos según la distribución que busca" },
      { en: "A follow-up call with our agent", es: "Una llamada con nuestro agente" },
    ] as L[],
  },
};
