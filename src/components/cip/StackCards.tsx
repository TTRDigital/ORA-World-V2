"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ClipOverlay } from "@/components/ui/ClipOverlay";
import type { ImageRef, Locale } from "@/content/types";
import { ArrowRight } from "@/components/ui/Icons";

export type StackCard = {
  title: string;
  text: string;
  tags: string[];
  href: string;
  linkLabel: string;
  image: ImageRef;
};

/**
 * Cards that stack as you scroll (client, 15 Nov: "when I scroll down, the cards go on top of each other"). Each card
 * sticks under the header, a few pixels lower than the one before, and the next card slides up over it. The card
 * underneath eases back (a little smaller, a soft shade) so the newest one reads as on top. Each card carries a
 * picture, its number, the line, short highlights and a link, so the section is not plain text.
 * Reduced motion: the cards still stack (that is plain layout), without the scaling.
 */
export function StackCards({ cards, locale }: { cards: StackCard[]; locale: Locale }) {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = list.current;
    if (!ol || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(ol.querySelectorAll<HTMLElement>("[data-stack-item]"));
    let raf = 0;
    // Small phones: a card taller than the room under the header sticks a little higher, so its whole content
    // (down to "Read more") is seen before the next card covers it.
    const fit = () => {
      items.forEach((item) => {
        item.style.top = "";
        const base = parseFloat(getComputedStyle(item).top) || 0;
        const room = window.innerHeight - item.offsetHeight - 12;
        if (room < base) item.style.top = `${Math.round(room)}px`;
      });
    };
    const update = () => {
      raf = 0;
      items.forEach((item, i) => {
        const card = item.firstElementChild as HTMLElement | null;
        const next = items[i + 1];
        if (!card) return;
        let p = 0;
        if (next) {
          // How far the next card has slid over this one: 0 (not yet) to 1 (fully on top).
          const top = card.getBoundingClientRect().top;
          const nextTop = next.getBoundingClientRect().top;
          p = Math.min(1, Math.max(0, 1 - (nextTop - top) / card.offsetHeight));
        }
        card.style.transform = `scale(${1 - p * 0.06})`;
        card.style.setProperty("--stack-shade", String(p * 0.4));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      fit();
      onScroll();
    };
    fit();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const total = String(cards.length).padStart(2, "0");
  return (
    <ol ref={list} className="relative mt-10 md:mt-14">
      {cards.map((c, i) => (
        <li
          key={c.href}
          data-stack-item
          className="sticky mb-6 last:mb-0 md:mb-10 [top:calc(96px+var(--i)*14px)] lg:[top:calc(120px+var(--i)*20px)]"
          style={{ "--i": i } as React.CSSProperties}
        >
          <article className="relative grid origin-top overflow-hidden rounded-[24px] bg-white shadow-[0_24px_60px_-34px_rgb(44_36_22/0.55)] ring-1 ring-travertine-deep/60 will-change-transform md:min-h-[420px] md:grid-cols-[1.1fr_1fr] md:rounded-[28px]">
            <div className="group relative aspect-[2/1] overflow-hidden md:aspect-auto md:h-full">
              <Image
                src={c.image.src}
                alt={c.image.alt[locale] || c.image.alt.en}
                fill
                sizes="(max-width: 767px) calc(100vw - 40px), 640px"
                quality={80}
                className="object-cover transition-transform duration-[1200ms] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
                style={{ objectPosition: c.image.focal }}
              />
              {c.image.video && <ClipOverlay src={c.image.video} poster={c.image.poster} focal={c.image.focal} />}
              <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-charcoal backdrop-blur-sm md:top-6 md:left-6">
                {String(i + 1).padStart(2, "0")} / {total}
              </span>
            </div>
            <div className="flex flex-col justify-center p-5 min-[400px]:p-6 md:p-10 lg:p-12">
              <span aria-hidden className="h-px w-12 bg-brass" />
              <h3 className="display-m mt-4 text-charcoal md:mt-5">{c.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-charcoal-soft md:text-[16px]">{c.text}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5 md:mt-5 md:gap-2" aria-label={c.title}>
                {c.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-bone px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap text-charcoal ring-1 ring-brass/35 min-[400px]:text-[12px] md:px-3 md:py-1.5">
                    {tag}
                  </li>
                ))}
              </ul>
              <a href={c.href} className="mt-3 inline-flex md:mt-6 min-h-11 items-center gap-2 self-start text-[11px] font-semibold tracking-[0.22em] text-brass-ink uppercase hover:text-charcoal">
                {c.linkLabel} <ArrowRight width={13} height={13} />
              </a>
            </div>
            {/* The shade the card takes on as the next one slides over it. */}
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-basalt [opacity:var(--stack-shade,0)]" />
          </article>
        </li>
      ))}
    </ol>
  );
}
