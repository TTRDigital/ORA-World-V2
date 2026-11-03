import type { PointOfInterest } from "../types";

/**
 * Points of interest around Dorado / Vega Alta. Coordinates are approximate. Only two distances are
 * published by the client: "30 minutes from the airport" and "walking distance to Balneario Cerro Gordo".
 * Every other time is an estimate and is shown as approximate until confirmed.
 */
export const pointsOfInterest: PointOfInterest[] = [
  { slug: "cerro-gordo", name: { en: "Balneario Cerro Gordo", es: "Balneario Cerro Gordo" }, category: "beach", lat: 18.4885, lng: -66.3386, driveMinutes: null, walkMinutes: 15, confirmed: true, note: { en: "Walking distance", es: "A pie" } },
  { slug: "sju", name: { en: "Luis Muñoz Marín International Airport", es: "Aeropuerto Internacional Luis Muñoz Marín" }, category: "airport", lat: 18.4394, lng: -66.0018, driveMinutes: 30, walkMinutes: null, confirmed: true, note: { en: "Published: 30 minutes", es: "Publicado: 30 minutos" } },
  { slug: "golf", name: { en: "Dorado championship golf", es: "Golf de campeonato en Dorado" }, category: "golf", lat: 18.4742, lng: -66.289, driveMinutes: 12, walkMinutes: null, confirmed: false, note: null },
  { slug: "dorado-beach", name: { en: "Dorado Beach", es: "Playa Dorado" }, category: "beach", lat: 18.4765, lng: -66.281, driveMinutes: 12, walkMinutes: null, confirmed: false, note: null },
  { slug: "tasis-dorado", name: { en: "International school, Dorado", es: "Escuela internacional, Dorado" }, category: "school", lat: 18.4553, lng: -66.2818, driveMinutes: 14, walkMinutes: null, confirmed: false, note: null },
  { slug: "dorado-dining", name: { en: "Dorado town and dining", es: "Pueblo y restaurantes de Dorado" }, category: "dining", lat: 18.4588, lng: -66.2676, driveMinutes: 14, walkMinutes: null, confirmed: false, note: null },
  { slug: "healthcare", name: { en: "Medical center", es: "Centro médico" }, category: "healthcare", lat: 18.462, lng: -66.269, driveMinutes: 15, walkMinutes: null, confirmed: false, note: { en: "Facility to be confirmed", es: "Centro por confirmar" } },
  { slug: "old-san-juan", name: { en: "Old San Juan", es: "Viejo San Juan" }, category: "culture", lat: 18.4663, lng: -66.1178, driveMinutes: 35, walkMinutes: null, confirmed: false, note: null },
  { slug: "el-yunque", name: { en: "El Yunque National Forest", es: "Bosque Nacional El Yunque" }, category: "nature", lat: 18.2955, lng: -65.79, driveMinutes: 75, walkMinutes: null, confirmed: false, note: null },
];
