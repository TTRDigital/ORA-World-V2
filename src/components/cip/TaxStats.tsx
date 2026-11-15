"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  locale: "en" | "es";
  todayLabel: string; // "today, on capital gains and dividends"
  janLabel: string; // "the rate from January 1"
  decreeLabel: string; // "the year the program now runs to"
};

/**
 * The tax figures as something to play with (client, 15 Nov: "make these numbers interactive, not just plain").
 * 1. The rate: a switch between applications filed by Dec 31, 2026 (0%) and from Jan 1, 2027 (4%), per Act 38-2026; the figure counts between 0% and 4% and a ten-mark meter (one mark
 *    per percentage point) lights up to match. Once the card is on screen it moves to January 1 by itself, once.
 * 2. How long: a to-scale timeline, 2026 to 2035 (0% decrees) and 2035 to 2055 (4% decrees), filling as it comes into view.
 * The server HTML carries the real figures (0%, 4%, 2035, 2055), so nothing depends on the animation. Reduced motion: no
 * counting or filling, the end states show at once.
 */
export function TaxStats({ locale, todayLabel, janLabel, decreeLabel }: Props) {
  const es = locale === "es";
  const [mode, setMode] = useState<"today" | "jan">("today");
  const [shown, setShown] = useState(0); // the rate on screen while it counts
  const [decree, setDecree] = useState(0); // 0..1 timeline fill
  const [inView, setInView] = useState(false);
  // The server HTML shows the finished timeline (to 2055); the browser empties it before it is seen, then fills it.
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
  const year = 2026 + Math.round(filled * 29);
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
              {m === "today" ? (es ? "Solicite en 2026" : "Apply in 2026") : es ? "Desde 2027" : "Apply from 2027"}
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

      {/* 2. How long it lasts: today -> 2035 (decrees applied for by Dec 31, 2026) -> 2055 (the program's new end). */}
      <div className="rounded-[20px] bg-white p-6 ring-1 ring-travertine-deep/70 md:p-8">
        <div className="flex items-end gap-5">
          <p className="shrink-0 font-[family-name:var(--font-display)] text-[64px] leading-[0.85] text-brass-ink tabular-nums md:text-[80px]">{year}</p>
          <p className="pb-1 text-[15px] leading-snug text-charcoal md:text-[17px]">{decreeLabel}</p>
        </div>
        <div className="mt-6" aria-hidden>
          {/* Two spans to scale: 2026-2035 (9 years) and 2035-2055 (20 years). */}
          <div className="grid h-11 grid-cols-[9fr_20fr] gap-1.5">
            {[0, 1].map((seg) => {
              const split = 9 / 29;
              const fill = seg === 0 ? Math.min(1, filled / split) : Math.min(1, Math.max(0, (filled - split) / (1 - split)));
              return (
                <div key={seg} className="relative overflow-hidden rounded-full bg-travertine">
                  <div className={cn("absolute inset-y-0 left-0", seg === 0 ? "bg-brass" : "bg-brass-light")} style={{ width: `${fill * 100}%` }} />
                  <span className={cn("absolute inset-0 flex items-center justify-center px-2 text-[11px] font-semibold whitespace-nowrap transition-colors duration-300 min-[400px]:text-[12px]", fill > 0.55 ? "text-basalt" : "text-charcoal-soft")}>
                    {seg === 0 ? "0%" : es ? "4% · hasta 2055" : "4% · to 2055"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="relative mt-2 h-4 text-[11px] text-charcoal-soft">
            <span className="absolute left-0">2026</span>
            <span className="absolute left-[31%] -translate-x-1/2">2035</span>
            <span className="absolute right-0">2055</span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-charcoal-soft">
            {es ? "Decretos solicitados hasta el 31 dic 2026: 0% hasta 2035. Desde 2027: 4% hasta 2055." : "Decrees applied for by Dec 31, 2026: 0% through 2035. From 2027: 4% through 2055."}
          </p>
        </div>
      </div>
    </div>
  );
}
