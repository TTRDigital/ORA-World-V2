import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/types";
import { tdm } from "@/content/seed/images";
import { optimisedImage } from "@/lib/image-props";
import { Module } from "@/components/ui/Module";
import { RenderGalleryStage } from "./RenderGalleryStage";

/** The client's Tesoro Del Mar renders, in walk-through order, for the 3D carousel. */
const RENDERS = [
  { key: "road", title: { en: "The arrival", es: "La llegada" }, image: tdm.exteriorRoad },
  { key: "pool", title: { en: "The resort pool", es: "La piscina del resort" }, image: tdm.exteriorPull },
  { key: "atrium", title: { en: "Double-height lobby", es: "Vestíbulo de doble altura" }, image: tdm.foyerAtrium },
  { key: "lounge", title: { en: "Lobby lounge", es: "Salón del vestíbulo" }, image: tdm.foyerLounge },
  { key: "living", title: { en: "Apartment 1403, living", es: "Apartamento 1403, sala" }, image: tdm.aptLiving },
  { key: "bedroom", title: { en: "Primary bedroom", es: "Dormitorio principal" }, image: tdm.aptBedroom },
  { key: "bath", title: { en: "Primary bath", es: "Baño principal" }, image: tdm.aptBath2 },
  { key: "penthouse", title: { en: "Penthouse living", es: "Sala del penthouse" }, image: tdm.penthouseLiving },
  { key: "golf", title: { en: "Across the green", es: "Desde las áreas verdes" }, image: tdm.exteriorGolf },
];

/** Homepage module: a 3D perspective carousel (Vengeance UI) of the client's renders on a basalt panel. */
export async function RenderGallery({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "renders" });
  const items = RENDERS.map((r) => {
    const img = optimisedImage(r.image, locale, "(max-width: 767px) 250px, 560px");
    return { title: r.title[locale], src: img.src, srcSet: img.srcSet, sizes: img.sizes, alt: img.alt, objectPosition: img.objectPosition };
  });
  return (
    <Module id="renders" tone="basalt" label={t("label")} headline={t("headline")} intro={t("intro")}>
      <RenderGalleryStage items={items} />
    </Module>
  );
}
