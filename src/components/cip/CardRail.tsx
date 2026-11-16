"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";

export type RailCard = { key: string; kicker: string; title: string; text?: string; image: ImageRef; video?: string; poster?: string; href?: string; meta?: string; cta?: string };

/**
 * Swipeable row of cards (scroll-snap, arrow buttons, arrow keys), the Cipriani gallery pattern. Card images "come
 * alive": a slow drift and zoom while the card is on screen, or a muted looping clip when a `video` is supplied (it
 * loads only when about to be seen, plays while on screen and pauses off screen; reduced motion keeps the poster).
 */
export function CardRail({ cards, label, hint, locale, dark = false, ratio = "4/3", fit = "cover", overlay = true, variant = "card" }: { cards: RailCard[]; label: string; hint?: string; locale: Locale; dark?: boolean; ratio?: string; fit?: "cover" | "contain"; /** Cipriani style: round arrows over the middle of the picture (desktop). On by default. */ overlay?: boolean; /** "plan": the Cipriani floor-plan card, three across on desktop, the text on a dark band over the picture. */ variant?: "card" | "plan" }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });
  const [imgMid, setImgMid] = useState(0); // where the arrows sit: half the picture's height

  useEffect(() => {
    if (!overlay) return;
    const el = track.current;
    const pic = el?.querySelector<HTMLElement>(".alive, [style*='aspect-ratio']");
    if (!pic) return;
    const ro = new ResizeObserver(() => setImgMid(pic.offsetHeight / 2));
    ro.observe(pic);
    return () => ro.disconnect();
  }, [overlay]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const io = new IntersectionObserver((entries) => entries.forEach((e) => ((e.target as HTMLElement).dataset.inview = String(e.isIntersecting))), { threshold: 0.35 });
    el.querySelectorAll<HTMLElement>(".alive").forEach((c) => io.observe(c));
    // Clips: play while at least a third of the card shows (in the page and in the rail), pause otherwise.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vio = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            if (v.preload !== "auto") v.preload = "auto";
            v.play().catch(() => {});
          } else v.pause();
        }),
      { threshold: 0.35 },
    );
    if (!still) el.querySelectorAll<HTMLVideoElement>("video[data-loop]").forEach((v) => vio.observe(v));
    return () => {
      el.removeEventListener("scroll", update);
      io.disconnect();
      vio.disconnect();
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
      <div className="relative">
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
          const plan = variant === "plan";
          const body = plan ? (
            <div className="relative overflow-hidden bg-white" style={{ aspectRatio: ratio }}>
              <Image
                src={c.image.src}
                alt={c.image.alt[locale] || c.image.alt.en}
                fill
                sizes="(max-width: 639px) 82vw, (max-width: 1023px) 46vw, 420px"
                quality={80}
                className="object-contain p-3 opacity-90"
                style={{ objectPosition: "50% 30%" }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-basalt via-basalt/90 to-basalt/0 px-5 pt-16 pb-5 text-bone">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-brass-light uppercase">{c.kicker}</p>
                <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-[24px] leading-none">{c.title}</h3>
                {c.meta && <p className="mt-2 text-[13px] text-bone/85">{c.meta}</p>}
                {c.cta && <p className="mt-3 text-[10.5px] font-semibold tracking-[0.22em] text-bone uppercase">{c.cta} →</p>}
              </div>
            </div>
          ) : (
            <>
              <div className={cn("alive relative overflow-hidden", fit === "contain" ? "bg-white" : "bg-travertine")} style={{ aspectRatio: ratio }}>
                {c.video ? (
                  <video
                    data-loop
                    src={c.video}
                    poster={c.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    disablePictureInPicture
                    tabIndex={-1}
                    aria-label={c.image.alt[locale] || c.image.alt.en}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={c.image.src}
                    alt={c.image.alt[locale] || c.image.alt.en}
                    fill
                    sizes="(max-width: 639px) 82vw, (max-width: 1023px) 56vw, (max-width: 1439px) 72vw, 820px"
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
            <li key={c.key} className={cn("shrink-0 snap-start", plan ? "w-[82%] sm:w-[46%] lg:w-[calc((100%-32px)/3)]" : "w-[82%] sm:w-[60%] lg:w-[78%] xl:w-[64%]")}>
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
      {overlay && imgMid > 0 && (
        <>
          {(["prev", "next"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d === "prev" ? (locale === "es" ? "Anterior" : "Previous") : locale === "es" ? "Siguiente" : "Next"}
              onClick={() => step(d === "prev" ? -1 : 1)}
              disabled={d === "prev" ? edge.start : edge.end}
              style={{ top: imgMid }}
              className={cn(
                "absolute z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-[0_10px_24px_-12px_rgb(44_36_22/0.5)] ring-1 ring-travertine-deep/60 transition-opacity hover:bg-white disabled:opacity-0 lg:inline-flex",
                d === "prev" ? "left-3" : "right-3",
              )}
            >
              {d === "prev" ? <ArrowLeft width={18} height={18} /> : <ArrowRight width={18} height={18} />}
            </button>
          ))}
        </>
      )}
      </div>
      <div className={cn("mt-5 flex gap-2", overlay && "lg:hidden")}>
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
