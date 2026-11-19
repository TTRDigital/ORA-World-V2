"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";

export type ReelItem = { href: string; label: string; title: string; image: ImageRef };

/**
 * Version C introduction (client, 19 Nov: "on the right side, a slice that goes by itself, every two seconds:
 * longevity, fitness...; automated, like flashcards"): the index on the left and a tall picture panel on the right that
 * slides to the next card on its own every 2.5 s, with a progress line per card. The index row of the card on show is
 * marked; pointing at a row (or focusing it) shows its card and holds there. Reduced motion: no automatic advance.
 */
export function CReel({
  items,
  locale,
  interval = 2500,
  children,
}: {
  items: ReelItem[];
  locale: Locale;
  interval?: number;
  children?: React.ReactNode;
}) {
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [still, setStill] = useState(false);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        setSeen(e.isIntersecting);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (held || still || !seen) return;
    const t = setTimeout(() => setI((k) => (k + 1) % items.length), interval);
    return () => clearTimeout(t);
  }, [i, held, still, seen, interval, items.length]);
  const run = !held && !still && seen;

  return (
    <div
      ref={box}
      className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-20"
    >
      <div>
        {children}
        <ol className="mt-10 border-t border-travertine-deep" onMouseLeave={() => setHeld(false)}>
          {items.map((it, k) => (
            <li key={it.href + it.label} className="border-b border-travertine-deep">
              <Link
                href={it.href}
                onMouseEnter={() => {
                  setI(k);
                  setHeld(true);
                }}
                onFocus={() => {
                  setI(k);
                  setHeld(true);
                }}
                onBlur={() => setHeld(false)}
                className={cn(
                  "flex min-h-14 items-center justify-between gap-4 text-[14px] font-medium tracking-[0.2em] uppercase transition-colors",
                  k === i ? "text-brass-ink" : "text-charcoal hover:text-brass-ink",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={cn("h-px bg-brass transition-all duration-500", k === i ? "w-8" : "w-0")}
                  />
                  {it.label}
                </span>
                <span className="text-[11px] tracking-[0.1em] text-charcoal-soft">
                  {String(k + 1).padStart(2, "0")}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Client, 19 Nov: a small card, the size the two photographs had, in the same section. */}
      <div className="mx-auto w-full max-w-[340px] lg:max-w-[380px]">
        {/* The panel: the cards side by side, the track slides one card at a time. */}
        <div
          className="relative aspect-[4/5] overflow-hidden bg-travertine"
          aria-roledescription="carousel"
          aria-label={items.map((x) => x.label).join(", ")}
        >
          <div
            className="flex h-full transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {items.map((it, k) => (
              <div key={it.href + it.label} className="relative h-full w-full shrink-0" aria-hidden={k !== i}>
                <Image
                  src={it.image.src}
                  alt={it.image.alt[locale] || it.image.alt.en}
                  fill
                  sizes="(max-width: 1023px) 340px, 380px"
                  quality={82}
                  className={cn(
                    "object-cover transition-transform duration-[2600ms] ease-out",
                    k === i && run ? "scale-[1.06]" : "scale-100",
                  )}
                  style={{ objectPosition: it.image.focal }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(28_24_18/0.72))]"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[10.5px] font-semibold tracking-[0.28em] uppercase opacity-90">
                    {String(k + 1).padStart(2, "0")} · {it.label}
                  </p>
                  <p className="mt-1.5 font-[family-name:var(--font-display)] text-[24px] leading-tight font-medium">
                    {it.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* One progress line per card. */}
        <div
          className="mt-3 grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((it, k) => (
            <button
              key={it.href + it.label}
              type="button"
              aria-label={it.label}
              aria-current={k === i}
              onClick={() => setI(k)}
              className="group py-2"
            >
              <span className="relative block h-[2px] overflow-hidden bg-travertine-deep">
                <span
                  key={k === i ? `on-${i}-${run}` : `off-${k}`}
                  className={cn(
                    "absolute inset-y-0 left-0 bg-charcoal",
                    k < i && "w-full",
                    k > i && "w-0",
                    k === i && (run ? "reel-fill" : "w-full"),
                  )}
                  style={k === i && run ? { animationDuration: `${interval}ms` } : undefined}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
