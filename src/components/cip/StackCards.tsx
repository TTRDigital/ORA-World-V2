"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ClipOverlay } from "@/components/ui/ClipOverlay";
import type { ImageRef, Locale } from "@/content/types";
import { HealthCheck, ResilienceGrid, TaxCalculator, TravelRoute } from "./WhyWidgets";

export type StackCard = {
  title: string;
  text: string;
  tags: string[];
  href: string;
  image: ImageRef;
  /** the live panel on the card (client, 17 Nov) */
  kind: "health" | "tax" | "travel" | "resilience";
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
    // (down to its panel) is seen before the next card covers it.
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

  return (
    <ol ref={list} className="relative mt-8 md:mt-10">
      {cards.map((c, i) => (
        <li
          key={c.href}
          data-stack-item
          className="sticky mb-6 last:mb-0 md:mb-10 [top:calc(96px+var(--i)*14px)] lg:[top:calc(120px+var(--i)*20px)]"
          style={{ "--i": i } as React.CSSProperties}
        >
          {/* Client, 17 Nov: picture and words together: the picture (or its film) fills the card, the words sit on a
              shade over it on the left, and a live panel sits on the right (the tax calculator, the health check, the
              route). */}
          <article className="relative isolate origin-top overflow-hidden rounded-[24px] bg-basalt text-bone shadow-[0_24px_60px_-34px_rgb(44_36_22/0.55)] will-change-transform md:min-h-[540px] md:rounded-[28px]">
            <div className="group absolute inset-0 -z-10">
              <Image
                src={c.image.src}
                alt={c.image.alt[locale] || c.image.alt.en}
                fill
                sizes="(max-width: 1279px) calc(100vw - 40px), 1280px"
                quality={80}
                className="object-cover"
                style={{ objectPosition: c.image.focal }}
              />
              {c.image.video && <ClipOverlay src={c.image.video} poster={c.image.poster} focal={c.image.focal} />}
              <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(28_24_18/0.35),rgb(28_24_18/0.82)_55%)] md:bg-[linear-gradient(90deg,rgb(28_24_18/0.86),rgb(28_24_18/0.55)_50%,rgb(28_24_18/0.25))]" />
            </div>
            <div className="grid gap-6 p-5 min-[400px]:p-6 md:min-h-[540px] md:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] md:items-center md:gap-10 md:p-10 lg:p-12">
              <div>
                {/* Client, 17 Nov: no "01 / 03" number on the cards. */}
                <span aria-hidden className="block h-px w-12 bg-brass-light" />
                <h3 className="display-m mt-4 text-bone md:mt-5">{c.title}</h3>
                <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-bone/85 md:text-[16px]">{c.text}</p>
                {/* Client, 17 Nov: no "Read more" link on the cards. */}
              </div>
              {c.kind === "tax" ? (
                <TaxCalculator es={locale === "es"} />
              ) : c.kind === "health" ? (
                <HealthCheck es={locale === "es"} items={c.tags} />
              ) : c.kind === "resilience" ? (
                <ResilienceGrid es={locale === "es"} items={c.tags} />
              ) : (
                <TravelRoute es={locale === "es"} items={c.tags} />
              )}
            </div>
            {/* The shade the card takes on as the next one slides over it. */}
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-basalt [opacity:var(--stack-shade,0)]" />
          </article>
        </li>
      ))}
    </ol>
  );
}
