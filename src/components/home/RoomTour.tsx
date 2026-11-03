import type { Locale } from "@/content/types";
import { getHome } from "@/lib/content";
import { t } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import { RoomTourStage } from "./RoomTourStage";

/** Module 4: room by room, a hotspot tour over the published renders. */
export async function RoomTour({ locale }: { locale: Locale }) {
  const home = await getHome();
  const c = home.rooms;
  const rooms = c.rooms.filter((r) => !r.image.placeholder);
  if (!c.enabled || rooms.length === 0) return null;
  return (
    <Module id="rooms" tone="basalt" label={t(c.label, locale)} headline={t(c.headline, locale)}>
      <RoomTourStage locale={locale} rooms={rooms} />
    </Module>
  );
}
