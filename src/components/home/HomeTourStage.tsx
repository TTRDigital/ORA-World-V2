"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";
import { Picture } from "@/components/ui/Picture";
import { Play } from "@/components/ui/Icons";

type Mode = "tour" | "film";

/**
 * One large frame with two views: the ORA World 360° collection (kuula.co) and the short "Welcome to ORA World" film
 * the sales team sends to prospects. Click to load: nothing is fetched from kuula.co or YouTube until asked.
 */
export function HomeTourStage({ vrUrl, filmId, poster, filmPoster, locale }: { vrUrl: string; filmId: string | null; poster: ImageRef; filmPoster: ImageRef; locale: Locale }) {
  const t = useTranslations("homeTour");
  const [mode, setMode] = useState<Mode>("tour");
  const [loaded, setLoaded] = useState<Record<Mode, boolean>>({ tour: false, film: false });
  const on = loaded[mode];
  const start = () => setLoaded((l) => ({ ...l, [mode]: true }));

  return (
    <div>
      {filmId && (
        <div role="tablist" aria-label={t("views")} className="mb-4 inline-flex rounded-full bg-basalt-soft p-1 ring-1 ring-bone/10">
          {(["tour", "film"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn("min-h-10 rounded-full px-5 text-[14px] font-semibold transition-colors", mode === m ? "bg-bone text-basalt" : "text-bone/80 hover:text-bone")}
            >
              {m === "tour" ? t("tabTour") : t("tabFilm")}
            </button>
          ))}
        </div>
      )}
      <div className="frame frame-lg relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8]" data-testid="home-vr-tour" role="tabpanel">
        {on && mode === "tour" && (
          <iframe src={vrUrl} title={t("frameTitle")} className="absolute inset-0 h-full w-full border-0" allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen" allowFullScreen />
        )}
        {on && mode === "film" && filmId && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${filmId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={t("filmTitle")}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}
        {!on && (
          <>
            <Picture
              image={mode === "tour" ? poster : filmPoster}
              locale={locale}
              fill
              rounded="none"
              reveal={false}
              sizes="(max-width: 1400px) 96vw, 1340px"
              className="absolute inset-0 h-full w-full !aspect-auto"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-basalt/35 p-6 text-center text-bone">
              <button type="button" onClick={start} className="group inline-flex flex-col items-center gap-3" data-track={mode === "tour" ? "home_vr_tour" : "home_intro_film"}>
                <span className="relative inline-flex size-20 items-center justify-center rounded-full bg-bone/95 text-brass-ink shadow-lift transition-transform duration-300 group-hover:scale-105 md:size-24">
                  <Play width={30} height={30} />
                </span>
                <span className="pill pill-brass min-h-12 px-6">{mode === "tour" ? t("start") : t("play")}</span>
              </button>
              <p className="small max-w-sm text-bone/90">{mode === "tour" ? t("note") : t("filmNote")}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
