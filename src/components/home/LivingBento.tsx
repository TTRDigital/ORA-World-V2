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
  const published = amenities.filter((a) => !a.image.placeholder);
  const sizes = tileSizesByOrientation(
    published.map((a) => ({ slug: a.slug, ratio: a.image.width / a.image.height })),
  );
  const tiles: LivingTile[] = published.map((a) => ({
    slug: a.slug,
    category: a.category,
    size: sizes.get(a.slug) ?? "md",
    name: t(a.name, locale),
    description: t(a.description, locale),
    image: a.image,
  }));
  return (
    <Module
      id="living"
      tone="bone"
      label={t(l.label, locale)}
      headline={t(l.headline, locale)}
      intro={t(l.intro, locale)}
    >
      <LivingGrid
        locale={locale}
        tiles={tiles}
        family={l.familyItems.map((i) => t(i, locale))}
        pets={l.petItems.map((i) => t(i, locale))}
      />
    </Module>
  );
}

/**
 * Tile sizes follow each photo's real orientation, so nothing is cropped against its grain: the three widest
 * landscapes become 2-column tiles and the most portrait photos become 2-row tiles; the rest are single cells.
 * The grid has 4 columns (2 on phones) and starts with the 2-cell Family | Pets card, so the cell count
 * (2 + one per tile + one extra per wide or tall tile) is kept a multiple of 4 and every row fills.
 */
function tileSizesByOrientation(items: { slug: string; ratio: number }[]) {
  const out = new Map<string, LivingTile["size"]>();
  const wide = items
    .filter((i) => i.ratio >= 1.4)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 3);
  wide.forEach((i) => out.set(i.slug, "lg"));
  const portrait = items.filter((i) => i.ratio <= 0.8 && !out.has(i.slug)).sort((a, b) => a.ratio - b.ratio);
  const base = 2 + items.length + wide.length;
  // Largest number of tall tiles (up to 6) that keeps the total a multiple of 4.
  let k = Math.min(6, portrait.length);
  while (k > 0 && (base + k) % 4 !== 0) k--;
  portrait.slice(0, k).forEach((i) => out.set(i.slug, "tall"));
  return out;
}
