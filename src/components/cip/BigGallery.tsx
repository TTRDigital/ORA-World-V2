"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/content/types";
import type { RailCard } from "./CardRail";
import { cn } from "@/lib/utils";

/**
 * The amenity gallery, large (client, 16 Nov: "show it with bigger pictures, designed differently, clean"; added under
 * section 01 as a second option, nothing removed). One film at a time across the full width, crossfading; the title
 * and line over the bottom-left; a row of titles underneath with a thin progress line that fills while the slide
 * plays, then moves on by itself. Click a title, use the arrows or swipe to choose. Films play only while on screen.
 */
const STILL_MS = 6500;

export function BigGallery({ slides, locale, label }: { slides: RailCard[]; locale: Locale; label: string }) {
  const es = locale === "es";
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const clip = useRef(0); // position within a card's playlist
  const touch = useRef<number | null>(null);
  const n = slides.length;
  const pad = (k: number) => String(k).padStart(2, "0");

  const go = useCallback((k: number) => {
    clip.current = 0;
    setProgress(0);
    setI(((k % n) + n) % n);
  }, [n]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play the active film (from its first clip), pause the rest; stills advance on a timer.
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    vids.current.forEach((v, k) => {
      if (!v) return;
      if (k === i && inView && !still) {
        const s = slides[k];
        if (!v.src.endsWith(s.video!)) v.src = s.video!;
        v.currentTime = 0;
        v.play().catch(() => {});
      } else v.pause();
    });
    const s = slides[i];
    if (s.video || !inView || still) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / STILL_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else go(i + 1);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i, inView, slides, go]);

  const onTime = (k: number) => {
    const v = vids.current[k];
    if (!v || k !== i || !v.duration) return;
    const s = slides[k];
    const parts = 1 + (s.playlist?.length ?? 0);
    setProgress((clip.current + v.currentTime / v.duration) / parts);
  };
  const onEnded = (k: number) => {
    const v = vids.current[k];
    const s = slides[k];
    if (!v || k !== i) return;
    const list = [s.video!, ...(s.playlist ?? [])];
    if (clip.current < list.length - 1) {
      clip.current += 1;
      v.src = list[clip.current];
      v.play().catch(() => {});
    } else go(i + 1);
  };

  return (
    <div ref={root} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="mx-auto mb-6 flex max-w-[1280px] items-end justify-between gap-4 px-5 md:px-10 xl:px-0">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-brass-ink uppercase">{label}</p>
        <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] text-charcoal tabular-nums">
          <button type="button" aria-label={es ? "Anterior" : "Previous"} onClick={() => go(i - 1)} className="grid size-12 place-items-center rounded-full border border-travertine-deep text-[18px] transition-colors hover:border-charcoal">
            ←
          </button>
          <span aria-live="polite">
            {pad(i + 1)} / {pad(n)}
          </span>
          <button type="button" aria-label={es ? "Siguiente" : "Next"} onClick={() => go(i + 1)} className="grid size-12 place-items-center rounded-full border border-travertine-deep text-[18px] transition-colors hover:border-charcoal">
            →
          </button>
        </div>
      </div>

      {/* The stage: full width, one slide at a time. */}
      <div
        className="relative h-[68svh] min-h-[420px] w-full overflow-hidden bg-basalt md:h-[min(82vh,56vw)]"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
      >
        {slides.map((s, k) => (
          <div key={s.key} aria-hidden={k !== i} className={cn("absolute inset-0 transition-opacity duration-1000", k === i ? "opacity-100" : "opacity-0")}>
            {s.video ? (
              <video
                ref={(el) => {
                  vids.current[k] = el;
                }}
                poster={s.poster}
                muted
                playsInline
                preload="none"
                disablePictureInPicture
                tabIndex={-1}
                onTimeUpdate={() => onTime(k)}
                onEnded={() => onEnded(k)}
                aria-label={s.image.alt[locale] || s.image.alt.en}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image src={s.image.src} alt={s.image.alt[locale] || s.image.alt.en} fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: s.image.focal }} />
            )}
          </div>
        ))}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(28_24_18/0.72),rgb(28_24_18/0.15)_45%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1280px] px-5 pb-8 md:px-10 md:pb-14 xl:px-0">
            <p key={`k${i}`} className="hero-fade text-[11px] font-semibold tracking-[0.3em] text-brass-light uppercase">
              {pad(i + 1)} / {pad(n)}
            </p>
            <h3 key={`t${i}`} className="hero-fade mt-3 font-[family-name:var(--font-display)] text-[40px] leading-none font-normal text-bone md:text-[72px]" style={{ animationDelay: "120ms" }}>
              {slides[i].title}
            </h3>
            {slides[i].text && (
              <p key={`x${i}`} className="hero-fade mt-4 max-w-[52ch] text-[15px] leading-relaxed text-bone/85 md:text-[17px]" style={{ animationDelay: "240ms" }}>
                {slides[i].text}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* The titles, with a progress line under the active one. */}
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 xl:px-0">
        <ul className="no-scrollbar mt-6 flex gap-6 overflow-x-auto md:gap-8 xl:grid xl:grid-cols-9 xl:gap-5 xl:overflow-visible">
          {slides.map((s, k) => (
            <li key={s.key} className="shrink-0">
              <button type="button" aria-current={k === i} onClick={() => go(k)} className={cn("grid w-full min-w-[120px] gap-2 xl:min-w-0 pt-1 pb-2 text-left transition-colors", k === i ? "text-charcoal" : "text-charcoal-soft hover:text-charcoal")}>
                <span className="block h-px w-full overflow-hidden bg-travertine-deep">
                  <span className="block h-full bg-brass" style={{ width: k === i ? `${progress * 100}%` : k < i ? "100%" : "0%" }} />
                </span>
                <span className="text-[10.5px] tracking-[0.22em] uppercase tabular-nums">{pad(k + 1)}</span>
                <span className="font-[family-name:var(--font-display)] text-[19px] leading-tight whitespace-nowrap xl:whitespace-normal">{s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
