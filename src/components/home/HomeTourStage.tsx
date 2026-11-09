"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { Picture } from "@/components/ui/Picture";
import { Play } from "@/components/ui/Icons";

/** The ORA World 360° collection (kuula.co) in one large frame. Click to load: nothing is fetched until asked. */
export function HomeTourStage({ vrUrl, poster, locale }: { vrUrl: string; poster: ImageRef; locale: Locale }) {
  const t = useTranslations("homeTour");
  const [on, setOn] = useState(false);
  return (
    <div className="frame frame-lg relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8]" data-testid="home-vr-tour">
      {on ? (
        <iframe
          src={vrUrl}
          title={t("frameTitle")}
          className="absolute inset-0 h-full w-full border-0"
          allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          <Picture image={poster} locale={locale} fill rounded="none" reveal={false} sizes="(max-width: 1400px) 96vw, 1340px" className="absolute inset-0 h-full w-full !aspect-auto" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-basalt/35 p-6 text-center text-bone">
            <button
              type="button"
              onClick={() => setOn(true)}
              className="group inline-flex flex-col items-center gap-3"
              data-track="home_vr_tour"
            >
              <span className="relative inline-flex size-20 items-center justify-center rounded-full bg-bone/95 text-brass-ink shadow-lift transition-transform duration-300 group-hover:scale-105 md:size-24">
                <span className="pulse absolute inset-0 rounded-full" aria-hidden />
                <Play width={30} height={30} />
              </span>
              <span className="pill pill-brass min-h-12 px-6">{t("start")}</span>
            </button>
            <p className="small max-w-sm text-bone/90">{t("note")}</p>
          </div>
        </>
      )}
    </div>
  );
}
