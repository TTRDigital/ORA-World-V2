"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { HomeContent, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cn } from "@/lib/utils";
import { Picture } from "@/components/ui/Picture";
import { ArrowLeft, ArrowRight, Close } from "@/components/ui/Icons";

type Room = HomeContent["rooms"]["rooms"][number];
const DRAG_THRESHOLD = 60;

export function RoomTourStage({ locale, rooms }: { locale: Locale; rooms: Room[] }) {
  const tx = useTranslations("rooms");
  const tc = useTranslations("common");
  const total = rooms.length;
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0, 1 % total, (total - 1) % total]));
  const [openSpot, setOpenSpot] = useState<number | null>(null);
  const [landed, setLanded] = useState(false);
  const [dx, setDx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef<{ x: number; id: number } | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const room = rooms[index];

  const go = useCallback(
    (next: number) => {
      const n = (next + total) % total;
      if (n === index) return;
      setOpenSpot(null);
      setLanded(false);
      setIndex(n);
      setVisited((v) => new Set([...v, n, (n + 1) % total, (n - 1 + total) % total]));
    },
    [index, total],
  );

  // Hotspots appear 300ms after the image lands.
  useEffect(() => {
    const id = window.setTimeout(() => setLanded(true), 300);
    return () => clearTimeout(id);
  }, [index]);

  // Keep the active tab centred on the mobile rail. Scrolls the rail only (never the window) and skips the first
  // render: scrollIntoView here used to pull the whole page down to the tour on load.
  const firstRail = useRef(true);
  useEffect(() => {
    if (firstRail.current) {
      firstRail.current = false;
      return;
    }
    const rail = tabsRef.current;
    const tab = rail?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!rail || !tab) return;
    const left = tab.offsetLeft - (rail.clientWidth - tab.clientWidth) / 2;
    rail.scrollTo({ left, behavior: document.documentElement.classList.contains("reduced-motion") ? "auto" : "smooth" });
  }, [index]);

  useEffect(() => {
    if (openSpot === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSpot(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openSpot]);

  const onStageKey = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, [role=group]")) return;
    dragging.current = { x: e.clientX, id: e.pointerId };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const d = e.clientX - dragging.current.x;
    setDx(Math.max(-140, Math.min(140, d * 0.6)));
  };
  const onPointerUp = () => {
    if (!dragging.current) return;
    const d = dx / 0.6;
    dragging.current = null;
    setIsDragging(false);
    setDx(0);
    if (d <= -DRAG_THRESHOLD) go(index + 1);
    else if (d >= DRAG_THRESHOLD) go(index - 1);
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : total - 1)) % total;
    go(n);
    (tabsRef.current?.children[n] as HTMLElement)?.focus();
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="mx-auto max-w-[1100px]">
      {/* Stage */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={tx("rail")}
        tabIndex={0}
        onKeyDown={onStageKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="frame frame-lg relative aspect-[4/3] cursor-grab rounded-[20px] active:cursor-grabbing md:aspect-[16/10] md:rounded-[24px]"
        style={{ touchAction: "pan-y", transform: dx ? `translateX(${dx}px)` : undefined, transition: isDragging ? "none" : "transform 500ms var(--ease-out)" }}
      >
        {rooms.map((r, i) => {
          const active = i === index;
          if (!visited.has(i)) return null;
          return (
            <div
              key={r.slug}
              aria-hidden={!active}
              className={cn("absolute inset-0 transition-opacity duration-[600ms] [transition-timing-function:var(--ease-out)]", active ? "opacity-100" : "pointer-events-none opacity-0")}
            >
              <Picture
                image={r.image}
                locale={locale}
                sizes="(max-width: 768px) 92vw, (max-width: 1200px) 90vw, 1100px"
                reveal={false}
                rounded="none"
                className="h-full rounded-none !aspect-auto"
                imgClassName={cn("transition-transform duration-[900ms] [transition-timing-function:var(--ease-out)]", active ? "scale-100" : "scale-[1.04]")}
                priority={i === 0}
              />
            </div>
          );
        })}

        {/* Hotspots for the active room */}
        {room.hotspots.map((h, i) => {
          const open = openSpot === i;
          const flipX = h.x > 58;
          const flipY = h.y > 55;
          const title = t(h.title, locale);
          return (
            <div key={`${room.slug}-${i}`} className="pointer-events-none absolute inset-0">
              <button
                type="button"
                aria-label={tx("hotspot", { title })}
                aria-expanded={open}
                aria-controls={`spot-${room.slug}-${i} spot-m-${room.slug}-${i}`}
                onClick={() => setOpenSpot(open ? null : i)}
                className={cn(
                  "pointer-events-auto absolute -mt-[22px] -ml-[22px] flex size-11 items-center justify-center rounded-full transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-out)]",
                  landed ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
                style={{ left: `${h.x}%`, top: `${h.y}%`, transitionDelay: landed ? `${i * 140}ms` : "0ms" }}
              >
                <span className={cn("pulse relative flex size-6 items-center justify-center rounded-full bg-bone/95 shadow-[0_2px_10px_rgb(28_27_25/0.35)]", open && "bg-brass-light")}>
                  <span className="size-2 rounded-full bg-brass" />
                </span>
              </button>
              <div
                id={`spot-${room.slug}-${i}`}
                role="group"
                aria-label={title}
                hidden={!open}
                className="fade-in pointer-events-auto absolute z-10 hidden w-[260px] rounded-2xl bg-bone p-4 text-charcoal shadow-lift sm:block sm:top-[var(--spot-top,auto)] sm:right-[var(--spot-right,auto)] sm:bottom-[var(--spot-bottom,auto)] sm:left-[var(--spot-left,auto)]"
                style={{
                  ...(flipX ? { ["--spot-right" as string]: `calc(${100 - h.x}% + 14px)` } : { ["--spot-left" as string]: `calc(${h.x}% + 14px)` }),
                  ...(flipY ? { ["--spot-bottom" as string]: `calc(${100 - h.y}% + 14px)` } : { ["--spot-top" as string]: `calc(${h.y}% + 14px)` }),
                }}
                data-anchor={`${flipX ? "r" : "l"}${flipY ? "b" : "t"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[15px] font-semibold">{title}</p>
                  <button type="button" onClick={() => setOpenSpot(null)} aria-label={tc("close")} className="-mt-1 -mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full hover:bg-bone-deep">
                    <Close width={14} height={14} />
                  </button>
                </div>
                <p className="small mt-1 text-charcoal-soft">{t(h.text, locale)}</p>
              </div>
            </div>
          );
        })}

        {/* Counter */}
        <p className="pointer-events-none absolute top-4 left-4 rounded-full bg-basalt/55 px-3 py-1 text-bone backdrop-blur-sm md:top-5 md:left-5">
          <span key={index} className="numeral fade-in inline-block text-[22px] md:text-[26px]">{pad(index + 1)}</span>
          <span className="numeral mx-1 text-[14px] text-bone/60">/</span>
          <span className="numeral text-[14px] text-bone/60">{pad(total)}</span>
        </p>
        <p className="pointer-events-none absolute right-4 bottom-4 hidden rounded-full bg-basalt/55 px-3 py-1.5 text-[12px] text-bone/80 backdrop-blur-sm md:block">{tx("dragHint")}</p>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {tx("room", { n: index + 1, total, name: t(room.name, locale) })}
      </p>

      {/* Phones: the open detail sits below the image, so it never covers a hotspot. */}
      {room.hotspots.map((h, i) =>
        openSpot === i ? (
          <div key={`m-${room.slug}-${i}`} id={`spot-m-${room.slug}-${i}`} role="group" aria-label={t(h.title, locale)} className="fade-in mt-3 rounded-2xl bg-bone p-4 text-charcoal sm:hidden">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[15px] font-semibold">{t(h.title, locale)}</p>
              <button type="button" onClick={() => setOpenSpot(null)} aria-label={tc("close")} className="-mt-1 -mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-bone-deep">
                <Close width={14} height={14} />
              </button>
            </div>
            <p className="small mt-1 text-charcoal-soft">{t(h.text, locale)}</p>
          </div>
        ) : null,
      )}

      {/* Caption bar: this room, its published details as chips, and a peek at the next room. */}
      <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-[1fr_auto] md:items-end">
        <div key={room.slug} className="fade-in min-w-0">
          <p className="label">{tx("inThisRoom")}</p>
          <h3 className="display-s mt-1 text-bone">{t(room.name, locale)}</h3>
          <div role="group" aria-label={tx("details")} className="mt-3 flex flex-wrap gap-2">
            {room.hotspots.map((h, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={openSpot === i}
                onClick={() => setOpenSpot(openSpot === i ? null : i)}
                className="chip min-h-9 gap-2"
              >
                <span aria-hidden className={cn("size-1.5 rounded-full", openSpot === i ? "bg-basalt" : "bg-brass-light")} />
                {t(h.title, locale)}
              </button>
            ))}
          </div>
        </div>
        {total > 1 && (
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="group flex items-center gap-3 rounded-[18px] bg-basalt-soft p-2 pr-4 text-left ring-1 ring-brass-light/15 transition-colors hover:ring-brass-light/40"
          >
            <span className="relative block h-[60px] w-[96px] shrink-0 overflow-hidden rounded-[12px] bg-travertine">
              <Picture image={rooms[(index + 1) % total].image} locale={locale} sizes="96px" reveal={false} rounded="none" ratio="8/5" className="absolute inset-0 h-full w-full rounded-none" imgClassName="transition-transform duration-700 group-hover:scale-105" />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] text-bone/70">{tx("next")}</span>
              <span className="block truncate text-[15px] font-semibold text-bone">{t(rooms[(index + 1) % total].name, locale)}</span>
            </span>
            <ArrowRight className="ml-1 shrink-0 text-brass-light transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
      </div>

      {/* Rail */}
      <div className="mt-4 flex items-center gap-3 md:mt-6">
        <button type="button" onClick={() => go(index - 1)} aria-label={tc("previous")} className="pill pill-ghost size-11 shrink-0 px-0">
          <ArrowLeft />
        </button>
        <div className="min-w-0 flex-1">
          <div ref={tabsRef} role="tablist" aria-label={tx("rail")} className="no-scrollbar flex gap-1 overflow-x-auto">
            {rooms.map((r, i) => (
              <button
                key={r.slug}
                role="tab"
                aria-selected={i === index}
                tabIndex={i === index ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn("hairline min-h-11 shrink-0 px-3 text-[14px] font-semibold transition-colors", i === index ? "is-active text-bone" : "text-bone/55 hover:text-bone/85")}
              >
                {t(r.name, locale)}
              </button>
            ))}
          </div>
          <div className="mt-1 h-px w-full overflow-hidden rounded-full bg-brass-light/20" aria-hidden>
            <div className="h-full bg-brass-light transition-[width] duration-500 [transition-timing-function:var(--ease-out)]" style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label={tc("next")} className="pill pill-ghost size-11 shrink-0 px-0">
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
