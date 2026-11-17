"use client";

import { useEffect, useRef, useState } from "react";
import type maplibregl from "maplibre-gl";
import { cn } from "@/lib/utils";

export type Place = { slug: string; name: string; time: string; lat: number; lng: number };

/**
 * The location, short and clean (client, 17 Nov: "I like the location on the other site better; have that, but short
 * and clean"): the ORA-toned map on the left, five places with their travel time on the right. Pick a place and the
 * map flies to it. MapLibre and the tiles load only when the section comes near the screen.
 */
export function LocationExplorer({ site, places, note, mapLabel }: { site: { lat: number; lng: number; name: string }; places: Place[]; note: string; mapLabel: string }) {
  const box = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popups = useRef<Record<string, maplibregl.Popup>>({});
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const host = box.current;
    if (!host) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || map.current) return;
        io.disconnect();
        const [{ default: ml }, { restyle }] = await Promise.all([import("maplibre-gl"), import("@/components/map/LocationMap")]);
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (cancelled || !el.current) return;
        const m = new ml.Map({ container: el.current, style: "https://tiles.openfreemap.org/styles/liberty", center: [site.lng, site.lat], zoom: 10, cooperativeGestures: true, attributionControl: { compact: true } });
        map.current = m;
        m.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
        m.on("load", () => {
          restyle(m);
          // The credit line starts folded into its small "i" button, so it never covers the map.
          el.current?.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
          const s = document.createElement("div");
          s.className = "relative size-[16px] rounded-full bg-brass shadow-[0_0_0_3px_var(--color-bone)]";
          const pulse = document.createElement("span");
          pulse.className = "pulse absolute inset-0 rounded-full";
          s.appendChild(pulse);
          // The site's name, always shown beside its marker.
          const tag = document.createElement("span");
          tag.className = "absolute top-1/2 left-[22px] -translate-y-1/2 rounded-full bg-bone/95 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] whitespace-nowrap text-charcoal uppercase shadow-[0_4px_14px_-6px_rgb(44_36_22/0.4)]";
          tag.textContent = site.name;
          s.appendChild(tag);
          new ml.Marker({ element: s }).setLngLat([site.lng, site.lat]).setPopup(new ml.Popup({ offset: 14, closeButton: false }).setText(site.name)).addTo(m);
          const b = new ml.LngLatBounds([site.lng, site.lat], [site.lng, site.lat]);
          for (const p of places) {
            const d = document.createElement("div");
            d.className = "size-[11px] cursor-pointer rounded-full bg-bone shadow-[0_0_0_2px_var(--color-brass)]";
            const pop = new ml.Popup({ offset: 10, closeButton: false });
            const content = document.createElement("div");
            const strong = document.createElement("strong");
            strong.textContent = p.name;
            const span = document.createElement("div");
            span.style.color = "#5E5242";
            span.textContent = p.time;
            content.append(strong, span);
            pop.setDOMContent(content);
            popups.current[p.slug] = pop;
            new ml.Marker({ element: d }).setLngLat([p.lng, p.lat]).setPopup(pop).addTo(m);
            b.extend([p.lng, p.lat]);
          }
          // The coast sits in the upper part of the frame, so the map shows land rather than open sea.
          const h = el.current?.clientHeight ?? 400;
          m.fitBounds(b, { padding: { top: 40, bottom: 40, left: 50, right: 70 }, duration: 0 });
          // Once the map has settled (sized and drawn), move the view south so the coast sits near the top.
          m.once("idle", () => {
            const mid = m.project(m.getCenter());
            m.jumpTo({ center: m.unproject([mid.x, mid.y + Math.round(h * 0.22)]) });
            setReady(true);
          });
        });
      },
      { rootMargin: "300px" },
    );
    io.observe(host);
    return () => {
      cancelled = true;
      io.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, [site, places]);

  const pick = (p: Place) => {
    setActive(p.slug);
    const m = map.current;
    if (!m) return;
    Object.values(popups.current).forEach((x) => x.remove());
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    m.flyTo({ center: [p.lng, p.lat], zoom: Math.max(m.getZoom(), 11.5), duration: still ? 0 : 1400 });
    popups.current[p.slug]?.setLngLat([p.lng, p.lat]).addTo(m);
  };

  return (
    <div ref={box} className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
      <div role="region" aria-label={mapLabel} className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-travertine ring-1 ring-travertine-deep/60 lg:aspect-[16/11]">
        {/* MapLibre makes its container position: relative, so the container sits inside an absolute wrapper. */}
        <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
          <div ref={el} className="h-full w-full" />
        </div>
      </div>
      <div>
        <ul className="border-t border-travertine-deep">
          {places.map((p) => (
            <li key={p.slug} className="border-b border-travertine-deep">
              <button
                type="button"
                onClick={() => pick(p)}
                aria-pressed={active === p.slug}
                className={cn("flex w-full items-baseline justify-between gap-4 py-4 text-left transition-colors", active === p.slug ? "text-brass-ink" : "text-charcoal hover:text-brass-ink")}
              >
                <span className="text-[17px] leading-snug">{p.name}</span>
                <span className="shrink-0 text-[11px] font-semibold tracking-[0.18em] whitespace-nowrap uppercase">{p.time}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] text-charcoal-soft">{note}</p>
      </div>
    </div>
  );
}
