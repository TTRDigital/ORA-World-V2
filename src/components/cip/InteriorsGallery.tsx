"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";

export type InteriorSlide = { title: string; note: string; image: ImageRef; video?: string; poster?: string };

/**
 * "Inspired living spaces" (client, 16 Nov: copy the Interiors section of the ORA World · Tesoro del Mar presentation):
 * the eyebrow, title and line on the left, a 01 / 08 counter between round arrows on the right; below, wide 16:9
 * slides running off the right edge of the page, each with its name and a note under it; then two feature lists.
 * Films play while on screen.
 */
export function InteriorsGallery({ locale, slides, prevLabel, nextLabel, label }: { locale: Locale; slides: InteriorSlide[]; prevLabel: string; nextLabel: string; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    const g = track.current;
    if (!g) return;
    const items = Array.from(g.children) as HTMLElement[];
    const onScroll = () => {
      let best = 0;
      let d = Infinity;
      items.forEach((f, k) => {
        const dd = Math.abs(f.offsetLeft - items[0].offsetLeft - g.scrollLeft);
        if (dd < d) {
          d = dd;
          best = k;
        }
      });
      setI(best);
    };
    g.addEventListener("scroll", onScroll, { passive: true });
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !still) {
            if (v.preload !== "auto") v.preload = "auto";
            v.play().catch(() => {});
          } else v.pause();
        }),
      { threshold: 0.4 },
    );
    g.querySelectorAll("video").forEach((v) => io.observe(v));
    return () => {
      g.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const go = (k: number) => {
    const g = track.current;
    if (!g) return;
    const items = Array.from(g.children) as HTMLElement[];
    const n = Math.max(0, Math.min(items.length - 1, k));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    g.scrollTo({ left: items[n].offsetLeft - items[0].offsetLeft, behavior: still ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] text-charcoal tabular-nums">
        <button type="button" aria-label={prevLabel} onClick={() => go(i - 1)} className="grid size-[52px] place-items-center rounded-full border border-travertine-deep text-[18px] transition-colors hover:border-charcoal">
          ←
        </button>
        <span aria-live="polite">
          {pad(i + 1)} / {pad(slides.length)}
        </span>
        <button type="button" aria-label={nextLabel} onClick={() => go(i + 1)} className="grid size-[52px] place-items-center rounded-full border border-travertine-deep text-[18px] transition-colors hover:border-charcoal">
          →
        </button>
      </div>
      <div
        ref={track}
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(i + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(i - 1);
          }
        }}
        className="interiors-track no-scrollbar col-span-full mt-10 mr-[calc(50%-50vw)] pr-5 md:pr-10 grid snap-x snap-mandatory auto-cols-[86vw] grid-flow-col gap-4 overflow-x-auto md:mt-14 md:auto-cols-[min(72vw,980px)] md:gap-7"
      >
        {slides.map((s) => (
          <figure key={s.title} className="m-0 snap-start">
            <div className="relative aspect-video overflow-hidden bg-travertine">
              {s.video ? (
                <video src={s.video} poster={s.poster} muted loop playsInline preload="none" disablePictureInPicture tabIndex={-1} aria-label={s.image.alt[locale] || s.image.alt.en} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <Image src={s.image.src} alt={s.image.alt[locale] || s.image.alt.en} fill sizes="(max-width: 767px) 86vw, 980px" quality={80} className="object-cover" style={{ objectPosition: s.image.focal }} />
              )}
            </div>
            <figcaption className="mt-4 flex justify-between gap-4 text-[11px] tracking-[0.22em] text-charcoal-soft uppercase">
              <b className="font-normal text-charcoal">{s.title}</b>
              <span>{s.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
