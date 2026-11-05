"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale, ResilienceFeature } from "@/content/types";
import { t } from "@/lib/localize";
import { cn } from "@/lib/utils";

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
      <div className="sticky top-[88px] z-20 -mx-4 rounded-b-2xl bg-travertine/92 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-1" role="img" aria-label={announce}>
            {features.map((f, i) => (
              <span key={f.slug} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-500", i < filled ? "bg-brass" : "bg-travertine-deep/60")} />
            ))}
          </div>
          <span className="numeral tabular text-[22px] text-charcoal">
            {filled}
            <span className="text-[14px] text-charcoal-soft"> / {total}</span>
          </span>
        </div>
        <p className="small mt-1 truncate text-charcoal-soft">{latest ? t(latest.short, locale) : " "}</p>
      </div>

      {/* Dial (pinned on desktop) */}
      <div className="hidden lg:col-span-5 lg:block">
        <div ref={dialRef} className="flex flex-col items-center">
          <div className="relative w-full max-w-[520px]">
            <svg viewBox="-80 -40 560 480" className="h-auto w-full" role="img" aria-label={announce}>
              {features.map((f, i) => (
                <circle key={`t-${f.slug}`} cx="200" cy="200" r={R} fill="none" stroke="var(--color-travertine-deep)" strokeOpacity="0.5" strokeWidth="10" strokeDasharray={`${seg} ${C - seg}`} transform={`rotate(${-90 + (360 / total) * i} 200 200)`} />
              ))}
              {features.map((f, i) => (
                <circle key={`f-${f.slug}`} cx="200" cy="200" r={R} fill="none" stroke="var(--color-brass)" strokeWidth="10" strokeDasharray={`${seg} ${C - seg}`} strokeDashoffset={i < filled ? 0 : seg} className="ora2-dial-ring" transform={`rotate(${-90 + (360 / total) * i} 200 200)`} />
              ))}
              {pulsed && <circle cx="200" cy="200" r={R + 8} fill="none" stroke="var(--color-brass-light)" strokeWidth="2" style={{ transformOrigin: "200px 200px", animation: "ora2-dial-pulse 1200ms var(--ease-out) forwards" }} />}
              {features.map((f, i) => {
                const a = ((-90 + (360 / total) * (i + 0.5)) * Math.PI) / 180;
                const x = 200 + Math.cos(a) * (R + 30);
                const y = 200 + Math.sin(a) * (R + 30);
                const anchor = Math.cos(a) > 0.2 ? "start" : Math.cos(a) < -0.2 ? "end" : "middle";
                return (
                  <text key={`l-${f.slug}`} x={x} y={y + 4} textAnchor={anchor} fontSize="11.5" fontWeight={i < filled ? 600 : 500} fill={i < filled ? "var(--color-brass-ink)" : "var(--color-charcoal-soft)"} style={{ fontFamily: "var(--font-sans)", transition: "fill 400ms" }}>
                    {t(f.short, locale)}
                  </text>
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="numeral text-[56px] text-charcoal">
                <span key={filled} className="fade-in inline-block">{filled}</span>
                <span className="text-[26px] text-charcoal-soft"> / {total}</span>
              </p>
              <p className="small mt-2 max-w-[150px] text-charcoal-soft">{latest ? t(latest.title, locale) : " "}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <ol ref={cardsRef} className="grid gap-4 lg:col-span-7">
        {features.map((f, i) => {
          const active = i < filled;
          return (
            <li
              key={f.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-index={i}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
              className="card relative overflow-hidden rounded-[20px] bg-bone p-6 pl-7 md:p-8 md:pl-9"
            >
              <span aria-hidden className="absolute top-0 bottom-0 left-0 w-[3px] bg-travertine-deep/40">
                <span className={cn("block h-full w-full origin-top bg-brass transition-transform duration-700 [transition-timing-function:var(--ease-out)]", active ? "scale-y-100" : "scale-y-0")} />
              </span>
              <div className="flex items-baseline gap-3">
                <span className={cn("numeral text-[26px] transition-colors", active ? "text-brass-ink" : "text-charcoal-soft")}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display-s">{t(f.title, locale)}</h3>
              </div>
              <ul className="mt-3 space-y-1.5 text-[15px] text-charcoal-soft">
                {f.points.map((p, j) => (
                  <li key={j} className="flex gap-3">
                    <span aria-hidden className={cn("mt-[0.6em] h-px w-4 shrink-0 transition-colors", active ? "bg-brass" : "bg-travertine-deep")} />
                    <span>{t(p, locale)}</span>
                  </li>
                ))}
              </ul>
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
