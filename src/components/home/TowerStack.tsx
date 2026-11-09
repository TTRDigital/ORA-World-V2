"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export type StackCollection = { slug: string; name: string; bands: number[] };

/**
 * The curved Tesoro Del Mar tower, drawn after the client's renders: a sail-like slab whose floors bulge into
 * arched balcony slabs with cantilevered lips ("terraces that extend like wings"), a two-level podium for the
 * hotel suites and a separate, terraced villa block beside it. Bands 0–7 climb the tower (crown first), 8–9 are
 * the villa terraces, 10–11 the podium. Each collection is one keyboard-reachable button whose bands light
 * together. The floor mapping is illustrative until the client confirms it.
 */
const W = 400;
const CX = 214; // tower axis
const TOP = 34;
const BAND_H = 30;
const GAP = 7;
const WING = 5; // arch of each balcony slab
const LABEL_X = 6;

type Shape = { d: string; lip: string | null; box: { x: number; y: number; w: number; h: number } };

/** A floor band of the tower: arched top and bottom edges, with a balcony lip slightly wider than the floor. */
function towerBand(i: number): Shape {
  const w = 118 + 34 * Math.sin((Math.PI * (i + 1)) / 9); // narrower crown and base, fuller middle
  const shift = 10 * Math.sin((Math.PI * i) / 8); // the sail leans as it rises
  const L = CX - w / 2 + shift;
  const R = L + w;
  const y = TOP + i * (BAND_H + GAP);
  const b = y + BAND_H;
  const d = `M${L.toFixed(1)} ${y} C${(L + w * 0.3).toFixed(1)} ${y - WING} ${(R - w * 0.3).toFixed(1)} ${y - WING} ${R.toFixed(1)} ${y} L${R.toFixed(1)} ${b} C${(R - w * 0.3).toFixed(1)} ${b - WING} ${(L + w * 0.3).toFixed(1)} ${b - WING} ${L.toFixed(1)} ${b} Z`;
  const lip = `M${(L - 9).toFixed(1)} ${b + 2} C${(L + w * 0.3).toFixed(1)} ${b + 2 - WING - 1} ${(R - w * 0.3).toFixed(1)} ${b + 2 - WING - 1} ${(R + 9).toFixed(1)} ${b + 2}`;
  return { d, lip, box: { x: L, y: y - WING, w, h: BAND_H + WING } };
}

const towerBottom = TOP + 8 * (BAND_H + GAP) - GAP;
const PODIUM_Y = towerBottom + 12;
const rect = (x: number, y: number, w: number, h: number, r = 7): Shape => ({
  d: `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`,
  lip: null,
  box: { x, y, w, h },
});

