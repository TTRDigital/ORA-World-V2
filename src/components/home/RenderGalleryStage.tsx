"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import {
  PerspectiveCarousel,
  type PerspectiveCarouselItem,
} from "@/components/vendor/vengeance-ui/perspective-carousel";

const query = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Vengeance UI perspective-carousel, restyled to the ORA palette. Wrapped in an explicit-height box (its own
 * h-full would otherwise collapse it on phones), opened on the middle slide so both sides are filled, with 4:3
 * frames so the tower renders are never cropped to a portrait strip.
 */
const CHAPTERS = ["arrival", "lobby", "residence", "penthouse"] as const;

export function RenderGalleryStage({
  items,
  chapters,
}: {
  items: PerspectiveCarouselItem[];
  chapters: readonly string[];
}) {
  const t = useTranslations("renders");
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
  const [active, setActive] = useState(Math.floor(items.length / 2));
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div>
      {/* Explicit-height box (required by the component). Its top band carries the live counter, the active
          render's title and chapter chips that jump the carousel, so the space above the slide is used. */}
      <div className="relative h-[440px] md:h-[640px]" data-reveal>
        <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex flex-col gap-3 md:inset-x-6 md:top-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-baseline gap-3">
            <p className="numeral tabular shrink-0 text-[26px] text-brass-light md:text-[34px]" aria-hidden>
              {pad(active + 1)}
              <span className="text-[15px] text-bone/60 md:text-[18px]"> / {pad(items.length)}</span>
            </p>
            <p key={active} className="fade-in display-s truncate text-bone">
              {items[active]?.title}
            </p>
          </div>
          <div
            role="group"
            aria-label={t("chapterLabel")}
            className="no-scrollbar pointer-events-auto -mx-1 flex gap-1.5 overflow-x-auto px-1"
          >
            {CHAPTERS.filter((c) => chapters.includes(c)).map((c) => {
              const first = chapters.indexOf(c);
              const on = chapters[active] === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(first)}
                  className={cn("chip shrink-0", on && "is-active")}
                >
                  {t(`chapters.${c}`)}
                  <span className="count">{chapters.filter((x) => x === c).length}</span>
                </button>
              );
            })}
          </div>
        </div>
        <PerspectiveCarousel
          items={items}
          activeIndex={active}
          onActiveIndexChange={setActive}
          slideWidth={wide ? 520 : 220}
          rotationStep={wide ? 48 : 38}
          inactiveScale={0.82}
          aspectClassName="aspect-[4/3]"
          className="rounded-[24px] focus-visible:outline-brass-light"
          imageClassName="rounded-[20px] shadow-[0_30px_60px_-30px_rgb(44_36_22/0.8)]"
          labelClassName="mt-1 font-sans text-[14px] font-semibold text-bone"
          controlsClassName="bottom-3 gap-1 border-brass-light/25 bg-basalt-soft/90 text-bone dark:border-brass-light/25 dark:bg-basalt-soft/90"
          labels={{
            carousel: t("carousel"),
            previous: t("previous"),
            next: t("next"),
            show: (title) => t("show", { title }),
            slide: (n, title) => t("slide", { n, title }),
          }}
        />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="visually-hidden" aria-live="polite">
          {t("count", { n: pad(active + 1), total: pad(items.length) })}: {items[active]?.title}
        </p>
        <p className="small max-w-md text-bone/70">{t("hint")}</p>
        <Link href="/place/gallery" className="pill pill-brass">
          {t("open")}
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
