"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Collection, Locale } from "@/content/types";
import { t, tp } from "@/lib/localize";
import { Picture } from "@/components/ui/Picture";
import { Tbc } from "@/components/ui/Tbc";
import { Check, ArrowRight } from "@/components/ui/Icons";
import { TowerStack } from "./TowerStack";

const BEDROOMS = ["any", "1", "2", "3", "4+"] as const;
const VIEWS = ["ocean", "garden", "mountain"] as const;
type View = (typeof VIEWS)[number];

export function ExplorerStage({ locale, collections, note }: { locale: Locale; collections: Collection[]; note: string }) {
  const tx = useTranslations("explorer");
  const tc = useTranslations("common");
  const [selected, setSelected] = useState(collections[0]?.slug ?? "");
  const [hovered, setHovered] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<(typeof BEDROOMS)[number]>("any");
  const [view, setView] = useState<View | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Reveal: bands light up from the ground upward once the stage is in view (2.5 s safety net).
  useEffect(() => {
    const el = stageRef.current;
    const isReduced = document.documentElement.classList.contains("reduced-motion");
    const timer = window.setTimeout(() => {
      setReduced(isReduced);
      setRevealed(true);
    }, isReduced ? 0 : 2500);
    if (!el || isReduced) return () => clearTimeout(timer);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const matching = useMemo(() => {
    const set = new Set<string>();
    for (const c of collections) {
      const bedOk = bedrooms === "any" || c.bedroomOptions.some((n) => (bedrooms === "4+" ? n >= 4 : n === Number(bedrooms)));
      const viewOk = !view || c.views.includes(view);
      if (bedOk && viewOk) set.add(c.slug);
    }
    return set;
  }, [collections, bedrooms, view]);

  // Keep the selection inside the matching set.
  const effectiveSelected = matching.has(selected) ? selected : (collections.find((c) => matching.has(c.slug))?.slug ?? selected);
  const activeSlug = hovered && matching.has(hovered) ? hovered : effectiveSelected;
  const active = collections.find((c) => c.slug === activeSlug) ?? collections[0];
  const none = matching.size === 0;

  const stack = collections.map((c) => ({ slug: c.slug, name: t(c.name, locale), bands: c.bands }));

  return (
    <div ref={stageRef} className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      {/* Filters */}
      <div className="flex flex-col gap-3 lg:col-span-12 lg:flex-row lg:items-center lg:gap-8">
        <div role="group" aria-label={tx("bedrooms")} className="flex items-center gap-2">
          <span className="label mr-1 shrink-0">{tx("bedrooms")}</span>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {BEDROOMS.map((b) => (
              <button key={b} type="button" className="chip shrink-0" aria-pressed={bedrooms === b} onClick={() => setBedrooms(b)}>
                {b === "any" ? tx("anyBedrooms") : b}
              </button>
            ))}
          </div>
        </div>
        <div role="group" aria-label={tx("view")} className="flex items-center gap-2">
          <span className="label mr-1 shrink-0">{tx("view")}</span>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {VIEWS.map((v) => (
              <button key={v} type="button" className="chip shrink-0" aria-pressed={view === v} onClick={() => setView(view === v ? null : v)}>
                {tx(v)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tower stack */}
      <div className="min-w-0 lg:col-span-5">
        <div className="flex justify-center lg:justify-start">
          <TowerStack
            collections={stack}
            selected={effectiveSelected}
            matching={matching}
            revealed={revealed}
            reduced={reduced}
            onSelect={setSelected}
            onHover={setHovered}
            bandLabel={(name) => tx("band", { name })}
            ariaLabel={tx("towerLabel")}
          />
        </div>
        {/* Phones: the drawn bands are small, so the collections are also a row of chips. */}
        <div role="group" aria-label={tx("collections")} className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
          {stack.map((c) => (
            <button
              key={c.slug}
              type="button"
              className="chip shrink-0"
              aria-pressed={effectiveSelected === c.slug}
              disabled={!matching.has(c.slug)}
              onClick={() => setSelected(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <p className="small mt-2 max-w-md italic text-charcoal-soft">{note}</p>
        <p className="visually-hidden" aria-live="polite">
          {active ? t(active.name, locale) : ""}
        </p>
      </div>

      {/* Side card: right on desktop, a sheet-like card below the stack on mobile */}
      <div className="min-w-0 lg:col-span-7">
        <div className="card relative overflow-hidden rounded-t-[28px] rounded-b-[20px] bg-bone shadow-[0_-12px_40px_-24px_rgb(28_27_25/0.25)] lg:rounded-[24px] lg:shadow-none">
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-travertine-deep lg:hidden" aria-hidden />
          {none || !active ? (
            <p className="body p-6 md:p-8">{tx("noMatch")}</p>
          ) : (
            <div key={active.slug} className="fade-in grid gap-0 md:grid-cols-2">
              <div className="p-3 md:p-4">
                <Picture image={active.image} locale={locale} ratio="16/10" sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 400px" reveal={false} rounded="sm" className="ambient-zoom" />
              </div>
              <div className="flex flex-col p-5 pt-2 md:p-6 md:pt-6">
                <p className="label">{tx("collections")}</p>
                <h3 className="display-s mt-1">
                  <Link href={`/residences/${active.slug}`} className="hairline is-active transition-colors hover:text-brass-ink">
                    {t(active.name, locale)}
                  </Link>
                </h3>
                <p className="small mt-1 text-charcoal-soft">{t(active.tagline, locale)}</p>

                <p className="label mt-5">{tx("features")}</p>
                <ul className="mt-2 space-y-2">
                  {active.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="fade-in flex items-start gap-3 text-[15px]" style={{ animationDelay: `${150 + i * 120}ms`, animationFillMode: "both" }}>
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brass text-basalt">
                        <Check width={12} height={12} strokeWidth={2.5} />
                      </span>
                      <span>{t(f, locale)}</span>
                    </li>
                  ))}
                </ul>

                <p className="label mt-5">{tx("specs")}</p>
                <dl className="mt-2 grid grid-cols-3 gap-3 text-[14px] tabular">
                  {active.specs.map((s, i) => (
                    <div key={i} className="rounded-xl bg-bone-deep px-3 py-2">
                      <dt className="text-[12px] text-charcoal-soft">{t(s.label, locale)}</dt>
                      <dd className="mt-0.5 font-semibold">{s.value ? t(s.value, locale) : <Tbc className="font-medium text-charcoal-soft" />}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link href="/residences/plans" className="pill pill-basalt" data-track="explorer_view_plans">
                    {tc("viewPlans")} <ArrowRight width={16} height={16} />
                  </Link>
                  <Link href={`/residences/${active.slug}`} className="pill pill-ghost">
                    {tc("explore")}
                  </Link>
                </div>
                <p className="visually-hidden">{tp(active.description, locale).join(" ")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
