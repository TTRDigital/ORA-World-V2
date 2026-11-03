import type { Locale } from "@/content/types";
import { getHome } from "@/lib/content";
import { t } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import { DialStage } from "./DialStage";

/** Module 5: built to endure. A nine-segment dial that fills as the nine published features scroll past. */
export async function ResilienceDial({ locale }: { locale: Locale }) {
  const home = await getHome();
  const c = home.resilience;
  if (!c.enabled || c.features.length === 0) return null;
  return (
    <Module id="resilience" tone="travertine" label={t(c.label, locale)} headline={t(c.headline, locale)} intro={t(c.intro, locale)}>
      <DialStage locale={locale} features={c.features} />
    </Module>
  );
}
