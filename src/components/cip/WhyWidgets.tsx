"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The live panels on the "Why ORA World" cards (client, 17 Nov: "have it together and more like a flashing thing;
 * for taxes show a tax calculator and the money saved"). Each one starts when its card comes on screen; reduced motion
 * shows the finished state at once.
 */

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once the element has been on screen (and stays true). */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** A number that eases to its target whenever the target changes. */
function useTween(target: number, run: boolean, ms = 900) {
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!run) return;
    if (reduced()) {
      const id = requestAnimationFrame(() => setV(target));
      return () => cancelAnimationFrame(id);
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      const val = a + (target - a) * e;
      from.current = val;
      setV(val);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

const panel = "rounded-[20px] bg-basalt/55 p-5 text-bone ring-1 ring-bone/15 backdrop-blur-md md:p-6";

/* ---------------------------------------------------------------- Act 60: the tax calculator */

// Long-term capital gains on the mainland at the top federal bracket: 20% + 3.8% net investment income tax (before
// any state tax). Act 60: 0% for applications filed by 31 Dec 2026 (through 2035), 4% from 1 Jan 2027 (through 2055).
// Labels and caveats per the Act 60 audit brief (18 Nov): illustrative, no "you keep", no guaranteed savings.
const MAINLAND = 0.238;

export function TaxCalculator({ es }: { es: boolean }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const [gain, setGain] = useState(1_000_000);
  const [rate, setRate] = useState<0 | 0.04>(0.04);
  const money = new Intl.NumberFormat(es ? "es-PR" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const mainland = gain * MAINLAND;
  const pr = gain * rate;
  const saved = useTween(mainland - pr, seen);
  const shownMain = useTween(mainland, seen);
  const shownPr = useTween(pr, seen);

  return (
    <div ref={ref} className={panel} data-widget="tax">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-light uppercase">{es ? "Calculadora Ley 60" : "Act 60 calculator"}</p>
        <div role="radiogroup" aria-label={es ? "Tasa de Ley 60" : "Act 60 rate"} className="inline-flex rounded-full bg-bone/10 p-0.5 text-[11px] ring-1 ring-bone/15">
          {([0, 0.04] as const).map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={rate === r}
              onClick={() => setRate(r)}
              className={cn("min-h-8 rounded-full px-2.5 font-semibold transition-colors", rate === r ? "bg-bone text-basalt" : "text-bone/80 hover:text-bone")}
            >
              {r === 0 ? (es ? "0% · solicitudes 2026" : "0% · 2026 applications") : es ? "4% · desde 2027" : "4% · from 2027"}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-5 block">
        <span className="flex items-baseline justify-between text-[13px] text-bone/80">
          {es ? "Ganancias posteriores a la residencia que califiquen" : "Fully qualifying post-residency gains"}
          <b className="font-[family-name:var(--font-display)] text-[22px] font-normal text-bone tabular-nums">{money.format(gain)}</b>
        </span>
        <input
          type="range"
          min={100_000}
          max={10_000_000}
          step={50_000}
          value={gain}
          onChange={(e) => setGain(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--color-brass)]"
          aria-valuetext={money.format(gain)}
        />
      </label>

      <div className="mt-4 grid gap-3 text-[13px]">
        <Bar label={es ? "Impuesto federal ilustrativo en EE. UU. (23.8%)" : "Illustrative mainland federal tax (23.8%)"} value={money.format(shownMain)} pct={seen ? 100 : 0} tone="muted" />
        <Bar label={`${es ? "Impuesto ilustrativo de Puerto Rico, régimen elegido" : "Illustrative Puerto Rico tax under selected regime"} (${rate === 0 ? "0%" : "4%"})`} value={money.format(shownPr)} pct={seen ? (rate / MAINLAND) * 100 : 0} tone="brass" />
      </div>

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-bone/15 pt-4">
        <p className="text-[13px] text-bone/80">{es ? "Diferencia fiscal ilustrativa" : "Illustrative tax difference"}</p>
        <p className="font-[family-name:var(--font-display)] text-[34px] leading-none text-brass-light tabular-nums md:text-[40px]" aria-live="polite">
          {money.format(saved)}
        </p>
      </div>
      <p className="mt-3 text-[10.5px] leading-snug text-bone/60">
        {es
          ? "Comparación ilustrativa entre un posible impuesto federal a largo plazo (tasa máxima 20% + 3.8% NIIT) y el tratamiento preferencial de Puerto Rico para ganancias posteriores a la residencia que califiquen por completo. Son ejemplos, no una estimación de su obligación fiscal ni un ahorro garantizado; el resultado real depende de la residencia fiscal, el origen de los ingresos, la plusvalía previa a la mudanza, las reglas federales y de Puerto Rico y los términos del decreto. Consulte a un asesor fiscal calificado."
          : "An illustrative comparison of possible federal long-term capital gains tax (top 20% rate + 3.8% NIIT) and preferential Puerto Rico income-tax treatment for fully qualifying post-residency gains. These figures are examples, not estimates of your personal tax liability or guaranteed savings. Actual treatment depends on tax residency, sourcing, pre-relocation appreciation, federal and Puerto Rico rules, and decree terms. Consult qualified tax counsel."}
      </p>
    </div>
  );
}

function Bar({ label, value, pct, tone }: { label: string; value: string; pct: number; tone: "muted" | "brass" }) {
  return (
    <div>
      <div className="flex justify-between gap-3">
        <span className="text-bone/80">{label}</span>
        <span className="font-semibold text-bone tabular-nums">{value}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-bone/10">
        <div
          className={cn("h-full rounded-full transition-[width] duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]", tone === "brass" ? "bg-brass-light" : "bg-bone/45")}
          style={{ width: `${Math.max(pct, pct > 0 ? 1.5 : 0)}%` }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Longevity: the health check */

export function HealthCheck({ es, items }: { es: boolean; items: string[] }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className={panel} data-widget="health" data-seen={seen ? "" : undefined}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-light uppercase">{es ? "Chequeo ORA" : "ORA health check"}</p>
        <span className="flex items-center gap-2 text-[11px] text-bone/80">
          <span className="why-pulse size-2 rounded-full bg-brass-light" />
          {es ? "En curso" : "In progress"}
        </span>
      </div>
      {/* A heartbeat line that draws itself across the panel, again and again. */}
      <svg viewBox="0 0 300 60" className="mt-4 h-14 w-full" aria-hidden>
        <path d="M0 32 H70 l8 -6 l8 6 H120 l6 -22 l8 44 l7 -30 l5 8 H190 l8 -5 l8 5 H300" fill="none" stroke="rgb(247 243 236 / 0.15)" strokeWidth="2" />
        <path className="why-ecg" d="M0 32 H70 l8 -6 l8 6 H120 l6 -22 l8 44 l7 -30 l5 8 H190 l8 -5 l8 5 H300" fill="none" stroke="var(--color-brass-light)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" pathLength={100} />
      </svg>
      <ul className="mt-3 grid gap-2.5">
        {items.map((it, i) => (
          <li key={it} className="why-tick flex items-center gap-3 text-[14px]" style={{ "--d": `${300 + i * 450}ms` } as React.CSSProperties}>
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brass-light text-basalt">
              <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden>
                <path d="M2.5 6.5 5 9l4.5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- Travel: the route */

export function TravelRoute({ es, items }: { es: boolean; items: string[] }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const path = useRef<SVGPathElement>(null);
  const plane = useRef<SVGGElement>(null);
  useEffect(() => {
    const p = path.current;
    const g = plane.current;
    if (!seen || !p || !g) return;
    const len = p.getTotalLength();
    const place = (t: number) => {
      const a = p.getPointAtLength(t * len);
      const b = p.getPointAtLength(Math.min(len, t * len + 1));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      g.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle})`);
    };
    if (reduced()) {
      place(0.62);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) % 4200) / 4200;
      place(1 - Math.pow(1 - t, 1.6));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen]);

  return (
    <div ref={ref} className={panel} data-widget="travel">
      <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-light uppercase">{es ? "Su llegada" : "Your arrival"}</p>
      <svg viewBox="0 0 300 120" className="mt-3 h-28 w-full" aria-hidden>
        <path ref={path} d="M24 30 C 110 -6, 210 20, 270 92" fill="none" stroke="rgb(247 243 236 / 0.35)" strokeWidth="1.5" strokeDasharray="3 6" />
        <circle cx="24" cy="30" r="4" fill="var(--color-bone)" />
        <circle cx="270" cy="92" r="5" fill="var(--color-brass-light)" />
        <circle className="why-ping" cx="270" cy="92" r="5" fill="none" stroke="var(--color-brass-light)" strokeWidth="1.5" />
        <text x="24" y="52" fill="rgb(247 243 236 / 0.8)" fontSize="10" textAnchor="start">
          {es ? "EE. UU." : "US mainland"}
        </text>
        <text x="270" y="114" fill="var(--color-brass-light)" fontSize="10" textAnchor="end">
          Dorado, PR
        </text>
        <g ref={plane} transform="translate(24 30)">
          <path d="M8 0 L-6 -5 L-3 0 L-6 5 Z M-1 0 L-5 -10 L-2 -10 L4 0 L-2 10 L-5 10 Z" fill="var(--color-bone)" />
        </g>
      </svg>
      <ul className="mt-2 grid gap-2">
        {items.map((it, i) => (
          <li key={it} className="flex items-center justify-between gap-3 rounded-xl bg-bone/[0.07] px-3.5 py-2.5 text-[14px] ring-1 ring-bone/10">
            {it}
            <span className="flex items-center gap-2 text-[11px] text-bone/75">
              <span className="why-pulse size-2 rounded-full bg-brass-light" style={{ animationDelay: `${i * 400}ms` }} />
              {es ? "Listo" : "Ready"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- Built to endure: the nine features */

export function ResilienceGrid({ es, items }: { es: boolean; items: string[] }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className={panel} data-widget="resilience" data-seen={seen ? "" : undefined}>
      <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-light uppercase">{es ? "Resiliente por diseño" : "Resilient by design"}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-b border-bone/15 pb-4">
        <div>
          <dt className="sr-only">{es ? "Ingeniería para huracanes" : "Hurricane-rated engineering"}</dt>
          <dd className="font-[family-name:var(--font-display)] text-[34px] leading-none text-bone">{es ? "Cat. 5" : "Cat. 5"}</dd>
          <dd aria-hidden className="mt-1.5 text-[11px] tracking-[0.12em] text-bone/70 uppercase">{es ? "Ingeniería para huracanes" : "Hurricane-rated"}</dd>
        </div>
        <div>
          <dt className="sr-only">{es ? "Seguridad en el lugar" : "On-site security"}</dt>
          <dd className="font-[family-name:var(--font-display)] text-[34px] leading-none text-bone">24/7</dd>
          <dd aria-hidden className="mt-1.5 text-[11px] tracking-[0.12em] text-bone/70 uppercase">{es ? "Seguridad en el lugar" : "On-site security"}</dd>
        </div>
      </dl>
      <ul className="mt-4 grid grid-cols-3 gap-2">
        {items.map((it, i) => (
          <li
            key={it}
            className="why-tick why-tile flex min-h-[64px] flex-col justify-between rounded-xl bg-bone/[0.07] p-2.5 text-[11.5px] leading-tight ring-1 ring-bone/10"
            style={{ "--d": `${200 + i * 160}ms`, "--g": `${i * 0.5}s` } as React.CSSProperties}
          >
            <span className="flex items-center justify-between text-[10px] text-bone/60 tabular-nums">
              {String(i + 1).padStart(2, "0")}
              <span className="grid size-4 place-items-center rounded-full bg-brass-light text-basalt">
                <svg viewBox="0 0 12 12" width="8" height="8" aria-hidden>
                  <path d="M2.5 6.5 5 9l4.5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
            <span className="mt-2 text-bone">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- Finishes: the materials, one after another */

export type Material = { name: string; kind: string; src?: string; color?: string };

export function FinishesShowcase({ es, materials, brands }: { es: boolean; materials: Material[]; brands: string[] }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!seen || hold || reduced()) return;
    const id = window.setInterval(() => setI((k) => (k + 1) % materials.length), 2200);
    return () => window.clearInterval(id);
  }, [seen, hold, materials.length]);
  const cur = materials[i];
  const bg = (m: Material) => (m.src ? { backgroundImage: `url(${m.src})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: m.color });
  return (
    <div ref={ref} className={panel} data-widget="finishes" onMouseLeave={() => setHold(false)}>
      <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-light uppercase">{es ? "Sus acabados" : "Your finishes"}</p>
      <div className="mt-4 flex items-center gap-4">
        <div key={cur.name} className="why-swatch size-24 shrink-0 rounded-[14px] ring-2 ring-brass-light/80 md:size-28" style={bg(cur)} role="img" aria-label={cur.name} />
        <div aria-live="polite">
          <p className="text-[11px] tracking-[0.18em] text-bone/65 uppercase">{cur.kind}</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-[26px] leading-tight text-bone">{cur.name}</p>
        </div>
      </div>
      <ul className="mt-5 grid grid-cols-6 gap-1.5">
        {materials.map((m, k) => (
          <li key={m.name}>
            <button
              type="button"
              onMouseEnter={() => {
                setHold(true);
                setI(k);
              }}
              onFocus={() => {
                setHold(true);
                setI(k);
              }}
              onClick={() => setI(k)}
              aria-label={`${m.kind}: ${m.name}`}
              aria-pressed={k === i}
              className={cn("block aspect-square w-full rounded-[8px] ring-1 transition-transform duration-300 hover:scale-110", k === i ? "scale-105 ring-2 ring-brass-light" : "ring-bone/15")}
              style={bg(m)}
            />
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-bone/15 pt-4 text-[11px] leading-relaxed tracking-[0.16em] text-bone/75 uppercase">{brands.join(" · ")}</p>
    </div>
  );
}
