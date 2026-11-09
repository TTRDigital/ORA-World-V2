import type { Locale } from "@/content/types";
import { getHome } from "@/lib/content";
import { t } from "@/lib/localize";
import { formatNumber } from "@/lib/utils";

/**
 * Two tracks of published Tesoro Del Mar facts that slide in opposite directions with the scroll (driven by
 * ScrollFx). Decorative: the same facts are in the hero chips and the numbers module, so the band is aria-hidden.
 */
export async function FactsMarquee({ locale }: { locale: Locale }) {
  const home = await getHome();
  const stats = home.numbers.stats.filter((s) => s.value != null).map((s) => `${formatNumber(s.value as number, locale)} ${t(s.label, locale)}`);
  const places =
    locale === "es"
      ? ["Dorado, Puerto Rico", "A pasos del Balneario Cerro Gordo", "30 minutos del aeropuerto", "Junto a un parque nacional", "Tesoro Del Mar"]
      : ["Dorado, Puerto Rico", "A walk from Balneario Cerro Gordo", "30 minutes from the airport", "Near a national park", "Tesoro Del Mar"];
  const track = (items: string[], key: string) => (
    <span className="flex shrink-0 items-center" key={key}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 md:px-8">{it}</span>
          <span className="inline-block size-2 shrink-0 rotate-45 bg-brass" />
        </span>
      ))}
    </span>
  );
  return (
    <div aria-hidden="true" className="overflow-hidden py-6 md:py-10">
      <div data-marquee="0.35" className="flex w-max whitespace-nowrap will-change-transform">
        <span className="display-m flex text-charcoal">{[track(stats, "a"), track(stats, "b")]}</span>
      </div>
      <div data-marquee="0.25" data-direction="right" className="mt-2 flex w-max whitespace-nowrap will-change-transform md:mt-4">
        <span className="display-s flex text-charcoal-soft italic">{[track(places, "a"), track(places, "b"), track(places, "c")]}</span>
      </div>
    </div>
  );
}
