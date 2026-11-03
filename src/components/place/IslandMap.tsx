"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type MapPin = { slug: string; name: string; x: number; y: number; municipality: string };

/**
 * Stylised SVG island of Puerto Rico (viewBox 0 0 1000 420) on a sea-tinted panel. Pins are real buttons laid
 * over the SVG (percent positions from the seed) so focus, labels and hit areas are reliable; clustered pins
 * (Dorado, Loíza) fan out so none overlap. The outline draws itself the first time it enters view and pins
 * drop in with a stagger.
 */
export const ISLAND_PATH =
  "M110 60 C220 36 360 28 500 30 C640 30 780 36 880 70 C925 85 948 125 946 170 C944 210 935 245 898 268 C850 295 760 330 650 372 C540 385 420 384 300 374 C200 366 120 376 65 368 C42 330 48 250 62 170 C70 120 85 85 110 60 Z";

const FAN: Record<number, [number, number]> = { 0: [0, 0], 1: [-18, 12], 2: [18, 12], 3: [0, 24] };

export function IslandMap({
  pins,
  selected,
  hovered,
  onSelect,
  onHover,
  className,
}: {
  pins: MapPin[];
  selected: string | null;
  hovered: string | null;
  onSelect: (slug: string | null) => void;
  onHover: (slug: string | null) => void;
  className?: string;
}) {
  const t = useTranslations("portfolio");
  // Municipality clusters: index within the cluster decides the fan-out offset.
  const clusterIndex = new Map<string, number>();
  const counters = new Map<string, number>();
  for (const p of pins) {
    const i = counters.get(p.municipality) ?? 0;
    clusterIndex.set(p.slug, i);
    counters.set(p.municipality, i + 1);
  }
  const municipalities = Array.from(
    pins.reduce((m, p) => {
      const cur = m.get(p.municipality);
      if (!cur) m.set(p.municipality, { x: p.x, y: p.y, n: 1 });
      else m.set(p.municipality, { x: cur.x + p.x, y: cur.y + p.y, n: cur.n + 1 });
      return m;
    }, new Map<string, { x: number; y: number; n: number }>()),
  ).map(([name, v]) => ({ name, x: v.x / v.n, y: v.y / v.n, n: v.n }));

  return (
    <div className={cn("relative min-w-0 max-w-full overflow-hidden rounded-[20px] md:overflow-visible md:rounded-[24px]", className)} data-testid="island-map">
      {/* On phones the island is a 760px-wide drag rail; the fade hints there is more to the right */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 rounded-r-[20px] bg-gradient-to-l from-[#dbe7ea] to-transparent md:hidden" />
    <div className="no-scrollbar overflow-x-auto overscroll-x-contain rounded-[20px] bg-[#dbe7ea] md:overflow-visible md:rounded-[24px]">
    <div className="group relative min-w-[760px] md:min-w-0" data-reveal>
      <svg viewBox="0 0 1000 420" className="block h-auto w-full" role="img" aria-label={t("map")}>
        <defs>
          <pattern id="sea-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="#3F7F98" opacity="0.22" />
          </pattern>
          <filter id="island-shadow" x="-5%" y="-5%" width="110%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#2C6A82" floodOpacity="0.18" />
          </filter>
        </defs>
        <rect width="1000" height="420" fill="url(#sea-dots)" />
        {/* The island: travertine, with an outline that draws itself on reveal */}
        <path d={ISLAND_PATH} fill="#E3D9C8" filter="url(#island-shadow)" />
        <path
          d={ISLAND_PATH}
          fill="none"
          stroke="#A8864F"
          strokeWidth="2"
          pathLength={1000}
          strokeDasharray={1000}
          className="[stroke-dashoffset:1000] transition-[stroke-dashoffset] duration-[2200ms] [transition-timing-function:var(--ease-out)] group-[.is-revealed]:[stroke-dashoffset:0]"
        />
        {/* Vieques and Culebra */}
        <ellipse cx="972" cy="300" rx="22" ry="8" fill="#E3D9C8" stroke="#A8864F" strokeWidth="1.5" />
        <ellipse cx="962" cy="122" rx="10" ry="7" fill="#E3D9C8" stroke="#A8864F" strokeWidth="1.5" />
        {/* Sea labels and compass */}
        <text x="500" y="26" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600" fill="#2C6A82" letterSpacing="0.5">
          {t("atlantic")}
        </text>
        <text x="420" y="410" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600" fill="#2C6A82" letterSpacing="0.5">
          {t("caribbean")}
        </text>
        <g transform="translate(40 40)" fill="#2C6A82" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600">
          <circle r="16" fill="none" stroke="#2C6A82" strokeWidth="1" opacity="0.5" />
          <path d="M0 -13 L4 2 L0 -1 L-4 2 Z" />
          <text y="-20" textAnchor="middle">
            {t("north")}
          </text>
        </g>
        {/* Municipality names, always visible */}
        {municipalities.map((m) => (
          <text
            key={m.name}
            x={m.x * 10}
            y={m.y * 4.2 + (m.n > 1 ? 44 : 30)}
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontSize="15"
            fontWeight="600"
            fill="#684D25"
          >
            {m.name}
          </text>
        ))}
      </svg>
      {/* Pins: real buttons over the SVG */}
      <ul className="absolute inset-0 m-0 list-none p-0" aria-label={t("pinsLabel")}>
        {pins.map((p, i) => {
          const [ox, oy] = FAN[clusterIndex.get(p.slug) ?? 0] ?? [0, 0];
          const active = selected === p.slug;
          const hot = hovered === p.slug;
          return (
            <li key={p.slug} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <button
                type="button"
                aria-pressed={active}
                aria-label={t("select", { name: p.name })}
                onClick={() => onSelect(active ? null : p.slug)}
                onMouseEnter={() => onHover(p.slug)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(p.slug)}
                onBlur={() => onHover(null)}
                className="group/pin absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-out)] group-[.is-revealed]:opacity-100"
                style={{
                  transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px - 12px))`,
                  ["--pin-x" as string]: `${ox}px`,
                  ["--pin-y" as string]: `${oy}px`,
                  transitionDelay: `${120 + i * 70}ms`,
                }}
                data-pin={p.slug}
              >
                <span className={cn("relative flex size-7 items-center justify-center rounded-full", (active || hot) && "pulse")}>
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full border transition-[transform,border-color] duration-300",
                      active ? "scale-110 border-brass-ink" : hot ? "scale-105 border-brass" : "border-brass/60",
                    )}
                  />
                  <span className={cn("relative size-2.5 rounded-full transition-colors", active ? "bg-brass-ink" : "bg-brass")} />
                </span>
                <span
                  className={cn(
                    "pointer-events-none absolute top-1/2 left-full ml-1 -translate-y-1/2 rounded-full bg-bone px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-charcoal shadow-[0_8px_20px_-10px_rgb(28_27_25/0.35)] transition-opacity duration-300",
                    active || hot ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                >
                  {p.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <style>{`.group.is-revealed [data-pin]{transform:translate(calc(-50% + var(--pin-x)),calc(-50% + var(--pin-y))) !important}`}</style>
    </div>
    </div>
    </div>
  );
}
