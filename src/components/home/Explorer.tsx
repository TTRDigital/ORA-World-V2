import type { Locale } from "@/content/types";
import { getCollections, getHome } from "@/lib/content";
import { t } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import { ExplorerStage } from "./ExplorerStage";

/** Module 3: residence explorer. An illustrative tower stack whose bands select a collection. */
export async function Explorer({ locale }: { locale: Locale }) {
  const [home, collections] = await Promise.all([getHome(), getCollections()]);
  const c = home.explorer;
  if (!c.enabled || collections.length === 0) return null;
  return (
    <Module id="explorer" tone="bone" label={t(c.label, locale)} headline={t(c.headline, locale)} intro={t(c.intro, locale)}>
      <ExplorerStage locale={locale} collections={collections} note={t(c.note, locale)} />
    </Module>
  );
}
