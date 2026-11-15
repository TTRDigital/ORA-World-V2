"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  locale: "en" | "es";
  todayLabel: string; // "today, on capital gains and dividends"
  janLabel: string; // "the rate from January 1"
  decreeLabel: string; // "years: the decree and its extension"
};

/**
 * The tax figures as something to play with (client, 15 Nov: "make these numbers interactive, not just plain").
 * 1. The rate: a switch between applications filed by Dec 31, 2026 (0%) and from Jan 1, 2027 (4%), per Act 38-2026; the figure counts between 0% and 4% and a ten-mark meter (one mark
 *    per percentage point) lights up to match. Once the card is on screen it moves to January 1 by itself, once.
 * 2. The decree: a timeline that fills in two parts (15 years, then the 15-year extension) while a counter runs to 30.
 * The server HTML carries the real figures (0%, 4%, 15+15), so nothing depends on the animation. Reduced motion: no
 * counting or filling, the end states show at once.
 */
export function TaxStats({ locale, todayLabel, janLabel, decreeLabel }: Props) {
  const es = locale === "es";
  const [mode, setMode] = useState<"today" | "jan">("today");
  const [shown, setShown] = useState(0); // the rate on screen while it counts
  const [decree, setDecree] = useState(0); // 0..1 timeline fill
  const [inView, setInView] = useState(false);
  // The server HTML shows the finished timeline (30 years); the browser empties it before it is seen, then fills it.
  const [armed, setArmed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const rate = mode === "today" ? 0 : 4;

  // Reveal once on screen: fill the timeline, and move the rate to January 1 unless the visitor already chose.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raf = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setInView(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1800);
      setDecree(still ? 1 : 1 - Math.pow(1 - p, 3));
      if (p < 1 && !still) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const auto = window.setTimeout(() => {
      if (!touched.current) setMode("jan");
    }, 1400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(auto);
    };
  }, [inView]);

  // Count the rate toward its target.
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const from = shown;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 700);
      const v = still ? rate : from + (rate - from) * (1 - Math.pow(1 - p, 3));
      setShown(v);
      if (p < 1 && !still) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- count from wherever the figure is now
  }, [rate]);

  const choose = (m: "today" | "jan") => {
    touched.current = true;
    setMode(m);
  };
  const filled = armed ? decree : 1;
  const years = Math.round(filled * 30);
  const lit = Math.round(shown);

  return (
    <div ref={root} className="grid gap-3">
      {/* 1. The rate */}
      <div className="rounded-[20px] bg-white p-6 ring-1 ring-travertine-deep/70 md:p-8">
        <div role="group" aria-label={es ? "Tasa" : "Rate"} className="inline-flex rounded-full bg-bone p-1 ring-1 ring-travertine-deep/70">
          {(["today", "jan"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => choose(m)}
              className={cn(
                "min-h-10 rounded-full px-4 text-[12px] font-semibold tracking-[0.1em] whitespace-nowrap uppercase transition-colors duration-300",
                mode === m ? "bg-charcoal text-bone" : "text-charcoal-soft hover:text-charcoal",
              )}
            >
              {m === "today" ? (es ? "Solicitud en 2026" : "Filed in 2026") : es ? "Desde 2027" : "Filed from 2027"}
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-end gap-5">
          <p className="w-[2.6ch] shrink-0 font-[family-name:var(--font-display)] text-[64px] leading-[0.85] text-brass-ink tabular-nums md:text-[80px]" aria-hidden>
            {Math.round(shown)}%
          </p>
          <p className="pb-1 text-[15px] leading-snug text-charcoal md:text-[17px]" aria-live="polite">
            <span className="sr-only">{rate}% </span>
            {mode === "today" ? todayLabel : janLabel}
          </p>
        </div>
        {/* Ten marks, one per percentage point. */}
        <div className="mt-6" aria-hidden>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={cn("h-2.5 rounded-full transition-colors duration-300", i < lit ? "bg-brass" : "bg-travertine")} style={{ transitionDelay: `${i * 40}ms` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-charcoal-soft">
            <span>0%</span>
            <span>{es ? "cada marca = 1%" : "each mark = 1%"}</span>
            <span>10%</span>
          </div>
        </div>
        {/* The real figures for search engines and screen readers, whatever the switch shows. */}
        <p className="sr-only">
          0% {todayLabel}. 4% {janLabel}.
        </p>
      </div>

      {/* 2. The decree: 15 + 15 years */}
      <div className="rounded-[20px] bg-white p-6 ring-1 ring-travertine-deep/70 md:p-8">
        <div className="flex items-end gap-5">
          <p className="shrink-0 font-[family-name:var(--font-display)] text-[64px] leading-[0.85] text-brass-ink md:text-[80px]">15+15</p>
          <p className="pb-1 text-[15px] leading-snug text-charcoal md:text-[17px]">{decreeLabel}</p>
        </div>
        <div className="mt-6" aria-hidden>
          <div className="relative grid h-11 grid-cols-2 gap-1.5 overflow-hidden rounded-full">
            {[0, 1].map((seg) => {
              const fill = Math.min(1, Math.max(0, filled * 2 - seg));
              return (
                <div key={seg} className="relative overflow-hidden rounded-full bg-travertine">
                  <div className={cn("absolute inset-y-0 left-0", seg === 0 ? "bg-brass" : "bg-brass-light")} style={{ width: `${fill * 100}%` }} />
                  <span className={cn("absolute inset-0 flex items-center justify-center px-2 text-[11px] font-semibold whitespace-nowrap transition-colors duration-300 min-[400px]:text-[12px] md:tracking-[0.06em]", fill > 0.55 ? "text-basalt" : "text-charcoal-soft")}>
                    {seg === 0 ? (es ? "15 años · el decreto" : "15 years · the decree") : es ? "15 más · la extensión" : "15 more · the extension"}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[13px] text-charcoal-soft">
            {es ? "Unos" : "About"} <span className="font-semibold text-charcoal tabular-nums">{years}</span> {es ? "años en total" : "years in total"}
          </p>
        </div>
      </div>
    </div>
  );
}
