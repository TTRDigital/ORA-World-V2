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
/** Traced from approximate coastline coordinates (equirectangular, lon −67.32…−65.20, lat 18.62…17.78). */
export const ISLAND_PATH =
  "M75.5 57.0 C81.0 53.3 97.5 52.5 108.5 52.1 C119.5 51.7 128.1 52.5 141.5 54.6 C154.9 56.6 173.0 62.4 188.7 64.5 C204.4 66.5 220.1 66.1 235.8 67.0 C251.6 67.8 267.3 69.9 283.0 69.4 C298.7 69.0 316.8 65.3 330.2 64.5 C343.6 63.7 351.4 64.1 363.2 64.5 C375.0 64.9 388.4 67.0 400.9 67.0 C413.5 67.0 426.1 64.1 438.7 64.5 C451.3 64.9 467.0 68.2 476.4 69.4 C485.9 70.7 487.4 70.7 495.3 71.9 C503.1 73.2 514.2 76.5 523.6 76.9 C533.0 77.3 543.2 74.8 551.9 74.4 C560.5 74.0 566.8 73.2 575.5 74.4 C584.1 75.6 592.8 80.2 603.8 81.8 C614.8 83.5 628.9 83.5 641.5 84.3 C654.1 85.1 666.7 84.3 679.2 86.8 C691.8 89.3 705.2 94.7 717.0 99.2 C728.8 103.7 739.0 109.9 750.0 114.1 C761.0 118.2 774.4 119.9 783.0 124.0 C791.7 128.1 799.5 133.1 801.9 138.9 C804.2 144.7 796.4 151.3 797.2 158.7 C798.0 166.2 809.0 176.9 806.6 183.5 C804.2 190.1 790.1 193.4 783.0 198.4 C775.9 203.4 770.4 206.7 764.2 213.3 C757.9 219.9 751.6 229.0 745.3 238.1 C739.0 247.2 732.7 258.7 726.4 267.8 C720.1 276.9 715.4 285.2 707.5 292.6 C699.7 300.1 689.5 307.9 679.2 312.5 C669.0 317.0 657.2 318.3 646.2 319.9 C635.2 321.6 625.8 320.3 613.2 322.4 C600.6 324.5 584.9 329.8 570.8 332.3 C556.6 334.8 543.2 336.9 528.3 337.3 C513.4 337.7 495.3 336.0 481.1 334.8 C467.0 333.6 456.8 331.9 443.4 329.8 C430.0 327.8 415.1 324.5 400.9 322.4 C386.8 320.3 370.3 318.3 358.5 317.4 C346.7 316.6 341.2 317.4 330.2 317.4 C319.2 317.4 305.8 318.3 292.5 317.4 C279.1 316.6 264.2 310.4 250.0 312.5 C235.8 314.5 220.9 326.5 207.5 329.8 C194.2 333.1 183.2 332.7 169.8 332.3 C156.4 331.9 139.9 326.9 127.4 327.4 C114.8 327.8 105.3 332.3 94.3 334.8 C83.3 337.3 67.6 345.1 61.3 342.2 C55.0 339.3 55.8 325.7 56.6 317.4 C57.4 309.2 63.7 302.6 66.0 292.6 C68.4 282.7 70.0 269.5 70.8 257.9 C71.5 246.3 71.5 233.9 70.8 223.2 C70.0 212.5 71.5 204.2 66.0 193.4 C60.5 182.7 44.8 169.5 37.7 158.7 C30.7 148.0 22.0 137.2 23.6 129.0 C25.2 120.7 40.1 114.9 47.2 109.1 C54.2 103.3 61.3 100.0 66.0 94.2 C70.8 88.5 73.9 80.6 75.5 74.4 C77.0 68.2 70.0 60.8 75.5 57.0 Z";

const VIEQUES = "M820.8 248.0 L858.5 233.1 L905.7 228.2 L952.8 240.6 L962.3 253.0 L924.5 262.9 L872.6 262.9 L830.2 257.9 Z";
const CULEBRA = "M934.0 143.8 L962.3 141.4 L981.1 153.8 L967.0 163.7 L943.4 161.2 Z";

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
        <path d={VIEQUES} fill="#E3D9C8" stroke="#A8864F" strokeWidth="1.5" />
        <path d={CULEBRA} fill="#E3D9C8" stroke="#A8864F" strokeWidth="1.5" />
        {/* Sea labels and compass */}
        <text x="420" y="30" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600" fill="#2C6A82" letterSpacing="0.5">
          {t("atlantic")}
        </text>
        <text x="380" y="380" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600" fill="#2C6A82" letterSpacing="0.5">
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
