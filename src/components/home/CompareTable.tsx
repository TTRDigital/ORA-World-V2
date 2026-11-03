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

const ROW_MS = 300;

/**
 * Comparison table with a sticky first column on mobile, a brass check where a published fact applies,
 * "To be confirmed" where unknown, and a differences toggle whose rows collapse and expand over 300ms.
 */
export function CompareTable({ locale, columns, rows }: { locale: Locale; columns: CompareColumn[]; rows: CompareRow[] }) {
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
        <div ref={toggleRef} role="group" aria-label={t("feature")} className="relative flex shrink-0 gap-1 pb-2">
          <button type="button" aria-pressed={!diffOnly} onClick={() => setMode(false)} className={cn("min-h-10 rounded-full px-3 text-[14px] font-semibold transition-colors", !diffOnly ? "text-brass-light" : "text-bone/70 hover:text-bone")}>
            {t("showAll")}
          </button>
          <button type="button" aria-pressed={diffOnly} onClick={() => setMode(true)} className={cn("min-h-10 rounded-full px-3 text-[14px] font-semibold transition-colors", diffOnly ? "text-brass-light" : "text-bone/70 hover:text-bone")}>
            {t("showDiff")}
          </button>
          <span aria-hidden className="absolute bottom-1 h-px bg-brass transition-[left,width] duration-500 [transition-timing-function:var(--ease-out)]" style={{ left: bar.left, width: bar.width }} />
        </div>
        <p className="small shrink-0 text-bone/70" aria-live="polite">
          {t("rows", { count: visibleCount })}
        </p>
      </div>

      <div className="no-scrollbar -mx-4 mt-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        <table ref={tableRef} className="w-full min-w-[640px] table-fixed border-collapse md:min-w-0">
          <caption className="visually-hidden">{columns.map((c) => c.name).join(" / ")}</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-[140px] bg-basalt align-bottom md:w-[22%]">
                <span className="visually-hidden">{t("feature")}</span>
              </th>
              {columns.map((c, i) => (
                <th key={c.slug} scope="col" className="w-[250px] pb-4 pl-3 text-left align-bottom font-normal md:w-[39%] md:pl-6" data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}>
                  <Picture image={c.image} locale={locale} sizes="(max-width: 767px) 64vw, 40vw" ratio="16/10" rounded="lg" />
                  <Link href={c.href} className="display-s group mt-4 inline-flex items-center gap-2 text-bone">
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
                <tr key={row.label} hidden={hidden} aria-hidden={hidden || closing || undefined} className="group/row align-top" data-reveal style={{ "--reveal-delay": `${Math.min(i, 10) * 60 + 200}ms` } as React.CSSProperties}>
                  <th scope="row" className="sticky left-0 z-10 bg-basalt p-0 pr-3 text-left font-semibold">
                    <RowCell closing={closing} className="label text-bone/90 group-hover/row:text-brass-light">
                      {row.label}
                    </RowCell>
                  </th>
                  {row.cells.map((cell, j) => (
                    <td key={j} className="p-0 pl-3 md:pl-6">
                      <RowCell closing={closing}>
                        {cell ? (
                          <span className="flex items-start gap-2">
                            {cell.applies && <DrawnCheck revealed={revealed} delay={i * 70 + j * 120} />}
                            <span className={cn("text-[15px] leading-snug", !cell.applies && "text-bone/70")}>{cell.value}</span>
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

function RowCell({ children, closing, className }: { children: React.ReactNode; closing: boolean; className?: string }) {
  return (
    <div className="grid transition-[grid-template-rows,opacity] duration-300 [transition-timing-function:var(--ease-out)]" style={{ gridTemplateRows: closing ? "0fr" : "1fr", opacity: closing ? 0 : 1 }}>
      <div className="overflow-hidden">
        <div className={cn("border-t border-brass-light/20 py-4", className)}>{children}</div>
      </div>
    </div>
  );
}

function DrawnCheck({ revealed, delay }: { revealed: boolean; delay: number }) {
  return (
    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass-light">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12.5l4.5 4.5L19 7.5" style={{ strokeDasharray: 24, strokeDashoffset: revealed ? 0 : 24, transition: `stroke-dashoffset 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms` }} />
      </svg>
    </span>
  );
}
