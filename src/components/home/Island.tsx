import type { Locale } from "@/content/types";
import { getHome, getPois, getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import { IslandRail, type RailPlace, type RailPoi } from "./IslandRail";
import { MapLoader } from "@/components/map/MapLoader";

/** Module 7: the island as a draggable rail of places, a proximity list and a lazy MapLibre map. */
export async function Island({ locale }: { locale: Locale }) {
  const [home, pois, settings] = await Promise.all([getHome(), getPois(), getSiteSettings()]);
  const isl = home.island;
  if (!isl.enabled) return null;
  const poiList: RailPoi[] = pois.map((p) => ({
    slug: p.slug,
    name: t(p.name, locale),
    category: p.category,
    lat: p.lat,
    lng: p.lng,
    minutes: p.walkMinutes ?? p.driveMinutes,
    mode: p.walkMinutes ? "walk" : "drive",
    confirmed: p.confirmed,
    note: p.note ? t(p.note, locale) : null,
  }));
  const places: RailPlace[] = isl.places
    .filter((p) => !p.image.placeholder)
    .map((p) => ({ slug: p.slug, name: t(p.name, locale), text: t(p.text, locale), image: p.image, poi: p.poi }));
  return (
    <Module id="island" tone="travertine" label={t(isl.label, locale)} headline={t(isl.headline, locale)} intro={t(isl.intro, locale)}>
      <IslandRail locale={locale} places={places} pois={poiList} />
      <div className="mt-6 md:mt-8" data-reveal>
        <MapLoader site={{ lat: settings.siteLat, lng: settings.siteLng, name: "Tesoro Del Mar" }} pois={poiList} />
      </div>
    </Module>
  );
}