export const SHAPES: Shape[] = [
  ...Array.from({ length: 8 }, (_, i) => towerBand(i)),
  rect(338, PODIUM_Y - 6, 44, 24), // villa upper terrace
  rect(330, PODIUM_Y + 24, 60, 28), // villa lower terrace
  rect(120, PODIUM_Y, 182, 24), // podium upper (hotel)
  rect(108, PODIUM_Y + 30, 198, 24), // podium lower (hotel)
];
const GROUND = PODIUM_Y + 62;
export const VIEWBOX = { w: W, h: GROUND + 14 };

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
      e.currentTarget.ownerSVGElement?.querySelector<SVGGElement>(`[data-slug="${next.slug}"]`)?.focus();
    }
  };

  // Labels: tower and podium collections on the left with a leader line; the villas above their own block,
  // so the label can never run off the bottom of the drawing.
  const labelFor = (c: StackCollection) => {
    const boxes = c.bands.map((b) => SHAPES[b]?.box).filter(Boolean) as Shape["box"][];
    const top = Math.min(...boxes.map((r) => r.y));
    const bottom = Math.max(...boxes.map((r) => r.y + r.h));
    const isVilla = c.bands.every((b) => b === 8 || b === 9);
    if (isVilla) return { x: 360, y: top - 12, anchor: "middle" as const, leader: null };
    const mid = (top + bottom) / 2;
    const leftEdge = Math.min(...boxes.map((r) => r.x));
    const textEnd = LABEL_X + Math.round(c.name.length * 6.4);
    return { x: LABEL_X, y: mid + 4, anchor: "start" as const, leader: { x1: Math.min(textEnd + 6, leftEdge - 14), x2: leftEdge - 6, y: mid } };
  };

  return (
    <svg viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`} role="group" aria-label={ariaLabel} className="h-auto w-full max-w-[540px] select-none">
      <style>{`@keyframes ${glow} { 0%,100% { fill-opacity: .42 } 50% { fill-opacity: .72 } }`}</style>
      {/* Crown: the curved roof cap and mast above the penthouse floors. */}
      <path
        d={`M${CX - 50} ${TOP - 10} C${CX - 20} ${TOP - 22} ${CX + 24} ${TOP - 22} ${CX + 54} ${TOP - 10}`}
        fill="none"
        stroke="var(--color-travertine-deep)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line x1={CX + 4} y1={TOP - 19} x2={CX + 4} y2={TOP - 30} stroke="var(--color-travertine-deep)" strokeWidth="1.2" strokeLinecap="round" />
      {/* Ground and two palms beside the villas, for scale. */}
      <line x1="96" y1={GROUND} x2={W - 4} y2={GROUND} stroke="var(--color-travertine-deep)" strokeWidth="1" />
      {[318, 396].map((x, k) => (
        <g key={x} stroke="var(--color-palm-light)" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity={0.9}>
          <path d={`M${x} ${GROUND} C${x + 1} ${GROUND - 20} ${x - 2} ${GROUND - 34} ${x + (k ? -3 : 3)} ${GROUND - 46}`} />
          <path d={`M${x + (k ? -3 : 3)} ${GROUND - 46} c-9 -2 -15 2 -19 7 M${x + (k ? -3 : 3)} ${GROUND - 46} c8 -4 15 -2 19 3 M${x + (k ? -3 : 3)} ${GROUND - 46} c-3 -7 -9 -10 -15 -10 M${x + (k ? -3 : 3)} ${GROUND - 46} c4 -7 10 -9 16 -8`} />
        </g>
      ))}
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
            className={cn("cursor-pointer outline-none [&:focus-visible_.tw-band]:stroke-[var(--color-brass-ink)] [&:focus-visible_.tw-band]:stroke-[2.5]")}
            style={{ opacity: isMatch ? 1 : 0.35, transition: "opacity 400ms var(--ease-out)" }}
          >
            {c.bands.map((b, j) => {
              const s = SHAPES[b];
              if (!s) return null;
              const order = 11 - b; // lower bands light first
              const delay = revealed ? order * 50 : 0;
              return (
                <g key={b}>
                  <path
                    className="tw-band"
                    d={s.d}
                    fill="var(--color-brass-light)"
                    fillOpacity={revealed ? (isSel ? 0.42 : isMatch ? 0.15 : 0.08) : 0}
                    stroke={isSel ? "var(--color-brass)" : "var(--color-travertine-deep)"}
                    strokeWidth={isSel ? 1.5 : 1}
                    style={{
                      transition: `fill-opacity 600ms var(--ease-out) ${delay}ms, stroke 300ms var(--ease-out)`,
                      animation: isSel && !reduced && revealed ? `${glow} 3.2s ease-in-out ${j * 150}ms infinite` : undefined,
                    }}
                  />
                  {s.lip && (
                    <path
                      d={s.lip}
                      fill="none"
                      stroke={isSel ? "var(--color-brass)" : "var(--color-travertine-deep)"}
                      strokeWidth={isSel ? 1.6 : 1.1}
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray={100}
                      strokeDashoffset={revealed ? 0 : 100}
                      style={{ transition: `stroke-dashoffset 800ms var(--ease-out) ${delay + 150}ms, stroke 300ms` }}
                    />
                  )}
                </g>
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
              fontSize="12.5"
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
