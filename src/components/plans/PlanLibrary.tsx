"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Collection, FloorPlan, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cn } from "@/lib/utils";
import { Grid, List } from "@/components/ui/Icons";
import { PlanCard } from "./PlanCard";
import { ShortlistBar } from "./ShortlistBar";

const ORIENTATIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

/** Floor plan library with filters (collection, bedrooms, size, orientation, building), grid/list, shortlist. */
export function PlanLibrary({ plans, collections, locale }: { plans: FloorPlan[]; collections: Collection[]; locale: Locale }) {
  const tp = useTranslations("plans");
  const [collection, setCollection] = useState("all");
  const [bedrooms, setBedrooms] = useState<number | "all">("all");
  const [orientation, setOrientation] = useState<string>("all");
  const [building, setBuilding] = useState("all");
  const [size, setSize] = useState<"all" | "small" | "large">("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const buildings = Array.from(new Set(plans.map((p) => p.building)));
  const results = useMemo(
    () =>
      plans.filter(
        (p) =>
          (collection === "all" || p.collection === collection) &&
          (bedrooms === "all" || (bedrooms === 4 ? p.bedrooms >= 4 : p.bedrooms === bedrooms)) &&
          (orientation === "all" || p.orientation === orientation) &&
          (building === "all" || p.building === building) &&
          (size === "all" || (p.interiorSqFt == null ? true : size === "small" ? p.interiorSqFt < 1500 : p.interiorSqFt >= 1500)),
      ),
    [plans, collection, bedrooms, orientation, building, size],
  );
  useEffect(() => {
    window.dispatchEvent(new Event("ora2:reveal"));
  }, [results, view]);

  const chip = (active: boolean, onClick: () => void, label: string, key: string) => (
    <button key={key} type="button" className="chip" aria-pressed={active} onClick={onClick}>{label}</button>
  );
  return (
    <div data-testid="plan-library">
      <div className="grid gap-4">
        <div role="group" aria-label={tp("collection")} className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {chip(collection === "all", () => setCollection("all"), tp("filters") === "Filtros" ? "Todas" : "All", "all")}
          {collections.map((c) => chip(collection === c.slug, () => setCollection(c.slug), t(c.name, locale), c.slug))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <div role="group" aria-label={tp("bedrooms")} className="flex items-center gap-2">
            <span className="small font-semibold text-charcoal-soft">{tp("bedrooms")}</span>
            {chip(bedrooms === "all", () => setBedrooms("all"), tp("filters") === "Filtros" ? "Todas" : "Any", "b-all")}
            {[1, 2, 3, 4].map((n) => chip(bedrooms === n, () => setBedrooms(n), n === 4 ? "4+" : String(n), `b-${n}`))}
          </div>
          <div role="group" aria-label={tp("size")} className="flex items-center gap-2">
            <span className="small font-semibold text-charcoal-soft">{tp("size")}</span>
            {chip(size === "all", () => setSize("all"), tp("filters") === "Filtros" ? "Todos" : "All", "s-all")}
            {chip(size === "small", () => setSize("small"), "< 1,500 sq ft", "s-small")}
            {chip(size === "large", () => setSize("large"), "≥ 1,500 sq ft", "s-large")}
          </div>
          <div className="flex items-center gap-2">
            <label className="small font-semibold text-charcoal-soft" htmlFor="pl-orientation">{tp("orientation")}</label>
            <select id="pl-orientation" value={orientation} onChange={(e) => setOrientation(e.target.value)} className="field min-h-10 w-auto py-1">
              <option value="all">{tp("filters") === "Filtros" ? "Todas" : "All"}</option>
              {ORIENTATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <label className="small font-semibold text-charcoal-soft" htmlFor="pl-building">{tp("building")}</label>
            <select id="pl-building" value={building} onChange={(e) => setBuilding(e.target.value)} className="field min-h-10 w-auto py-1">
              <option value="all">{tp("filters") === "Filtros" ? "Todos" : "All"}</option>
              {buildings.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div role="group" aria-label={tp("grid")} className="ml-auto flex gap-1">
            <button type="button" className={cn("chip px-3", view === "grid" && "is-active")} aria-pressed={view === "grid"} onClick={() => setView("grid")} aria-label={tp("grid")}><Grid /></button>
            <button type="button" className={cn("chip px-3", view === "list" && "is-active")} aria-pressed={view === "list"} onClick={() => setView("list")} aria-label={tp("list")}><List /></button>
          </div>
        </div>
      </div>
      <p className="small mt-4 text-charcoal-soft" aria-live="polite">{tp("results", { count: results.length })}</p>
      {results.length === 0 ? (
        <p className="body mt-4">{tp("none")}</p>
      ) : (
        <ul className={cn("mt-4 grid gap-4", view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
          {results.map((p, i) => <PlanCard key={p.slug} plan={p} locale={locale} view={view} index={i} />)}
        </ul>
      )}
      <ShortlistBar />
    </div>
  );
}
