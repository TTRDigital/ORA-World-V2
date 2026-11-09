"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale, ResilienceFeature } from "@/content/types";
import { t } from "@/lib/localize";
import { cn } from "@/lib/utils";

/** One glyph per published feature (24px grid, stroke icons in the site's icon style). */
const GLYPHS: Record<string, string[]> = {
  hurricane: [
    "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    "M5 9c1.4-3.6 6-5.6 10-3.8",
    "M19 15c-1.4 3.6-6 5.6-10 3.8",
    "M9 5C5.4 6.4 3.4 11 5.2 15",
    "M15 19c3.6-1.4 5.6-6 3.8-10",
  ],
  seismic: ["M3 12h3l2-5 3 10 3-8 2 3h5"],
  security: ["M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z", "M9 12l2 2 4-4"],
  smart: ["M6 11h12v9H6z", "M8 11V8a4 4 0 0 1 8 0v3", "M12 15v2"],
  power: ["M13 3L5 14h6l-1 7 8-11h-6z"],
  flood: ["M12 3s5 6 5 9a5 5 0 0 1-10 0c0-3 5-9 5-9z", "M3 21c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0"],
  "safe-rooms": ["M4 11l8-7 8 7v9H4z", "M10 20v-5h4v5"],
  preparedness: ["M5 6h14v14H5z", "M12 10v6", "M9 13h6", "M9 6V4h6v2"],
  training: [
    "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "M3 20c0-3 3-5 6-5s6 2 6 5",
    "M16 5a3 3 0 0 1 0 6",
    "M17 15c2.5.4 4 2.2 4 5",
  ],
};

