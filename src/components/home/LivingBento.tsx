import type { Locale } from "@/content/types";
import { getAmenities, getHome } from "@/lib/content";
import { t } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import { LivingGrid, type LivingTile } from "./LivingGrid";

/** Module 6: Living, a filterable bento of the published amenities with a Family | Pets toggle card. */
export async function LivingBento({ locale }: { locale: Locale }) {
  const [home, amenities] = await Promise.all([getHome(), getAmenities()]);
  const l = home.living;
  if (!l.enabled) return null;
  const tiles: LivingTile[] = amenities
    .filter((a) => !a.image.placeholder)
    .map((a) => ({
      slug: a.slug,
      category: a.category,
      size: a.size ?? "md",
      name: t(a.name, locale),
      description: t(a.description, locale),
      image: a.image,
    }));
  return (
    <Module id="living" tone="bone" label={t(l.label, locale)} headline={t(l.headline, locale)} intro={t(l.intro, locale)}>
      <LivingGrid
        locale={locale}
        tiles={tiles}
        family={l.familyItems.map((i) => t(i, locale))}
        pets={l.petItems.map((i) => t(i, locale))}
      />
    </Module>
  );
}
