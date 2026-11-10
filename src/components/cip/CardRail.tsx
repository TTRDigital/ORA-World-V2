"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";

export type RailCard = { key: string; kicker: string; title: string; text?: string; image: ImageRef; video?: string; href?: string; meta?: string; cta?: string };

/**
 * Swipeable row of cards (scroll-snap, arrow buttons, arrow keys), the Cipriani gallery pattern. Card images "come
 * alive": a slow drift and zoom while the card is on screen, or a muted looping clip when a `video` is supplied.
 */
export function CardRail({ cards, label, hint, locale, dark = false, ratio = "4/3", fit = "cover" }: { cards: RailCard[]; label: string; hint?: string; locale: Locale; dark?: boolean; ratio?: string; fit?: "cover" | "contain" }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const io = new IntersectionObserver((entries) => entries.forEach((e) => ((e.target as HTMLElement).dataset.inview = String(e.isIntersecting))), { threshold: 0.35 });
    el.querySelectorAll<HTMLElement>(".alive").forEach((c) => io.observe(c));
    return () => {
      el.removeEventListener("scroll", update);
      io.disconnect();
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("li");
    if (!el || !card) return;
    const reduced = document.documentElement.classList.contains("reduced-motion");
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative">
      {hint && <p className={cn("mb-4 text-[11px] font-semibold tracking-[0.24em] uppercase", dark ? "text-bone/60" : "text-charcoal-soft")}>{hint}</p>}
      <ul
        ref={track}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
        }}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {cards.map((c) => {
          const body = (
            <>
              <div className={cn("alive relative overflow-hidden", fit === "contain" ? "bg-white" : "bg-travertine")} style={{ aspectRatio: ratio }}>
                {c.video ? (
                  <video src={c.video} muted loop playsInline autoPlay aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <Image
                    src={c.image.src}
                    alt={c.image.alt[locale] || c.image.alt.en}
                    fill
                    sizes="(max-width: 767px) 82vw, (max-width: 1023px) 60vw, 520px"
                    quality={80}
                    className={fit === "contain" ? "object-contain p-2" : "object-cover"}
                    style={{ objectPosition: c.image.focal }}
                  />
                )}
              </div>
              <div className="p-5 md:p-6">
                <p className="text-[10.5px] font-semibold tracking-[0.26em] text-brass-ink uppercase">{c.kicker}</p>
                <h3 className="display-s mt-2 text-charcoal">{c.title}</h3>
                {c.meta && <p className="mt-1 text-[14px] font-semibold text-charcoal">{c.meta}</p>}
                {c.text && <p className="mt-1.5 text-[14px] leading-relaxed text-charcoal-soft">{c.text}</p>}
                {c.cta && <p className="mt-3 text-[11px] font-semibold tracking-[0.22em] text-brass-ink uppercase">{c.cta} →</p>}
              </div>
            </>
          );
          return (
            <li key={c.key} className="w-[82%] shrink-0 snap-start sm:w-[60%] lg:w-[78%] xl:w-[64%]">
              {c.href ? (
                <a href={c.href} className="block overflow-hidden rounded-[18px] bg-white shadow-[0_18px_40px_-28px_rgb(44_36_22/0.45)] ring-1 ring-travertine-deep/60 transition-transform duration-300 hover:-translate-y-0.5">
                  {body}
                </a>
              ) : (
                <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_18px_40px_-28px_rgb(44_36_22/0.45)] ring-1 ring-travertine-deep/60">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex gap-2">
        <button type="button" aria-label={locale === "es" ? "Anterior" : "Previous"} onClick={() => step(-1)} disabled={edge.start} className={cn("inline-flex size-11 items-center justify-center rounded-full ring-1 transition-opacity disabled:opacity-35", dark ? "text-bone ring-bone/40" : "text-charcoal ring-charcoal/25")}>
          <ArrowLeft width={18} height={18} />
        </button>
        <button type="button" aria-label={locale === "es" ? "Siguiente" : "Next"} onClick={() => step(1)} disabled={edge.end} className={cn("inline-flex size-11 items-center justify-center rounded-full ring-1 transition-opacity disabled:opacity-35", dark ? "text-bone ring-bone/40" : "text-charcoal ring-charcoal/25")}>
          <ArrowRight width={18} height={18} />
        </button>
      </div>
    </div>
  );
}