function Glyph({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {(GLYPHS[slug] ?? GLYPHS.security).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

const R = 150;
const C = 2 * Math.PI * R;
const GAP = 4;

export function DialStage({ locale, features }: { locale: Locale; features: ResilienceFeature[] }) {
  const tx = useTranslations("dial");
  const total = features.length;
  const seg = C / total - GAP;
  const [inView, setInView] = useState<Set<number>>(() => new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  const filled = inView.size ? Math.max(...inView) + 1 : 0;
  const latest = filled ? features[filled - 1] : null;
  const current = filled - 1;
  // Jump to a feature's card (user-initiated only; never on load).
  const goTo = (i: number) => {
    const el = cardRefs.current[i];
    if (!el) return;
    const reducedMotion = document.documentElement.classList.contains("reduced-motion");
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 140,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    el.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true });
  };
  // The completion ring animates once (forwards) each time the dial reaches nine.
  const pulsed = filled === total;

  // Each card at 50% visibility fills its segment; scrolling back unfills.
  useEffect(() => {
    const reduced = document.documentElement.classList.contains("reduced-motion");
    const io = new IntersectionObserver(
      (entries) => {
        setInView((prev) => {
          const next = new Set(prev);
          for (const e of entries) {
            const i = Number((e.target as HTMLElement).dataset.index);
            if (e.isIntersecting) next.add(i);
            else next.delete(i);
          }
          return next;
        });
      },
      { threshold: reduced ? 0.01 : 0.5 },
    );
    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [features]);

  // Pin the dial on desktop while the cards scroll past (never under reduced motion).
  useEffect(() => {
    let mm: { revert: () => void } | null = null;
    let cancelled = false;
    (async () => {
      const { gsap, ScrollTrigger } = await import("@/lib/gsap");
      if (cancelled || !gridRef.current || !dialRef.current || !cardsRef.current) return;
      const media = gsap.matchMedia();
      mm = media;
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        if (document.documentElement.classList.contains("reduced-motion")) return;
        const st = ScrollTrigger.create({
          trigger: cardsRef.current,
          start: "top 112px",
          end: () => `bottom ${(dialRef.current?.offsetHeight ?? 0) + 112}px`,
          pin: dialRef.current,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
        return () => st.kill();
      });
      ScrollTrigger.refresh();
    })();
    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  const announce = filled === total ? tx("complete") : tx("progress", { done: filled, total });

  return (
    <div ref={gridRef} className="relative grid gap-8 lg:grid-cols-12 lg:gap-12">
      <style>{`
        @keyframes ora2-dial-pulse { 0% { opacity: .9; transform: scale(1) } 100% { opacity: 0; transform: scale(1.18) } }
        .ora2-dial-ring { transition: stroke-dashoffset 500ms var(--ease-out); }
        .reduced-motion .ora2-dial-ring { transition: none; }
      `}</style>

      {/* Mobile: sticky progress track under the nav */}
      <div className="sticky top-[88px] z-20 -mx-4 rounded-2xl bg-travertine px-4 py-3 shadow-[0_12px_24px_-16px_rgb(28_27_25/0.45)] lg:hidden">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-500",
              latest ? "bg-brass text-basalt" : "bg-bone-deep text-charcoal-soft",
            )}
          >
            <Glyph slug={latest?.slug ?? "security"} className="size-5" />
          </span>
          <div className="flex flex-1 gap-1" role="img" aria-label={announce}>
            {features.map((f, i) => (
              <span
                key={f.slug}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-500",
                  i < filled ? "bg-brass" : "bg-travertine-deep/60",
                )}
              />
            ))}
          </div>
          <span className="numeral tabular text-[22px] text-charcoal">
            {filled}
            <span className="text-[14px] text-charcoal-soft"> / {total}</span>
          </span>
        </div>
        <p className="small mt-1 truncate pl-12 text-charcoal-soft">
          {latest ? t(latest.title, locale) : " "}
        </p>
      </div>

      {/* Dial (pinned on desktop) */}
      <div className="hidden lg:col-span-5 lg:block">
        <div ref={dialRef} className="flex flex-col items-center">
          <div className="relative w-full max-w-[520px]">
            <svg viewBox="-80 -40 560 480" className="h-auto w-full" role="img" aria-label={announce}>
              {features.map((f, i) => (
                <circle
                  key={`t-${f.slug}`}
                  cx="200"
                  cy="200"
                  r={R}
                  fill="none"
                  stroke="var(--color-travertine-deep)"
                  strokeOpacity="0.5"
                  strokeWidth="10"
                  strokeDasharray={`${seg} ${C - seg}`}
                  transform={`rotate(${-90 + (360 / total) * i} 200 200)`}
                />
              ))}
              {features.map((f, i) => (
                <circle
                  key={`f-${f.slug}`}
                  cx="200"
                  cy="200"
                  r={R}
                  fill="none"
                  stroke="var(--color-brass)"
                  strokeWidth="10"
                  strokeDasharray={`${seg} ${C - seg}`}
                  strokeDashoffset={i < filled ? 0 : seg}
                  className="ora2-dial-ring"
                  transform={`rotate(${-90 + (360 / total) * i} 200 200)`}
                />
              ))}
              {pulsed && (
                <circle
                  cx="200"
                  cy="200"
                  r={R + 8}
                  fill="none"
                  stroke="var(--color-brass-light)"
                  strokeWidth="2"
                  style={{
                    transformOrigin: "200px 200px",
                    animation: "ora2-dial-pulse 1200ms var(--ease-out) forwards",
                  }}
                />
              )}
              {features.map((f, i) => {
                const a = ((-90 + (360 / total) * (i + 0.5)) * Math.PI) / 180;
                const x = 200 + Math.cos(a) * (R + 30);
                const y = 200 + Math.sin(a) * (R + 30);
                const anchor = Math.cos(a) > 0.2 ? "start" : Math.cos(a) < -0.2 ? "end" : "middle";
                return (
                  <text
                    key={`l-${f.slug}`}
                    x={x}
                    y={y + 4}
                    textAnchor={anchor}
                    fontSize="11.5"
                    fontWeight={i < filled ? 600 : 500}
                    fill={i < filled ? "var(--color-brass-ink)" : "var(--color-charcoal-soft)"}
                    style={{ fontFamily: "var(--font-sans)", transition: "fill 400ms" }}
                  >
                    {t(f.short, locale)}
                  </text>
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                aria-hidden
                className={cn(
                  "mb-2 inline-flex size-11 items-center justify-center rounded-2xl transition-colors duration-500",
                  latest ? "bg-brass text-basalt" : "bg-bone-deep text-charcoal-soft",
                )}
              >
                <Glyph
                  key={latest?.slug ?? "none"}
                  slug={latest?.slug ?? "security"}
                  className="fade-in size-6"
                />
              </span>
              <p className="numeral text-[56px] text-charcoal">
                <span key={filled} className="fade-in inline-block">
                  {filled}
                </span>
                <span className="text-[26px] text-charcoal-soft"> / {total}</span>
              </p>
              <p className="small mt-2 max-w-[150px] text-charcoal-soft">
                {latest ? t(latest.title, locale) : tx("start")}
              </p>
            </div>
          </div>
          {/* Jump grid: one icon per feature; passed features in brass, the current one ringed. */}
          <ul className="mt-2 grid w-full max-w-[420px] grid-cols-3 gap-2" aria-label={tx("jump")}>
            {features.map((f, i) => (
              <li key={`j-${f.slug}`}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-[12px] font-semibold transition-[background-color,color,box-shadow] duration-500",
                    i === current
                      ? "bg-basalt text-bone shadow-lift"
                      : i < filled
                        ? "bg-bone text-brass-ink"
                        : "bg-bone/60 text-charcoal-soft hover:bg-bone",
                  )}
                >
                  <Glyph slug={f.slug} className="size-[18px] shrink-0" />
                  <span className="truncate">{t(f.short, locale)}</span>
                  {/* The full title after the visible short label, so the name starts with what is seen. */}
                  <span className="visually-hidden">, {t(f.title, locale)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cards */}
      <ol ref={cardsRef} className="grid gap-4 lg:col-span-7">
        {features.map((f, i) => {
          const active = i < filled;
          const isCurrent = i === current;
          return (
            <li
              key={f.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-index={i}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
            >
              {/* The revealed <li> keeps a static className (the reveal adds is-revealed to it imperatively);
                  everything that changes with the dial lives on this inner card. */}
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "card relative overflow-hidden rounded-[20px] p-5 pl-6 transition-[background-color,box-shadow,transform] duration-500 [transition-timing-function:var(--ease-out)] md:p-7 md:pl-8",
                  isCurrent
                    ? "bg-bone shadow-lift ring-2 ring-brass md:-translate-y-0.5"
                    : active
                      ? "bg-bone"
                      : "bg-bone/70",
                )}
              >
                <span aria-hidden className="absolute top-0 bottom-0 left-0 w-[3px] bg-travertine-deep/40">
                  <span
                    className={cn(
                      "block h-full w-full origin-top bg-brass transition-transform duration-700 [transition-timing-function:var(--ease-out)]",
                      active ? "scale-y-100" : "scale-y-0",
                    )}
                  />
                </span>
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className={cn(
                      "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl transition-[background-color,color,transform] duration-500 md:size-14",
                      isCurrent
                        ? "scale-105 bg-brass text-basalt"
                        : active
                          ? "bg-bone-deep text-brass-ink"
                          : "bg-travertine text-charcoal-soft",
                    )}
                  >
                    <Glyph slug={f.slug} className="size-6 md:size-7" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div className="flex items-baseline gap-3">
                        <span
                          className={cn(
                            "numeral text-[22px] transition-colors md:text-[26px]",
                            active ? "text-brass-ink" : "text-charcoal-soft",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 tabIndex={-1} className="display-s outline-none">
                          {t(f.title, locale)}
                        </h3>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[12px] font-semibold transition-colors duration-500",
                          isCurrent ? "bg-basalt text-bone" : "bg-bone-deep text-charcoal-soft",
                        )}
                      >
                        {t(f.short, locale)}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-[15px] text-charcoal-soft">
                      {f.points.map((p, j) => (
                        <li key={j} className="flex gap-3">
                          <span
                            aria-hidden
                            className={cn(
                              "mt-[0.6em] h-px w-4 shrink-0 transition-colors",
                              active ? "bg-brass" : "bg-travertine-deep",
                            )}
                          />
                          <span>{t(p, locale)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
