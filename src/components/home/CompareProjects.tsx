import type { Locale } from "@/content/types";
import { getHome, getProjects } from "@/lib/content";
import { t } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import { CompareTable, type CompareColumn, type CompareRow } from "./CompareTable";

/** Module 8: Tesoro Del Mar and Dorado Waterfalls side by side, from each project's published facts. */
export async function CompareProjects({ locale }: { locale: Locale }) {
  const [home, projects] = await Promise.all([getHome(), getProjects()]);
  const c = home.compare;
  if (!c.enabled) return null;
  const tdm = projects.find((p) => p.slug === "tesoro-del-mar");
  const dw = projects.find((p) => p.slug === "dorado-waterfalls");
  if (!tdm || !dw) return null;
  const columns: CompareColumn[] = [tdm, dw].map((p) => ({ slug: p.slug, name: t(p.name, locale), href: `/place/${p.slug}`, image: p.hero }));
  const rows: CompareRow[] = tdm.facts.map((f, i) => {
    const other = dw.facts.find((x) => x.label.en === f.label.en) ?? dw.facts[i];
    const cell = (x: typeof f | undefined) => (x && x.value && x.confirmed ? { value: t(x.value, locale), applies: true } : x && x.value ? { value: t(x.value, locale), applies: false } : null);
    return { label: t(f.label, locale), cells: [cell(f), cell(other)] };
  });
  return (
    <Module id="compare" tone="basalt" label={t(c.label, locale)} headline={t(c.headline, locale)} intro={t(c.intro, locale)}>
      <CompareTable locale={locale} columns={columns} rows={rows} />
    </Module>
  );
}
