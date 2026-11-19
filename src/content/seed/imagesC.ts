import type { ImageRef } from "../types";

/**
 * Photographs for Version C (client, 19 Nov: "use these images", the renders sent in chat, which are the ORA World
 * presentation renders, plus the images of Versions A and B). Only the homepage banner is a film on Version C.
 */
const img = (file: string, w: number, h: number, focal: string, en: string, es: string): ImageRef => ({ src: `/images/c/${file}.jpg`, width: w, height: h, focal, alt: { en, es }, rendering: true });

export const cImg = {
  aerialCove: img("tesoro-aerial-cove", 1559, 1008, "50% 50%", "Tesoro del Mar from the air, above a cove on Puerto Rico's north coast", "Tesoro del Mar desde el aire, sobre una cala de la costa norte de Puerto Rico"),
  aerialTowers: img("tesoro-aerial-towers", 1559, 989, "50% 50%", "The towers among the trees, seen from above", "Las torres entre los árboles, vistas desde arriba"),
  towerPool: img("tesoro-tower-pool", 1642, 2025, "50% 60%", "The curved towers above the pool, a swimmer at the edge", "Las torres curvas sobre la piscina, una nadadora en el borde"),
  diningPiano: img("dining-piano", 1642, 1093, "50% 50%", "A double-height dining room with a white piano and ocean views", "Un comedor de doble altura con piano blanco y vista al mar"),
  livingStair: img("living-stair", 1642, 908, "50% 50%", "A two-level living room with a floating marble stair", "Un salón de dos niveles con escalera flotante de mármol"),
  kitchenWine: img("kitchen-wine", 1642, 1025, "50% 50%", "A kitchen with a glass wine wall and a long dining table", "Una cocina con cava de vidrio y una larga mesa de comedor"),
  entrance: img("entrance-waterfall", 1642, 1005, "50% 50%", "The arrival canopy at night, with its water curtain", "El pórtico de llegada de noche, con su cortina de agua"),
  lobbyGarden: img("lobby-garden", 1642, 1004, "50% 50%", "A lobby with planted islands and a stone water wall", "Un vestíbulo con islas de plantas y un muro de agua en piedra"),
  poolDeck: img("pool-deck", 1642, 997, "40% 50%", "The pool deck under white umbrellas, beside the tower", "La terraza de la piscina bajo sombrillas blancas, junto a la torre"),
  livingSofa: img("living-sofa", 1642, 1004, "50% 55%", "A living room with a glass wine room and an open kitchen", "Un salón con cava de vidrio y cocina abierta"),
  bedroom: img("bedroom", 1642, 997, "45% 50%", "A bedroom with a glass chandelier opening onto a terrace", "Un dormitorio con lámpara de cristal que se abre a una terraza"),
  livingView: img("living-view", 1642, 1004, "50% 55%", "An open living room with floor-to-ceiling glass onto green hills", "Un salón abierto con ventanales de piso a techo hacia colinas verdes"),
  bar: img("bar", 1642, 1004, "55% 50%", "A marble bar beside a spiral stair", "Una barra de mármol junto a una escalera de caracol"),
  clubhousePool: img("clubhouse-pool", 1642, 997, "50% 55%", "A curved glass clubhouse behind a pool with in-water loungers", "Un club curvo de vidrio tras una piscina con tumbonas en el agua"),
  lobbyMarble: img("lobby-marble", 1642, 1004, "50% 50%", "A double-height lobby around a marble column", "Un vestíbulo de doble altura alrededor de una columna de mármol"),
  kitchenIsland: img("kitchen-island", 1642, 997, "50% 50%", "A kitchen with a marble island and lit open shelves", "Una cocina con isla de mármol y estantes abiertos iluminados"),
};
