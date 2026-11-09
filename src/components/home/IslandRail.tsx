"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale, PoiCategory } from "@/content/types";
import { cn } from "@/lib/utils";
import { Picture } from "@/components/ui/Picture";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";

export type RailPoi = {
  slug: string;
  name: string;
  category: PoiCategory;
  lat: number;
  lng: number;
  minutes: number | null;
  mode: "walk" | "drive";
  confirmed: boolean;
  note: string | null;
};
export type RailPlace = { slug: string; name: string; text: string; image: ImageRef; poi: string | null };

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Horizontally draggable place cards (scroll-snap, pointer drag with momentum on desktop, native swipe on
 * touch, arrow keys) beside a proximity list. Hovering a card highlights its point of interest and vice versa.
 */
export function IslandRail({
  locale,
  places,
  pois,
}: {
  locale: Locale;
  places: RailPlace[];
  pois: RailPoi[];
}) {
  const t = useTranslations("island");
  const tc = useTranslations("common");
  const railRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const drag = useRef({
    down: false,
    moved: false,
    startX: 0,
    startLeft: 0,
    lastX: 0,
    lastT: 0,
    v: 0,
    raf: 0,
  });

  const byPoi = (slug: string | null) => pois.find((p) => p.slug === slug) ?? null;
  // The journey: walking distance first, then drives from nearest to furthest; unknown times last.
  const journey = [...pois].sort((a, b) => {
    const k = (p: RailPoi) => (p.minutes == null ? 1e6 : p.mode === "walk" ? -1e3 + p.minutes : p.minutes);
    return k(a) - k(b);
  });
  const maxMinutes = Math.max(...pois.map((p) => p.minutes ?? 0), 1);
  // Scroll the rail (only the rail, never the window) to a place card and highlight it.
  const showPlace = (slug: string) => {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(`[data-card="${slug}"]`);
    if (!rail || !card) return;
    const reducedMotion = document.documentElement.classList.contains("reduced-motion");
    rail.scrollTo({
      left: (card.parentElement?.offsetLeft ?? card.offsetLeft) - (rail.clientWidth - card.clientWidth) / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    setActive(slug);
  };
  const timeLabel = (p: RailPoi | null) => {
    if (!p || p.minutes == null) return null;
    const base = p.mode === "walk" ? t("walk", { min: p.minutes }) : t("drive", { min: p.minutes });
    return p.confirmed ? base : `${base} · ${tc("approx")}`;
  };

  /* Centre-weighted tilt and lift, and edge state for the arrows. */
  const updateCards = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const reduced = document.documentElement.classList.contains("reduced-motion");
    const rect = rail.getBoundingClientRect();
    const centre = rect.left + rect.width / 2;
    rail.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      const r = card.getBoundingClientRect();
      const d = (r.left + r.width / 2 - centre) / rect.width; // -0.5 … 0.5
      const a = Math.min(1, Math.abs(d) * 2);
      card.style.transform = reduced
        ? ""
        : `translateY(${(a * 12).toFixed(1)}px) rotate(${(d * 2).toFixed(2)}deg) scale(${(1 - a * 0.035).toFixed(3)})`;
      // The off-centre fade stays shallow so text on edge cards keeps AA contrast.
      card.style.opacity = reduced ? "" : `${1 - a * 0.04}`;
    });
    setEdges({ start: rail.scrollLeft < 8, end: rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateCards);
    };
    onScroll();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [updateCards]);

  const cardWidth = () => railRef.current?.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 320;
  const scrollByCards = (n: number) =>
    railRef.current?.scrollBy({ left: n * (cardWidth() + 16), behavior: "smooth" });

  /* Pointer drag with momentum (mouse / pen only; touch keeps native scrolling and snap). */
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "touch") return;
    const rail = railRef.current!;
    cancelAnimationFrame(drag.current.raf);
    drag.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startLeft: rail.scrollLeft,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      raf: 0,
    };
    rail.classList.add("dragging");
    rail.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d.down) return;
    const rail = railRef.current!;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    rail.scrollLeft = d.startLeft - dx;
    const now = performance.now();
    d.v = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
    d.lastX = e.clientX;
    d.lastT = now;
  };
  const endDrag = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    const rail = railRef.current!;
    try {
      rail.releasePointerCapture(e.pointerId);
    } catch {}
    let v = -d.v * 16; // px per frame
    const step = () => {
      if (Math.abs(v) < 0.5) {
        rail.classList.remove("dragging");
        return;
      }
      rail.scrollLeft += v;
      v *= 0.92;
      d.raf = requestAnimationFrame(step);
    };
    if (Math.abs(v) > 2) d.raf = requestAnimationFrame(step);
    else rail.classList.remove("dragging");
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const onRailKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const cards = Array.from(railRef.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
    const i = cards.findIndex((c) => c === document.activeElement || c.contains(document.activeElement));
    const next =
      cards[Math.min(cards.length - 1, Math.max(0, (i < 0 ? 0 : i) + (e.key === "ArrowRight" ? 1 : -1)))];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="min-w-0 lg:col-span-8" data-reveal>
        <div className="mb-3 flex items-center justify-between">
          <p className="small text-charcoal-soft">{t("dragHint")}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              disabled={edges.start}
              aria-label={tc("previous")}
              className="inline-flex size-11 items-center justify-center rounded-full bg-bone text-charcoal shadow-[inset_0_0_0_1px_var(--color-travertine-deep)] transition-opacity disabled:opacity-35"
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              disabled={edges.end}
              aria-label={tc("next")}
              className="inline-flex size-11 items-center justify-center rounded-full bg-bone text-charcoal shadow-[inset_0_0_0_1px_var(--color-travertine-deep)] transition-opacity disabled:opacity-35"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
        <ul
          ref={railRef}
          aria-label={t("railLabel")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onKeyDown={onRailKey}
          className="no-scrollbar -mx-4 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-3 select-none md:-mx-2 md:px-2 [&.dragging]:cursor-grabbing [&.dragging]:snap-none"
          style={{ scrollPaddingInline: "1rem" }}
        >
          {places.map((place, i) => {
            const poi = byPoi(place.poi);
            const time = timeLabel(poi);
            const isActive =
              active != null && (active === place.slug || (poi != null && active === poi.slug));
            return (
              <li key={place.slug} className="w-[80vw] shrink-0 snap-start sm:w-[360px] lg:w-[380px]">
                <article
                  data-card={place.slug}
                  tabIndex={0}
                  aria-label={`${i + 1} ${tc("of")} ${places.length}: ${place.name}`}
                  onMouseEnter={() => setActive(place.slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={(e) => {
                    setActive(place.slug);
                    e.currentTarget.scrollIntoView({
                      inline: "center",
                      block: "nearest",
                      behavior: "smooth",
                    });
                  }}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "card group h-full overflow-hidden rounded-[20px] bg-bone transition-[box-shadow] duration-500 will-change-transform",
                    isActive && "shadow-lift ring-1 ring-brass",
                  )}
                  style={{ transitionTimingFunction: EASE }}
                >
                  <div className="ambient-zoom">
                    <Picture
                      image={place.image}
                      locale={locale}
                      sizes="(max-width: 640px) 80vw, 380px"
                      ratio="3/2"
                      reveal={false}
                      rounded="none"
                      className="rounded-none"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="display-s">{place.name}</h3>
                      <span className="numeral text-[22px] text-brass-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="body mt-2 text-[15px] text-charcoal-soft">{place.text}</p>
                    {time && (
                      <p className="label mt-3 flex items-center gap-2">
                        <span className="inline-block h-px w-6 bg-brass" aria-hidden />
                        {time}
                      </p>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      <aside
        className="lg:col-span-4"
        aria-label={t("proximity")}
        data-reveal
        style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
      >
        <div className="card h-full rounded-[20px] bg-bone p-4 md:p-5">
          <p className="label">{t("proximity")}</p>
          {/* Legend: published times are filled brass, approximate ones hollow; both stay explicit in text. */}
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-charcoal-soft">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-2.5 rounded-full bg-brass" />
              {t("confirmed")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-2.5 rounded-full border border-charcoal-soft" />
              {t("approx")}
            </span>
          </p>
          <ol className="relative mt-4">
            {/* The journey line */}
            <span aria-hidden className="absolute top-3 bottom-3 left-[17px] w-px bg-travertine-deep" />
            {journey.map((p) => {
              const place = places.find((x) => x.poi === p.slug);
              const isActive =
                active != null && (active === p.slug || (place != null && active === place.slug));
              const time =
                p.minutes == null
                  ? tc("tbc")
                  : p.mode === "walk"
                    ? t("walk", { min: p.minutes })
                    : t("drive", { min: p.minutes });
              const share = p.minutes == null ? 0 : Math.max(0.06, p.minutes / maxMinutes);
              const Row = place ? "button" : "div";
              return (
                <li key={p.slug} className="relative">
                  <Row
                    {...(place
                      ? { type: "button" as const, onClick: () => showPlace(place.slug) }
                      : { tabIndex: 0 })}
                    onMouseEnter={() => setActive(p.slug)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(p.slug)}
                    onBlur={() => setActive(null)}
                    className={cn(
                      "group relative flex w-full items-start gap-3 rounded-xl py-2.5 pr-2 pl-0 text-left transition-colors duration-300",
                      isActive && "bg-bone-deep",
                    )}
                  >
                    <span
                      className={cn(
                        "relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                        isActive
                          ? "bg-brass text-basalt"
                          : p.confirmed
                            ? "bg-basalt text-brass-light"
                            : "border border-dashed border-charcoal-soft bg-bone text-charcoal",
                      )}
                    >
                      <PoiIcon category={p.category} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-[15px] leading-snug font-semibold">{p.name}</span>
                        <span className="tabular shrink-0 text-[14px] font-semibold">{time}</span>
                      </span>
                      {/* Relative distance bar, proportional to the minutes */}
                      <span
                        aria-hidden
                        className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-travertine"
                      >
                        <span
                          className={cn(
                            "block h-full rounded-full transition-[width] duration-700 [transition-timing-function:var(--ease-out)]",
                            p.confirmed ? "bg-brass" : "bg-charcoal-soft/50",
                          )}
                          style={{ width: `${share * 100}%` }}
                        />
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-[12px]",
                          p.confirmed ? "text-brass-ink" : "text-charcoal-soft",
                        )}
                      >
                        {p.confirmed ? t("confirmed") : t("approx")}
                        {place && (
                          <span className="ml-1.5 text-charcoal-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                            · {t("seeCard")}
                          </span>
                        )}
                      </span>
                    </span>
                  </Row>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>
    </div>
  );
}

export function PoiIcon({ category, size = 18 }: { category: PoiCategory; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (category) {
    case "beach":
      return (
        <svg {...p}>
          <path d="M3 18c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
          <path d="M12 4v8M12 4c-3 0-5 2-5 4h10c0-2-2-4-5-4z" />
        </svg>
      );
    case "golf":
      return (
        <svg {...p}>
          <path d="M9 20v-9M9 4l7 3-7 3zM5 20c0-1.5 2-2.5 4-2.5s4 1 4 2.5" />
        </svg>
      );
    case "school":
      return (
        <svg {...p}>
          <path d="M3 10l9-4 9 4-9 4z" />
          <path d="M7 12.5V17c0 1.5 2.5 2.5 5 2.5s5-1 5-2.5v-4.5M21 10v5" />
        </svg>
      );
    case "healthcare":
      return (
        <svg {...p}>
          <path d="M12 7v10M7 12h10" />
          <rect x="4" y="4" width="16" height="16" rx="4" />
        </svg>
      );
    case "airport":
      return (
        <svg {...p}>
          <path d="M3 13l8-1 3-8 2 1-1 7 5 3-1 2-5-1-3 4H9l1-4-6-1z" />
        </svg>
      );
    case "dining":
      return (
        <svg {...p}>
          <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 6v2h3v10" />
        </svg>
      );
    case "culture":
      return (
        <svg {...p}>
          <path d="M4 21h16M5 21V10h14v11M3 10l9-6 9 6M9 21v-6h6v6" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <path d="M12 21V12M12 12c-5 0-7-4-7-8 4 0 7 2 7 8zM12 12c5 0 7-4 7-8-4 0-7 2-7 8z" />
        </svg>
      );
  }
}
