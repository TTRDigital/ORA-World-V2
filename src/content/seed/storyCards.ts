import type { RailCard } from "@/components/cip/CardRail";
import type { ImageRef } from "../types";
import { tdm, life } from "./images";

/**
 * The homepage story of a stay (client, 17 Nov: arrive, the view, step inside, the things to do, then your place), shared
 * by Version A's amenity gallery and Version C's mosaic. The word over each title carries the story.
 */
const v = (n: string) => ({ video: `/videos/amenity-${n}.mp4`, poster: `/videos/amenity-${n}-poster.jpg` });
const c = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

export function storyCards(es: boolean): { jetArrival: ImageRef; whoCards: RailCard[] } {
  const jetArrival = {
    src: "/videos/clips/jet-arrival-poster.jpg",
    width: 1632,
    height: 544,
    focal: "24% 60%",
    alt: { en: "The ORA World jet on the apron, guests stepping down to the tarmac", es: "El jet de ORA World en la plataforma, con huéspedes bajando a la pista" },
    rendering: true,
    ...c("jet-arrival"),
  };
  // Client, 17 Nov: the gallery tells the story of a stay: arrive, the view, step inside, the things to do, then
  // your place. The word over each title carries the story.
  const whoCards: RailCard[] = [
    { key: "arrival", kicker: es ? "Llegar" : "Arrive", title: es ? "Llegada" : "Arrival", text: es ? "Jet privado chárter y el auto de la casa esperándole." : "Private jet charters and a house car waiting.", image: jetArrival, ...c("jet-arrival"), videoFocal: jetArrival.focal },
    { key: "view", kicker: es ? "Contemplar" : "Take in the view", title: es ? "Vista al mar en cada unidad" : "Waterfront view for every unit", text: es ? "Sobre una cala turquesa de la costa norte." : "Above a turquoise cove on the north coast.", image: tdm.aerialCoast, ...c("p08-aerial-cove") },
    { key: "lobby", kicker: es ? "Entrar" : "Step inside", title: es ? "Vestíbulo" : "Lobby", text: es ? "Doble altura, atendido 24/7." : "Double height, attended 24/7.", image: tdm.foyerAtrium, ...c("lobby-combined") },
    { key: "pool", kicker: es ? "Relajarse" : "Unwind", title: es ? "Piscina" : "Pool deck", text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with sundeck and poolside bar.", image: tdm.exteriorPull, ...c("p10-pool-cabana") },
    { key: "putting", kicker: es ? "Jugar" : "Play", title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos junto a la piscina." : "Eighteen holes beside the pool.", image: tdm.exteriorGolf, ...c("p11-putting-green") },
    { key: "fitness", kicker: es ? "Moverse" : "Move", title: es ? "Gimnasio" : "Fitness", text: es ? "Gimnasio y estudio de pilates con vista al jardín." : "Fitness center and pilates studio with garden views.", image: tdm.gym, ...c("p14-gym"), videoFocal: "80% 50%" }, // client, 19 Nov: frame the film on the woman walking
    // Client, 18 Nov: the ocean-view spa film.
    { key: "spa", kicker: es ? "Renovarse" : "Restore", title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: { ...life.spa, src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%", alt: { en: "An ocean-view treatment room at the spa", es: "Una sala de tratamientos con vista al mar en el spa" } }, ...c("spa-ocean") },
    { key: "clubhouse", kicker: es ? "Reunirse" : "Gather", title: "Clubhouse", text: es ? "Club privado de 14,000 pies²." : "A members-only club of 14,000 sq ft.", image: tdm.foyerLounge },
    // Client, 18 Nov: "Eat" after Gather, before Come home: the oceanfront restaurant film.
    { key: "eat", kicker: es ? "Comer" : "Eat", title: es ? "El restaurante" : "The restaurant", text: es ? "Cenas frente al mar, y una cocina fantasma que cocina para usted en casa." : "Dinner facing the sea, and a ghost kitchen that cooks for you at home.", image: { src: "/videos/clips/restaurant-poster.jpg", width: 1280, height: 720, focal: "50% 50%", alt: { en: "An oceanfront dining room, a couple raising a glass by the window", es: "Un comedor frente al mar, una pareja brindando junto a la ventana" }, rendering: true }, ...c("restaurant") },
    { key: "luxury", kicker: es ? "Volver a casa" : "Come home", title: es ? "Vida de lujo" : "Luxury Living", text: es ? "Fachadas de vidrio y terrazas envolventes, pensadas para vivir dentro y fuera." : "Glass façades and wraparound terraces, designed for indoor and outdoor living.", image: { ...tdm.penthouseLiving, alt: { en: "A double-height living room with a floating marble stair", es: "Un salón de doble altura con escalera flotante de mármol" } }, ...v("penthouse"), playlist: ["/videos/luxury-suite.mp4", "/videos/luxury-kitchen.mp4"] },
  ];
  return { jetArrival, whoCards };
}
