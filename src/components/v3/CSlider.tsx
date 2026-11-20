"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { ClipOverlay } from "@/components/ui/ClipOverlay";

/**
 * Version C residences slider (in the manner of ciprianiresidences-brickell.com): wide photographs running off the
 * right edge, a caption line under each (what it shows / its group), a thin progress line and two square arrows.
 * Photographs only (client, 19 Nov: "images, not all videos").
 */
export function CSlider({ slides, locale, prev, next, label }: { slides: { image: ImageRef; caption: string; tag: string }[]; locale: Locale; prev: string; next: string; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    const g = track.current;
    if (!g) return;
    const on = () => {
      const items = Array.from(g.children) as HTMLElement[];
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
    g.addEventListener("scroll", on, { passive: true });
    return () => g.removeEventListener("scroll", on);
  }, []);
  const go = (k: number) => {
    const g = track.current;
    if (!g) return;
    const items = Array.from(g.children) as HTMLElement[];
    const n = Math.max(0, Math.min(items.length - 1, k));
    g.scrollTo({ left: items[n].offsetLeft - items[0].offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <div>
      <div className="flex items-center justify-end gap-5">
        <span aria-hidden className="relative block h-px w-32 bg-travertine-deep md:w-48">
          <span className="absolute inset-y-0 left-0 bg-charcoal transition-[width] duration-300" style={{ width: `${((i + 1) / slides.length) * 100}%` }} />
        </span>
        <button type="button" aria-label={prev} onClick={() => go(i - 1)} disabled={i === 0} className="grid size-11 place-items-center border border-travertine-deep text-[16px] text-charcoal transition-colors hover:border-charcoal disabled:opacity-40">
          ←
        </button>
        <button type="button" aria-label={next} onClick={() => go(i + 1)} disabled={i === slides.length - 1} className="grid size-11 place-items-center border border-travertine-deep text-[16px] text-charcoal transition-colors hover:border-charcoal disabled:opacity-40">
          →
        </button>
      </div>
      <ul
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
        className="no-scrollbar mt-6 mr-[calc(50%-50vw)] grid snap-x snap-mandatory auto-cols-[84vw] grid-flow-col gap-4 overflow-x-auto pr-5 md:auto-cols-[min(46vw,620px)] md:gap-6 md:pr-10"
      >
        {slides.map((s) => (
          <li key={s.image.src + s.caption} className="snap-start">
            <div className="relative aspect-[3/2] overflow-hidden bg-travertine">
              <Image src={s.image.src} alt={s.image.alt[locale] || s.image.alt.en} fill sizes="(max-width: 767px) 84vw, 620px" quality={82} className="object-cover" style={{ objectPosition: s.image.focal }} />
              {s.image.video && <ClipOverlay src={s.image.video} poster={s.image.poster} focal={s.image.focal} />}
            </div>
            <p className="mt-3 flex justify-between gap-4 text-[12.5px] text-charcoal-soft">
              <span>{s.caption}</span>
              <span className="shrink-0 tracking-[0.12em]">{s.tag}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
