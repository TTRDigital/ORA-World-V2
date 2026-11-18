import type { InteriorSlide } from "@/components/cip/InteriorsGallery";
import { tdm } from "./images";

/** The "Inspired living spaces" slides, shared by Version A's homepage and Version B (client, 18 Nov: "do this in Version B too"). */
const c = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

export function interiorSlides(es: boolean): InteriorSlide[] {
  return [
    // Client, 17 Nov: the penthouse living room first.
    { title: "Penthouse", note: es ? "Piso 18, dos niveles" : "Floor 18, two levels", image: tdm.penthouseLiving, ...c("p24-penthouse-living") },
    { title: es ? "Sala y comedor" : "Living & dining", note: es ? "Interior de residencia" : "Residence interior", image: tdm.kitchenDining, ...c("p15-apartment-living") },
    { title: es ? "Cocina gourmet" : "Gourmet kitchen", note: es ? "Gabinetes italianos" : "Italian cabinetry", image: tdm.kitchenWine, ...c("p16-apartment-kitchen") },
    { title: es ? "Suite principal" : "Primary suite", note: es ? "Interior de residencia" : "Residence interior", image: tdm.masterSuite, ...c("p17-primary-suite") },
    { title: es ? "Dormitorio de invitados" : "Guest bedroom", note: es ? "Interior de residencia" : "Residence interior", image: tdm.aptBedroom, ...c("p18-guest-bedroom") },
    { title: es ? "Dormitorio" : "Bedroom", note: es ? "Vista al mar" : "Ocean view", image: tdm.bedroomOcean, ...c("p21-bedroom-ocean") },
    { title: es ? "Baño principal" : "Primary bath", note: "Dornbracht", image: tdm.aptBath2, ...c("p20-bathroom-tub") },
    // Client, 17 Nov: the vanity film, after the primary bath.
    { title: es ? "Lavabo doble" : "Double vanity", note: es ? "Mármol" : "Marble", image: tdm.vanity, ...c("p19-bathroom-vanity") },
    { title: es ? "Medio baño" : "Powder room", note: es ? "Madera y piedra" : "Wood and stone", image: tdm.powderRoom, ...c("p22-bathroom-amber") },
    { title: es ? "Estudio" : "Study", note: es ? "Interior de residencia" : "Residence interior", image: tdm.aptStudy, ...c("p23-study") },
    // Client, 17 Nov: the second penthouse film last (no matching still: its first frame is the picture).
    {
      title: es ? "Salón del penthouse" : "Penthouse living",
      note: es ? "Piso 18, dos niveles" : "Floor 18, two levels",
      image: {
        src: "/videos/clips/p25-penthouse-living-a-poster.jpg",
        width: 1248,
        height: 704,
        focal: "50% 50%",
        alt: { en: "The two-level penthouse living room with its floating stair", es: "El salón de dos niveles del penthouse con su escalera flotante" },
        rendering: true,
      },
      ...c("p25-penthouse-living-a"),
    },
  ];
}
