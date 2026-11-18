"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { togglePick } from "@/lib/finish-selection";
import { usePicks } from "./usePicks";

export type PaletteChip = { name: string; src?: string; color?: string; group?: string };

/**
 * A finish palette you can browse (client, 18 Nov: "when the mouse is over, open it and make it bigger; these are very
 * small"): filter tabs when there are several groups, chips that lift and grow on hover, and a large preview of the
 * chosen chip with "Add to my selection". Works with touch and keyboard (each chip is a button).
 */
export function FinishPalette({
  chips,
  groups,
  category,
  labels,
  dense = false,
}: {
  chips: PaletteChip[];
  /** group key -> label, in display order; omit for a single group */
  groups?: [string, string][];
  /** what these finishes are, for the selection (e.g. "Cabinetry") */
  category: string;
  labels: { all: string; add: string; added: string; preview: string };
  /** many small chips (the 71-finish palette) */
  dense?: boolean;
}) {
  const [group, setGroup] = useState<string>("all");
  const [active, setActive] = useState(0);
  const picks = usePicks();
  const shown = useMemo(() => chips.filter((c) => group === "all" || c.group === group), [chips, group]);
  const cur = shown[Math.min(active, shown.length - 1)] ?? chips[0];
  const picked = picks.some((p) => p.name === cur.name && p.group === category);
  const bg = (c: PaletteChip) => (c.src ? { backgroundImage: `url(${c.src})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: c.color });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start lg:gap-10">
      <div className="min-w-0">
        {groups && groups.length > 1 && (
          <div role="group" aria-label={category} className="no-scrollbar -mx-5 mb-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
            {[["all", labels.all] as [string, string], ...groups].map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={group === key}
                onClick={() => {
                  setGroup(key);
                  setActive(0);
                }}
                className={cn(
                  "min-h-10 shrink-0 rounded-full px-4 text-[11px] font-semibold tracking-[0.18em] whitespace-nowrap uppercase ring-1 transition-colors",
                  group === key ? "bg-charcoal text-bone ring-charcoal" : "text-charcoal ring-travertine-deep hover:ring-charcoal",
                )}
              >
                {label}
                <span className={cn("ml-2 tabular-nums", group === key ? "text-bone/75" : "text-charcoal-soft")}>{key === "all" ? chips.length : chips.filter((c) => c.group === key).length}</span>
              </button>
            ))}
          </div>
        )}
        <ul className={cn("grid gap-2.5 md:gap-3", dense ? "grid-cols-4 sm:grid-cols-6 lg:grid-cols-7" : "grid-cols-2 sm:grid-cols-4")}>
          {shown.map((c, k) => {
            const on = picks.some((p) => p.name === c.name && p.group === category);
            return (
              <li key={`${c.group}-${c.name}`}>
                <button
                  type="button"
                  onClick={() => setActive(k)}
                  onMouseEnter={() => setActive(k)}
                  onFocus={() => setActive(k)}
                  aria-pressed={cur.name === c.name}
                  className="group block w-full text-left"
                >
                  <span
                    className={cn(
                      "relative block rounded-[10px] ring-1 transition-[transform,box-shadow] duration-300 [transition-timing-function:var(--ease-out)] group-hover:z-10 group-hover:scale-[1.35] group-hover:shadow-[0_18px_40px_-14px_rgb(44_36_22/0.55)] group-focus-visible:scale-[1.2] motion-reduce:group-hover:scale-100",
                      dense ? "aspect-[4/3]" : "aspect-[4/5]",
                      cur.name === c.name ? "ring-2 ring-brass" : "ring-travertine-deep/70",
                    )}
                    style={bg(c)}
                  >
                    {on && (
                      <span className="absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full bg-brass text-basalt shadow">
                        <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
                          <path d="M2.5 6.5 5 9l4.5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </span>
                  <span className={cn("mt-1.5 block leading-tight text-charcoal", dense ? "text-[10.5px]" : "text-[12px]")}>{c.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The large preview of the chip under the pointer (or tapped). */}
      <div className="lg:sticky lg:top-[170px]" aria-live="polite">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-charcoal-soft uppercase">{labels.preview}</p>
        <div className="mt-3 overflow-hidden rounded-[18px] bg-white ring-1 ring-travertine-deep/70">
          <div className="aspect-[4/3] transition-[background] duration-300" style={bg(cur)} role="img" aria-label={cur.name} />
          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="font-[family-name:var(--font-display)] text-[22px] leading-tight text-charcoal">{cur.name}</p>
              <p className="mt-0.5 text-[12px] tracking-[0.12em] text-charcoal-soft uppercase">{category}</p>
            </div>
            <button
              type="button"
              aria-pressed={picked}
              onClick={() => togglePick({ name: cur.name, group: category })}
              className={cn(
                "min-h-11 shrink-0 rounded-full px-4 text-[11px] font-semibold tracking-[0.16em] uppercase ring-1 transition-colors",
                picked ? "bg-brass text-basalt ring-brass" : "text-charcoal ring-charcoal hover:bg-charcoal hover:text-bone",
              )}
            >
              {picked ? `✓ ${labels.added}` : `+ ${labels.add}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
