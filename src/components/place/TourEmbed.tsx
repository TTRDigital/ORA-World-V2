"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { Picture } from "@/components/ui/Picture";
import { Play } from "@/components/ui/Icons";

/** Click-to-load Kuula 360° tour (nothing fetched until asked) and the film with controls. */
export function TourEmbed({ vrUrl, youtubeId, poster, locale }: { vrUrl: string; youtubeId: string | null; poster: ImageRef; locale: Locale }) {
  const t = useTranslations("tour");
  const [tour, setTour] = useState(false);
  const [film, setFilm] = useState(false);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="frame frame-lg relative" style={{ aspectRatio: "16/10" }} data-testid="vr-tour">
        {tour ? (
          <iframe src={vrUrl} title={t("loadTour")} className="absolute inset-0 h-full w-full" allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen" allowFullScreen />
        ) : (
          <>
            <Picture image={poster} locale={locale} ratio="16/10" rounded="none" reveal={false} sizes="(max-width: 1024px) 92vw, 46vw" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-basalt/70 to-basalt/10 p-6 text-center text-bone">
              <button type="button" onClick={() => setTour(true)} className="pill pill-brass min-h-12 px-6">{t("loadTour")}</button>
              <p className="small max-w-sm text-bone/80">{t("tourNote")}</p>
            </div>
          </>
        )}
      </div>
      <div className="frame frame-lg relative" style={{ aspectRatio: "16/10" }} data-testid="film">
        {film && youtubeId ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`} title={t("film")} className="absolute inset-0 h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        ) : (
          <>
            <Picture image={poster} locale={locale} ratio="16/10" rounded="none" reveal={false} sizes="(max-width: 1024px) 92vw, 46vw" />
            {youtubeId && (
              <button type="button" onClick={() => setFilm(true)} aria-label={t("film")} className="absolute inset-0 flex items-center justify-center bg-basalt/20 transition-colors hover:bg-basalt/30">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-bone/90 text-basalt shadow-lift"><Play width={28} height={28} /></span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
