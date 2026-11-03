import type { PortfolioLocation } from "../types";
import { places, tdm, dw } from "./images";

/**
 * The twelve ORA World locations exactly as listed on oraworld.com/our-residences, taglines verbatim.
 * Pins only where the municipality is in the published name or tagline. Positions are percentages on the
 * stylised island SVG (viewBox 0 0 1000 420).
 */
export const portfolio: PortfolioLocation[] = [
  { slug: "tesoro-del-mar", name: "Tesoro Del Mar", tagline: { en: "Harmony in modernity and nature", es: "Armonía entre modernidad y naturaleza" }, image: tdm.exteriorPull, href: "/place/tesoro-del-mar", pin: { x: 37, y: 18, municipality: "Dorado" }, revealed: true },
  { slug: "dorado-waterfalls", name: "Dorado Waterfalls", tagline: { en: "A sustainable community that harmonizes modern living with nature", es: "Una comunidad sostenible que armoniza la vida moderna con la naturaleza" }, image: dw.avenue, href: "/place/dorado-waterfalls", pin: { x: 39, y: 24, municipality: "Dorado" }, revealed: true },
  { slug: "the-top", name: "The Top", tagline: { en: "Elevated elegance in harmony with nature", es: "Elegancia elevada en armonía con la naturaleza" }, image: places.theTop, href: null, pin: null, revealed: true },
  { slug: "dorado-ocean-view-estates", name: "Dorado Ocean View Estates", tagline: { en: "Offering unparalleled comfort and style in a prestigious oceanfront location", es: "Confort y estilo sin igual en una prestigiosa ubicación frente al mar" }, image: null, href: null, pin: { x: 41, y: 14, municipality: "Dorado" }, revealed: true },
  { slug: "naguabo", name: "Naguabo", tagline: { en: "Futuristic living in a hidden bay", es: "Vida futurista en una bahía escondida" }, image: places.naguabo, href: null, pin: { x: 86, y: 58, municipality: "Naguabo" }, revealed: true },
  { slug: "loiza-river-city", name: "Loíza River City", tagline: { en: "Cultural harmony in modern living", es: "Armonía cultural en la vida moderna" }, image: places.loizaRiverCity, href: null, pin: { x: 66, y: 16, municipality: "Loíza" }, revealed: true },
  { slug: "loiza-ocean", name: "Loíza Ocean", tagline: { en: "Where leisure meets luxury and entertainment", es: "Donde el ocio se une al lujo y al entretenimiento" }, image: places.loizaOcean, href: null, pin: { x: 69, y: 12, municipality: "Loíza" }, revealed: true },
  { slug: "loiza-countryside-estates", name: "Loíza Countryside Estates", tagline: { en: "Sustainable living in harmony with nature", es: "Vida sostenible en armonía con la naturaleza" }, image: places.loizaCountryside, href: null, pin: { x: 68, y: 22, municipality: "Loíza" }, revealed: true },
  { slug: "guayama", name: "Guayama", tagline: { en: "Healthy living for optimal potential", es: "Vida saludable para un potencial óptimo" }, image: places.guayama, href: null, pin: { x: 62, y: 84, municipality: "Guayama" }, revealed: true },
  { slug: "costa-del-este-ceiba", name: "Costa del Este Ceiba", tagline: { en: "Anchored in coastal living", es: "Anclado en la vida costera" }, image: places.ceiba, href: null, pin: { x: 90, y: 44, municipality: "Ceiba" }, revealed: true },
  { slug: "aquamaria", name: "AquaMaria", tagline: { en: "A premier oceanfront destination in San Juan", es: "Un destino frente al mar de primer nivel en San Juan" }, image: null, href: null, pin: { x: 55, y: 10, municipality: "San Juan" }, revealed: true },
  { slug: "to-be-revealed", name: "To Be Revealed", tagline: { en: "Another great location on the ocean front is coming soon", es: "Otra gran ubicación frente al mar llegará pronto" }, image: null, href: null, pin: null, revealed: false },
];
