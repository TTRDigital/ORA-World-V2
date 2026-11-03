"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { FloorPlan, Locale } from "@/content/types";
import { useShortlist } from "@/lib/shortlist";
import { t } from "@/lib/localize";
import { Tbc } from "@/components/ui/Tbc";
import { Close } from "@/components/ui/Icons";

/** Compare up to three shortlisted plans, sticky first column on mobile. */
export function PlanCompare({ plans, locale }: { plans: FloorPlan[]; locale: Locale }) {
  const tp = useTranslations("plans");
  const { items, toggle } = useShortlist();
  const chosen = items.map((s) => plans.find((p) => p.slug === s)).filter(Boolean) as FloorPlan[];
  if (chosen.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="body mx-auto">{tp("empty")}</p>
        <Link href="/residences/plans" className="pill pill-basalt mt-5">{tp("title")}</Link>
      </div>
    );
  }
  const rows: { label: string; cell: (p: FloorPlan) => React.ReactNode }[] = [
    { label: tp("bedrooms"), cell: (p) => p.bedrooms },
    { label: tp("bath"), cell: (p) => p.bathrooms },
    { label: tp("interior"), cell: (p) => (p.interiorSqFt ? `${p.interiorSqFt.toLocaleString()} sq ft` : <Tbc />) },
    { label: tp("exterior"), cell: (p) => (p.exteriorSqFt ? `${p.exteriorSqFt.toLocaleString()} sq ft` : <Tbc />) },
    { label: tp("orientation"), cell: (p) => p.orientation },
    { label: tp("building"), cell: (p) => p.building },
    { label: tp("status.available").replace(/.*/, locale === "es" ? "Estado" : "Status"), cell: (p) => tp(`status.${p.status}`) },
    { label: locale === "es" ? "Desde" : "From", cell: (p) => (p.fromPrice ? `$${p.fromPrice.toLocaleString()}` : <Tbc />) },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate border-spacing-0 text-[15px]" data-testid="plan-compare">
        <caption className="visually-hidden">{tp("compare")}</caption>
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 bg-travertine p-3 text-left align-bottom">{tp("compare")}</th>
            {chosen.map((p) => (
              <th key={p.slug} scope="col" className="p-3 text-left align-bottom">
                <div className="frame mb-3 bg-bone" style={{ aspectRatio: "4/3" }}>
                  <Image src={p.image.src} alt={p.image.alt[locale]} fill sizes="30vw" quality={80} unoptimized={p.image.src.endsWith(".svg")} className="object-contain p-2" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/residences/plans/${p.slug}`} className="display-s">{t(p.name, locale)}</Link>
                  <button type="button" onClick={() => toggle(p.slug)} className="chip size-9 justify-center px-0" aria-label={tp("remove")}><Close /></button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label} data-reveal style={{ "--reveal-delay": `${i * 40}ms` } as React.CSSProperties}>
              <th scope="row" className="sticky left-0 border-t border-travertine-deep bg-travertine p-3 text-left font-semibold">{r.label}</th>
              {chosen.map((p) => (
                <td key={p.slug} className="tabular border-t border-travertine-deep p-3">{r.cell(p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
