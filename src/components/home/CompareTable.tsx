"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";
import { Picture } from "@/components/ui/Picture";
import { Tbc } from "@/components/ui/Tbc";
import { ArrowUpRight } from "@/components/ui/Icons";

export type CompareColumn = { slug: string; name: string; href: string; image: ImageRef };
export type CompareCell = { value: string; applies: boolean } | null;
export type CompareRow = { label: string; cells: [CompareCell, CompareCell] };
export type ScaleMetric = {
  key: string;
  label: string;
  unit: string;
  values: [number, number];
  notes: [string | null, string | null];
  over: [boolean, boolean];
};

const ROW_MS = 300;

/**
 * Comparison table with a sticky first column on mobile, a brass check where a published fact applies,
 * "To be confirmed" where unknown, and a differences toggle whose rows collapse and expand over 300ms.
 */
export function CompareTable({
  locale,
  columns,
  rows,
}: {
  locale: Locale;
  columns: CompareColumn[];
  rows: CompareRow[];
}) {
  const t = useTranslations("compare");
  const [diffOnly, setDiffOnly] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ left: 0, width: 0 });
  const timers = useRef<number[]>([]);

  const isDiff = (r: CompareRow) => (r.cells[0]?.value ?? null) !== (r.cells[1]?.value ?? null);
  const visibleCount = rows.filter((r, i) => !removed.has(i) && !collapsed.has(i)).length;

  const setMode = (diff: boolean) => {
    if (diff === diffOnly) return;
    setDiffOnly(diff);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const hide = new Set<number>();
    rows.forEach((r, i) => {
      if (diff && !isDiff(r)) hide.add(i);
    });
    const reduced = document.documentElement.classList.contains("reduced-motion");
    if (reduced) {
      setCollapsed(hide);
      setRemoved(hide);
      return;
    }
    if (diff) {
      setCollapsed(hide);
      timers.current.push(window.setTimeout(() => setRemoved(hide), ROW_MS));
    } else {
      setRemoved(new Set());
      timers.current.push(window.setTimeout(() => setCollapsed(new Set()), 20));
    }
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /* Draw the check strokes once the table enters the viewport. */
  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;
    if (document.documentElement.classList.contains("reduced-motion")) {
      const id = window.setTimeout(() => setRevealed(true), 0);
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    const safety = window.setTimeout(() => setRevealed(true), 2500);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, []);

  /* Brass hairline slides under the active toggle. */
  useLayoutEffect(() => {
    const wrap = toggleRef.current;
    if (!wrap) return;
    const measure = () => {
      const active = wrap.querySelector<HTMLElement>("[aria-pressed=true]");
      if (active) setBar({ left: active.offsetLeft, width: active.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [diffOnly]);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" data-reveal>
        <div
          ref={toggleRef}
          role="group"
          aria-label={t("feature")}
          className="relative flex shrink-0 gap-1 pb-2"
        >
          <button
            type="button"
            aria-pressed={!diffOnly}
            onClick={() => setMode(false)}
            className={cn(
              "min-h-10 rounded-full px-3 text-[14px] font-semibold transition-colors",
              !diffOnly ? "text-brass-light" : "text-bone/70 hover:text-bone",
            )}
          >
            {t("showAll")}
          </button>
          <button
            type="button"
            aria-pressed={diffOnly}
            onClick={() => setMode(true)}
            className={cn(
              "min-h-10 rounded-full px-3 text-[14px] font-semibold transition-colors",
              diffOnly ? "text-brass-light" : "text-bone/70 hover:text-bone",
            )}
          >
            {t("showDiff")}
          </button>
          <span
            aria-hidden
            className="absolute bottom-1 h-px bg-brass transition-[left,width] duration-500 [transition-timing-function:var(--ease-out)]"
            style={{ left: bar.left, width: bar.width }}
          />
        </div>
        <p className="small shrink-0 text-bone/70" aria-live="polite">
          {t("rows", { count: visibleCount })}
        </p>
      </div>

      <div className="no-scrollbar -mx-4 mt-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        <table ref={tableRef} className="w-full min-w-[540px] table-fixed border-collapse md:min-w-0">
          <caption className="visually-hidden">{columns.map((c) => c.name).join(" / ")}</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-[100px] bg-basalt align-bottom md:w-[22%]">
                <span className="visually-hidden">{t("feature")}</span>
              </th>
              {columns.map((c, i) => (
                <th
                  key={c.slug}
                  scope="col"
                  className="w-[220px] pb-4 pl-3 text-left align-bottom font-normal md:w-[39%] md:pl-6"
                  data-reveal
                  style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
                >
                  <Picture
                    image={c.image}
                    locale={locale}
                    sizes="(max-width: 767px) 220px, 40vw"
                    ratio="16/10"
                    rounded="lg"
                  />
                  <Link
                    href={c.href}
                    className="display-s group mt-4 inline-flex items-center gap-2 text-bone"
                  >
                    {c.name}
                    <ArrowUpRight className="text-brass-light transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const hidden = removed.has(i);
              const closing = collapsed.has(i);
              return (
                <tr
                  key={row.label}
                  hidden={hidden}
                  aria-hidden={hidden || closing || undefined}
                  className="group/row align-top"
                  data-reveal
                  style={{ "--reveal-delay": `${Math.min(i, 10) * 60 + 200}ms` } as React.CSSProperties}
                >
                  <th scope="row" className="sticky left-0 z-10 bg-basalt p-0 pr-3 text-left font-semibold">
                    <RowCell
                      closing={closing}
                      className="label pr-1 text-bone/90 group-hover/row:text-brass-light"
                    >
                      {row.label}
                    </RowCell>
                  </th>
                  {row.cells.map((cell, j) => (
                    <td key={j} className="p-0 pl-3 md:pl-6">
                      <RowCell closing={closing}>
                        {cell ? (
                          <span className="flex items-start gap-2">
                            {cell.applies && <DrawnCheck revealed={revealed} delay={i * 70 + j * 120} />}
                            <span className={cn("text-[15px] leading-snug", !cell.applies && "text-bone/70")}>
                              {cell.value}
                            </span>
                          </span>
                        ) : (
                          <Tbc className="text-[15px] text-brass-light/70" />
                        )}
                      </RowCell>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowCell({
  children,
  closing,
  className,
}: {
  children: React.ReactNode;
  closing: boolean;
  className?: string;
}) {
  return (
    <div
      className="grid transition-[grid-template-rows,opacity] duration-300 [transition-timing-function:var(--ease-out)]"
      style={{ gridTemplateRows: closing ? "0fr" : "1fr", opacity: closing ? 0 : 1 }}
    >
      <div className="overflow-hidden">
        <div className={cn("border-t border-brass-light/20 py-4", className)}>{children}</div>
      </div>
    </div>
  );
}

function DrawnCheck({ revealed, delay }: { revealed: boolean; delay: number }) {
  return (
    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass-light">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          style={{
            strokeDasharray: 24,
            strokeDashoffset: revealed ? 0 : 24,
            transition: `stroke-dashoffset 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          }}
        />
      </svg>
    </span>
  );
}

/**
 * Scale at a glance: pick a metric and two bars show the published figures side by side, proportional to the
 * larger one. Only published numbers; unpublished parts are named under the bar.
 */
export function CompareScale({
  locale,
  names,
  metrics,
}: {
  locale: Locale;
  names: [string, string];
  metrics: ScaleMetric[];
}) {
  const t = useTranslations("compare");
  const [k, setK] = useState(0);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const m = metrics[k];
  const max = Math.max(...m.values);
  const fmt = (n: number) => n.toLocaleString(locale === "es" ? "es-PR" : "en-US");
  const ratio = m.values[1] / m.values[0];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.classList.contains("reduced-motion")) {
      const id = window.setTimeout(() => setShown(true), 0);
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(
      (e) => e.some((x) => x.isIntersecting) && (setShown(true), io.disconnect()),
      { threshold: 0.3 },
    );
    io.observe(el);
    const safety = window.setTimeout(() => setShown(true), 2500);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const n =
      (i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : metrics.length - 1)) % metrics.length;
    setK(n);
    (e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus();
  };

  return (
    <div
      ref={ref}
      className="mb-10 rounded-[24px] bg-basalt-soft p-5 ring-1 ring-brass-light/15 md:mb-12 md:p-7"
      data-reveal
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="label">{t("scaleTitle")}</p>
        <div
          role="radiogroup"
          aria-label={t("scaleTitle")}
          className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1"
        >
          {metrics.map((x, i) => (
            <button
              key={x.key}
              type="button"
              role="radio"
              aria-checked={i === k}
              tabIndex={i === k ? 0 : -1}
              onClick={() => setK(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn("chip shrink-0", i === k && "is-active")}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-6 grid gap-5">
        {m.values.map((v, i) => (
          <li key={names[i]}>
            <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
              <span className="text-[14px] font-semibold text-bone">{names[i]}</span>
              <span key={`${m.key}-${i}`} className="fade-in flex items-baseline gap-1.5">
                {m.over[i] && <span className="text-[13px] font-medium text-bone/70">{t("over")}</span>}
                <span className="numeral tabular text-[26px] text-brass-light md:text-[32px]">{fmt(v)}</span>
                <span className="text-[13px] font-medium text-bone/70">{m.unit}</span>
              </span>
            </div>
            <div aria-hidden className="mt-2 h-3 overflow-hidden rounded-full bg-basalt">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-1000 [transition-timing-function:var(--ease-out)]",
                  i === 0 ? "bg-brass-light" : "bg-brass",
                )}
                style={{ width: shown ? `${Math.max(1.5, (v / max) * 100)}%` : "0%" }}
              />
            </div>
            {m.notes[i] && <p className="mt-1.5 text-[12px] text-bone/70">{m.notes[i]}</p>}
          </li>
        ))}
      </ul>
      {/* A ratio only where both figures are exact; partial or lower-bound figures would overstate it. */}
      <p className="small mt-5 min-h-[1.5em] text-bone/80" aria-live="polite">
        {!m.notes.some(Boolean) && !m.over.some(Boolean)
          ? t("ratio", {
              name: names[1],
              ratio: ratio >= 10 ? Math.round(ratio).toString() : ratio.toFixed(1),
              metric: m.label.toLowerCase(),
              other: names[0],
            })
          : t("ratioPartial")}
      </p>
    </div>
  );
}
