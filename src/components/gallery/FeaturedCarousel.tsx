"use client";

import { useTranslations } from "next-intl";
import { Carousel_001 } from "@/components/vendor/skiper-ui/skiper47";

type Slide = { src: string; srcSet?: string; sizes?: string; alt: string; objectPosition?: string };

/**
 * Skiper UI Carousel_001 (Swiper coverflow), restyled from this wrapper: rounded, borderless slides whose height
 * keeps a landscape frame at every width (440px on desktop, as specified; shorter on smaller screens so the
 * 16:9 renders are never squeezed into portrait strips), brass pagination with 26px spacing between dots.
 */
export function FeaturedCarousel({ slides }: { slides: Slide[] }) {
  const t = useTranslations("galleryCarousel");
  return (
    <div
      className="[&_.swiper-slide]:!h-[240px] md:[&_.swiper-slide]:!h-[320px] xl:[&_.swiper-slide]:!h-[440px] [&_.swiper-slide]:overflow-hidden [&_.swiper-slide]:rounded-[24px] [&_.swiper-slide]:border-0 [&_.swiper-slide]:bg-travertine"
      style={
        {
          "--swiper-theme-color": "var(--color-brass-ink)",
          "--swiper-pagination-color": "var(--color-brass-ink)",
          "--swiper-pagination-bullet-inactive-color": "var(--color-charcoal-soft)",
          "--swiper-pagination-bullet-inactive-opacity": "0.45",
          "--swiper-pagination-bullet-size": "10px",
          "--swiper-pagination-bullet-horizontal-gap": "8px",
        } as React.CSSProperties
      }
      data-testid="featured-carousel"
    >
      <Carousel_001
        images={slides}
        showPagination
        loop
        spaceBetween={24}
        labels={{ prev: t("prev"), next: t("next"), slide: t("slide"), bullet: t("bullet"), carousel: t("carousel") }}
      />
    </div>
  );
}
