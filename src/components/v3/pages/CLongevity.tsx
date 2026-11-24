import type { Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { life } from "@/content/seed/images";
import { PageHero } from "@/components/ui/PageHero";
import { LongevitySections } from "@/components/home/LongevitySections";

/**
 * Longevity on Versions C and D (client, 24 Nov: "the Longevity page should be like Version 1's"): the same banner and
 * sections as Version A's Longevity page, inside the version's own header and footer (links rewritten to its pages).
 */
export async function CLongevity({ locale }: { locale: Locale; films?: boolean }) {
  const card = cip.different.items.find((it) => it.kind === "health")!;
  const spaFilm = { ...life.spa, src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%", alt: { en: "An ocean-view treatment room at the spa", es: "Una sala de tratamientos con vista al mar en el spa" }, video: "/videos/clips/spa-ocean.mp4", poster: "/videos/clips/spa-ocean-poster.jpg" };
  return (
    <div className="flex flex-col">
      <PageHero locale={locale} label={locale === "es" ? "Longevidad" : "Longevity"} headline={t(card.title, locale)} intro={t(card.text, locale)} image={spaFilm} />
      <LongevitySections locale={locale} />
    </div>
  );
}
