import type { Locale } from "@/content/types";
import { getHome, getProjects } from "@/lib/content";
import { t } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import {
  CompareTable,
  CompareScale,
  type CompareColumn,
  type CompareRow,
  type ScaleMetric,
} from "./CompareTable";
import { getTranslations } from "next-intl/server";

/**
 * The published figures behind the scale bars (oraworld.com/tesoro-del-mar and /dorado-waterfalls, also in the
 * seed's project facts). Tesoro Del Mar's villa count is not published, so its residences bar counts the 129
 * apartments only and says so; Dorado Waterfalls' land is published as "over 10 million sq ft".
 */
const SCALE = {
  residences: { tdm: 129, dw: 1518 + 18, tdmNote: true, dwOver: false },
  suites: { tdm: 42, dw: 60, tdmNote: false, dwOver: false },
  amenities: { tdm: 65500, dw: 120000, tdmNote: false, dwOver: false },
  land: { tdm: 335995, dw: 10000000, tdmNote: false, dwOver: true },
} as const;

/** Module 8: Tesoro Del Mar and Dorado Waterfalls side by side, from each project's published facts. */
export async function CompareProjects({ locale }: { locale: Locale }) {
  const [home, projects, tx] = await Promise.all([
    getHome(),
    getProjects(),
    getTranslations({ locale, namespace: "compare" }),
  ]);
  const c = home.compare;
  if (!c.enabled) return null;
  const tdm = projects.find((p) => p.slug === "tesoro-del-mar");
  const dw = projects.find((p) => p.slug === "dorado-waterfalls");
  if (!tdm || !dw) return null;
  const columns: CompareColumn[] = [tdm, dw].map((p) => ({
    slug: p.slug,
    name: t(p.name, locale),
    href: `/place/${p.slug}`,
    image: p.hero,
  }));
  const rows: CompareRow[] = tdm.facts.map((f, i) => {
    const other = dw.facts.find((x) => x.label.en === f.label.en) ?? dw.facts[i];
    const cell = (x: typeof f | undefined) =>
      x && x.value && x.confirmed
        ? { value: t(x.value, locale), applies: true }
        : x && x.value
          ? { value: t(x.value, locale), applies: false }
          : null;
    return { label: t(f.label, locale), cells: [cell(f), cell(other)] };
  });
  return (
    <Module
      id="compare"
      tone="basalt"
      label={t(c.label, locale)}
      headline={t(c.headline, locale)}
      intro={t(c.intro, locale)}
    >
      <CompareScale
        locale={locale}
        names={[columns[0].name, columns[1].name]}
        metrics={(Object.keys(SCALE) as (keyof typeof SCALE)[]).map((k): ScaleMetric => ({
          key: k,
          label: tx(`metrics.${k}.label`),
          unit: tx(`metrics.${k}.unit`),
          values: [SCALE[k].tdm, SCALE[k].dw],
          notes: [
            SCALE[k].tdmNote ? tx("metrics.residences.tdmNote") : null,
            SCALE[k].dwOver ? tx("metrics.land.dwNote") : null,
          ],
          over: [false, SCALE[k].dwOver],
        }))}
      />
      <CompareTable locale={locale} columns={columns} rows={rows} />
    </Module>
  );
}
