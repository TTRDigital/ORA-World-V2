"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { RailPoi } from "@/components/home/IslandRail";
import { Pin } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const LocationMap = dynamic(() => import("./LocationMap").then((m) => m.LocationMap), { ssr: false });

export type MapSite = { lat: number; lng: number; name: string };

/**
 * Travertine placeholder with a line sketch of the north coast and an "Open the map" pill. MapLibre and the
 * tiles are only fetched after the click.
 */
export function MapLoader({ site, pois }: { site: MapSite; pois: RailPoi[] }) {
  const t = useTranslations("island");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  const published = pois.filter((p) => p.confirmed).length;
  return (
    <div
      role="region"
      aria-label={t("mapTitle")}
      className={cn(
        "frame frame-lg relative bg-travertine transition-[height] duration-700 [transition-timing-function:var(--ease-out)]",
        // Closed: a compact strip that invites the click. Open: a full 4:3 / 16:10 map.
        open ? "aspect-[4/3] md:aspect-[16/10]" : "h-[220px] md:h-[200px]",
      )}
    >
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group absolute inset-0 flex w-full items-end p-5 text-left md:items-center md:p-8"
          data-track="map_open"
        >
          <CoastSketch />
          {/* Scrim so the sketch never runs through the text: bottom-up on phones, left-to-right on desktop. */}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-travertine from-35% via-travertine/80 to-transparent md:bg-gradient-to-r md:from-travertine md:from-25% md:via-travertine/70 md:to-transparent" />
          <span className="relative flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span>
              <span className="display-s block">{t("mapTitle")}</span>
              <span className="small mt-1 block text-charcoal-soft">
                {t("mapSummary", { total: pois.length + 1, published })}
              </span>
            </span>
            <span className="pill pill-basalt min-h-12 gap-2 self-start px-6 shadow-lift transition-transform duration-500 group-hover:-translate-y-0.5 md:self-auto">
              <Pin className="text-brass-light" />
              {tc("openMap")}
            </span>
          </span>
          <span className="visually-hidden">{t("mapClosed")}</span>
        </button>
      )}
      {open && <LocationMap site={site} pois={pois} />}
    </div>
  );
}

/** Stylised line sketch of Puerto Rico's north coast around Dorado (decorative). */
function CoastSketch() {
  return (
    <svg
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="absolute inset-0 h-full w-full text-sand transition-transform duration-[1400ms] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.03]"
      fill="none"
    >
      <path
        d="M-20 170 C 80 150, 160 190, 260 175 S 420 130, 520 160 S 700 200, 820 170 S 960 140, 1040 165"
        stroke="currentColor"
        strokeWidth="2"
        opacity=".7"
      />
      <path
        d="M-20 200 C 90 185, 170 215, 270 205 S 430 165, 530 190 S 710 225, 830 200 S 970 175, 1040 195"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".35"
      />
      <path
        d="M-20 240 C 100 230, 180 250, 280 245 S 440 215, 540 235 S 720 260, 840 240 S 980 220, 1040 235"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".2"
      />
      <path
        d="M120 300 C 200 280, 260 330, 340 310 S 480 270, 560 300 S 700 340, 800 310"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".3"
        strokeDasharray="6 8"
      />
      <path
        d="M-20 90 C 100 70, 200 110, 320 95 S 560 60, 700 90 S 900 110, 1040 85"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".18"
      />
      <g className="text-brass">
        <circle cx="300" cy="188" r="22" stroke="currentColor" strokeWidth="1" opacity=".35" />
        <circle cx="300" cy="188" r="9" fill="currentColor" opacity=".9" />
        <circle cx="300" cy="188" r="14" stroke="currentColor" strokeWidth="1.5" opacity=".6" />
      </g>
      <g stroke="currentColor" strokeWidth="1" opacity=".5">
        <circle cx="690" cy="178" r="4" />
        <circle cx="560" cy="158" r="4" />
        <circle cx="400" cy="165" r="4" />
      </g>
    </svg>
  );
}
