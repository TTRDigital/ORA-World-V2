"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export type StackCollection = { slug: string; name: string; bands: number[] };

/**
 * Stylised tower stack of the curved Tesoro Del Mar tower: 12 bands drawn in travertine-deep hairlines on
 * bone. Bands 0–7 climb the tower, 8–9 are the low villa block beside it, 10–11 the podium. Each
 * collection is one keyboard-reachable button whose bands light together. The floor mapping is illustrative.
 */
const TOWER_X = 138;
const TOWER_W = 150;
const BAND_H = 32;
const BAND_GAP = 6;
const TOWER_TOP = 30;
const LABEL_X = 14;

function towerBand(i: number) {
  // Gentle curve: narrower at the crown, widening toward the podium.
  const inset = Math.round(12 * (1 - i / 7) ** 1.4);
  return { x: TOWER_X + inset, y: TOWER_TOP + i * (BAND_H + BAND_GAP), w: TOWER_W - inset * 2, h: BAND_H };
}
const podiumY = TOWER_TOP + 8 * (BAND_H + BAND_GAP) + 8;
export const BANDS: { x: number; y: number; w: number; h: number }[] = [
  ...Array.from({ length: 8 }, (_, i) => towerBand(i)),
  { x: 304, y: podiumY - 4, w: 58, h: 26 },
  { x: 304, y: podiumY + 28, w: 58, h: 26 },
  { x: 130, y: podiumY, w: 168, h: 24 },
  { x: 118, y: podiumY + 30, w: 180, h: 24 },
];
export const VIEWBOX = { w: 376, h: podiumY + 96 };

export function TowerStack({
  collections,
  selected,
  matching,
  revealed,
  reduced,
  onSelect,
  onHover,
  bandLabel,
  ariaLabel,
}: {
  collections: StackCollection[];
  selected: string;
  matching: Set<string>;
  revealed: boolean;
  reduced: boolean;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
  bandLabel: (name: string) => string;
  ariaLabel: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const glow = `ora2-band-glow-${uid}`;

  const onKey = (e: React.KeyboardEvent<SVGGElement>, c: StackCollection) => {
    const idx = collections.findIndex((x) => x.slug === c.slug);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(c.slug);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = collections[(idx + (e.key === "ArrowUp" ? collections.length - 1 : 1)) % collections.length];
      onSelect(next.slug);
      const svg = e.currentTarget.ownerSVGElement;
      svg?.querySelector<SVGGElement>(`[data-slug="${next.slug}"]`)?.focus();
    }
  };

  // Label anchors: tower collections on the left with a leader line, villas beneath their block.
  const labelFor = (c: StackCollection) => {
    const rects = c.bands.map((b) => BANDS[b]).filter(Boolean);
    const top = Math.min(...rects.map((r) => r.y));
    const bottom = Math.max(...rects.map((r) => r.y + r.h));
    const mid = (top + bottom) / 2;
    const isVilla = c.bands.every((b) => b === 8 || b === 9);
    if (isVilla) return { x: 333, y: bottom + 20, anchor: "middle" as const, leader: null };
    const leftEdge = Math.min(...rects.map((r) => r.x));
    const textEnd = LABEL_X + Math.round(c.name.length * 6.3);
    return { x: LABEL_X, y: mid + 4, anchor: "start" as const, leader: { x1: Math.min(textEnd + 6, leftEdge - 10), x2: leftEdge - 4, y: mid } };
  };

  return (
    <svg viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`} role="group" aria-label={ariaLabel} className="h-auto w-full max-w-[520px] select-none">
      <style>{`@keyframes ${glow} { 0%,100% { fill-opacity: .42 } 50% { fill-opacity: .72 } }`}</style>
      <line x1="80" y1={podiumY + 62} x2={VIEWBOX.w - 8} y2={podiumY + 62} stroke="var(--color-travertine-deep)" strokeWidth="1" />
      {collections.map((c) => {
        const isSel = c.slug === selected;
        const isMatch = matching.has(c.slug);
        const label = labelFor(c);
        return (
          <g
            key={c.slug}
            data-slug={c.slug}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={bandLabel(c.name)}
            aria-disabled={!isMatch || undefined}
            onClick={() => onSelect(c.slug)}
            onKeyDown={(e) => onKey(e, c)}
            onPointerEnter={() => onHover(c.slug)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(c.slug)}
            onBlur={() => onHover(null)}
            className={cn("cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--color-brass-ink)] [&:focus-visible>rect]:stroke-[2.5]")}
            style={{ opacity: isMatch ? 1 : 0.35, transition: "opacity 400ms var(--ease-out)" }}
          >
            {c.bands.map((b, j) => {
              const r = BANDS[b];
              if (!r) return null;
              const order = 11 - b; // lower bands light first
              return (
                <rect
                  key={b}
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  rx={6}
                  fill="var(--color-brass-light)"
                  fillOpacity={revealed ? (isSel ? 0.42 : isMatch ? 0.15 : 0.08) : 0}
                  stroke={isSel ? "var(--color-brass)" : "var(--color-travertine-deep)"}
                  strokeWidth={isSel ? 1.5 : 1}
                  style={{
                    transition: `fill-opacity 600ms var(--ease-out) ${revealed ? order * 50 : 0}ms, stroke 300ms var(--ease-out)`,
                    animation: isSel && !reduced && revealed ? `${glow} 3.2s ease-in-out ${j * 150}ms infinite` : undefined,
                  }}
                />
              );
            })}
            {label.leader && (
              <line
                x1={label.leader.x1}
                x2={label.leader.x2}
                y1={label.leader.y}
                y2={label.leader.y}
                stroke={isSel ? "var(--color-brass)" : "var(--color-travertine-deep)"}
                strokeWidth="1"
                style={{ transformOrigin: `${label.leader.x2}px ${label.leader.y}px`, transform: revealed ? "scaleX(1)" : "scaleX(0)", transition: "transform 700ms var(--ease-out) 500ms, stroke 300ms" }}
              />
            )}
            <text
              x={label.x}
              y={label.y}
              textAnchor={label.anchor}
              fontSize="12"
              fontWeight={isSel ? 600 : 500}
              fill={isSel ? "var(--color-brass-ink)" : "var(--color-charcoal-soft)"}
              style={{ fontFamily: "var(--font-sans)", opacity: revealed ? 1 : 0, transition: "opacity 500ms var(--ease-out) 700ms, fill 300ms" }}
            >
              {c.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
