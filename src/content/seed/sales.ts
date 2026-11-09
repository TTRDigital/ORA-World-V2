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
