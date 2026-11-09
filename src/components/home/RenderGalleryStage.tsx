"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/Icons";
import { PerspectiveCarousel, type PerspectiveCarouselItem } from "@/components/vendor/vengeance-ui/perspective-carousel";

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
export function RenderGalleryStage({ items }: { items: PerspectiveCarouselItem[] }) {
  const t = useTranslations("renders");
  const wide = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
  const [active, setActive] = useState(Math.floor(items.length / 2));
  return (
    <div>
      <div className="h-[440px] md:h-[640px]" data-reveal>
        <PerspectiveCarousel
          items={items}
          activeIndex={active}
          onActiveIndexChange={setActive}
          slideWidth={wide ? 560 : 250}
          rotationStep={wide ? 48 : 38}
          inactiveScale={0.82}
          aspectClassName="aspect-[4/3]"
          className="rounded-[24px] focus-visible:outline-brass-light"
          imageClassName="rounded-[20px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]"
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
        <p className="numeral tabular text-[22px] text-brass-light" aria-live="polite">
          {t("count", { n: String(active + 1).padStart(2, "0"), total: String(items.length).padStart(2, "0") })}
        </p>
        <Link href="/place/gallery" className="pill pill-brass">
          {t("open")}
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
