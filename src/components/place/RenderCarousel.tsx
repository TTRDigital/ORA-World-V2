"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { Picture } from "@/components/ui/Picture";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/** Scroll-snap render carousel with arrows, keyboard and a hairline progress rail; 16:10 frames, never 21:9. */
export function RenderCarousel({ images, locale, label }: { images: ImageRef[]; locale: Locale; label: string }) {
  const tc = useTranslations("common");
  const ref = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setActive(Math.round(el.scrollLeft / (el.firstElementChild?.clientWidth ?? 1)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const n = (i + images.length) % images.length;
    el.scrollTo({ left: n * (el.firstElementChild?.clientWidth ?? 0), behavior: "smooth" });
  };
  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={(e) => { if (e.key === "ArrowRight") go(active + 1); if (e.key === "ArrowLeft") go(active - 1); }}>
      <ul ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto" tabIndex={0}>
        {images.map((img, i) => (
          <li key={img.src} className="w-[88%] shrink-0 snap-center md:w-[72%]" aria-roledescription="slide" aria-label={`${i + 1} / ${images.length}`}>
            <Picture image={img} locale={locale} ratio="16/10" rounded="lg" reveal={false} sizes="(max-width: 768px) 88vw, 72vw" priority={i === 0} />
            <p className="small mt-2 text-charcoal-soft">{img.alt[locale]}{img.rendering ? ` · ${tc("rendering")}` : ""}</p>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={() => go(active - 1)} className="pill pill-ghost size-11 px-0" aria-label={tc("previous")}><ArrowLeft /></button>
        <div className="flex flex-1 gap-1" aria-hidden>
          {images.map((_, i) => (
            <span key={i} className={cn("h-px flex-1 transition-colors duration-500", i === active ? "bg-brass" : "bg-travertine-deep")} />
          ))}
        </div>
        <span className="numeral tabular text-[18px]" aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => go(active + 1)} className="pill pill-ghost size-11 px-0" aria-label={tc("next")}><ArrowRight /></button>
      </div>
    </div>
  );
}
