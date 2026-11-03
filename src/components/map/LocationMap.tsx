"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { RailPoi } from "@/components/home/IslandRail";
import type { MapSite } from "./MapLoader";
import { cn } from "@/lib/utils";

const STYLE = "https://tiles.openfreemap.org/styles/liberty";
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** MapLibre GL with OpenFreeMap tiles restyled to the ORA palette, a brass site marker and POI markers. */
export function LocationMap({ site, pois }: { site: MapSite; pois: RailPoi[] }) {
  const t = useTranslations("island");
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [scope, setScope] = useState<"dorado" | "island">("dorado");

  useEffect(() => {
    if (!el.current) return;
    const map = new maplibregl.Map({
      container: el.current,
      style: STYLE,
      center: [site.lng, site.lat],
      zoom: 11,
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      restyle(map);
      const siteEl = document.createElement("div");
      siteEl.className = "relative size-[14px] rounded-full bg-brass shadow-[0_0_0_2px_var(--color-bone)]";
      const pulse = document.createElement("span");
      pulse.className = "pulse absolute inset-0 rounded-full";
      siteEl.appendChild(pulse);
      new maplibregl.Marker({ element: siteEl }).setLngLat([site.lng, site.lat]).setPopup(new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(`<strong>${esc(site.name)}</strong>`)).addTo(map);
      for (const p of pois) {
        const d = document.createElement("div");
        d.className = "size-[10px] rounded-full bg-sea-ink shadow-[0_0_0_2px_var(--color-bone)] cursor-pointer";
        d.setAttribute("aria-label", p.name);
        const time = p.minutes == null ? "" : `${p.minutes} min${p.confirmed ? "" : " · approx."}`;
        new maplibregl.Marker({ element: d }).setLngLat([p.lng, p.lat]).setPopup(new maplibregl.Popup({ offset: 10, closeButton: false }).setHTML(`<strong>${esc(p.name)}</strong>${time ? `<br/><span style="color:#5A5650">${esc(time)}</span>` : ""}`)).addTo(map);
      }
      fit(map, site, pois, "dorado", false);
      setReady(true);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // The map is created once; props are stable for the module's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeScope = (s: "dorado" | "island") => {
    setScope(s);
    if (mapRef.current) fit(mapRef.current, site, pois, s, true);
  };

  return (
    <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
      <div ref={el} className="h-full w-full" />
      <div role="group" aria-label={t("mapTitle")} className="absolute top-3 left-3 flex gap-2">
        <button type="button" className="chip shadow-lift" aria-pressed={scope === "dorado"} onClick={() => changeScope("dorado")}>
          {t("zoomDorado")}
        </button>
        <button type="button" className="chip shadow-lift" aria-pressed={scope === "island"} onClick={() => changeScope("island")}>
          {t("zoomIsland")}
        </button>
      </div>
    </div>
  );
}

function fit(map: maplibregl.Map, site: MapSite, pois: RailPoi[], scope: "dorado" | "island", animate: boolean) {
  const near = scope === "island" ? pois : pois.filter((p) => Math.abs(p.lat - site.lat) < 0.12 && Math.abs(p.lng - site.lng) < 0.12);
  const b = new maplibregl.LngLatBounds([site.lng, site.lat], [site.lng, site.lat]);
  for (const p of near) b.extend([p.lng, p.lat]);
  map.fitBounds(b, { padding: { top: 70, bottom: 40, left: 40, right: 60 }, maxZoom: 13, duration: animate ? 1200 : 0 });
}

/** Restyle OpenFreeMap "liberty" to the palette. Unknown layers are left alone; nothing here can throw. */
function restyle(map: maplibregl.Map) {
  const layers = map.getStyle()?.layers ?? [];
  const set = (id: string, prop: string, value: unknown) => {
    try {
      map.setPaintProperty(id, prop, value as never);
    } catch {}
  };
  for (const layer of layers) {
    const id = layer.id.toLowerCase();
    try {
      if (layer.type === "background") set(layer.id, "background-color", "#F7F3EC");
      else if (layer.type === "fill") {
        if (id.includes("water")) set(layer.id, "fill-color", "#D9E9EE");
        else if (/park|wood|forest|grass|green|cemetery|golf|nature|landcover/.test(id)) {
          set(layer.id, "fill-color", "#9AA685");
          set(layer.id, "fill-opacity", 0.4);
        } else if (id.includes("building")) {
          set(layer.id, "fill-color", "#EFE9DF");
          set(layer.id, "fill-outline-color", "#C9B99E");
        } else if (/residential|landuse|commercial|industrial|sand|beach|farmland/.test(id)) {
          set(layer.id, "fill-color", id.includes("sand") || id.includes("beach") ? "#EFE9DF" : "#F2EDE4");
        } else set(layer.id, "fill-color", "#F2EDE4");
      } else if (layer.type === "fill-extrusion") {
        set(layer.id, "fill-extrusion-color", "#EFE9DF");
      } else if (layer.type === "line") {
        if (/waterway|river|stream|canal/.test(id)) {
          set(layer.id, "line-color", "#3F7F98");
          set(layer.id, "line-opacity", 0.5);
        } else if (/motorway|trunk|primary|highway/.test(id)) set(layer.id, "line-color", id.includes("casing") ? "#C9B99E" : "#E3D9C8");
        else if (/road|street|secondary|tertiary|minor|service|path|transport|rail|bridge|tunnel|link/.test(id)) set(layer.id, "line-color", id.includes("casing") ? "#D9CDB8" : "#E3D9C8");
        else if (/boundary|admin/.test(id)) {
          set(layer.id, "line-color", "#C9B99E");
          set(layer.id, "line-opacity", 0.6);
        } else set(layer.id, "line-color", "#E3D9C8");
      } else if (layer.type === "symbol") {
        set(layer.id, "text-color", "#5A5650");
        set(layer.id, "text-halo-color", "#F7F3EC");
        set(layer.id, "text-halo-width", 1.2);
        set(layer.id, "icon-opacity", 0.55);
      }
    } catch {}
  }
}
