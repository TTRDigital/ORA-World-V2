import type { Locale } from "@/content/types";
import { getHome, getPortfolio } from "@/lib/content";
import { t } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import { PortfolioStage } from "./PortfolioStage";

/** Module 10: Portfolio. A stylised Puerto Rico map with pins plus the twelve location cards. */
export async function Portfolio({ locale }: { locale: Locale }) {
  const [home, portfolio] = await Promise.all([getHome(), getPortfolio()]);
  const m = home.portfolio;
  if (!m.enabled) return null;
  const items = [...portfolio]
    .sort((a, b) => Number(b.revealed) - Number(a.revealed))
    .map((l) => ({ slug: l.slug, name: l.name, tagline: t(l.tagline, locale), image: l.image, href: l.href, pin: l.pin, revealed: l.revealed }));
  return (
    <Module id="portfolio" tone="travertine" label={t(m.label, locale)} headline={t(m.headline, locale)} intro={t(m.intro, locale)}>
      <PortfolioStage items={items} />
    </Module>
  );
}
