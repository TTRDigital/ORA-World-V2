"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";

export type WallItem = { key: string; title: string; group: "residences" | "amenities" | "architecture" | "finishes" | "lifestyle"; image: ImageRef };

const GROUPS = ["all", "architecture", "amenities", "residences", "finishes", "lifestyle"] as const;
type Group = (typeof GROUPS)[number];

/**
 * The Tesoro del Mar gallery (client, 17 Nov: "a gallery at the top of the page, showing all the images and everything
 * from the presentation"): every render (18 Nov: the still images, not the films), filtered by kind, in a calm
 * masonry. A tile opens the full-screen view with arrows, keys and swipe.
 */
export function GalleryWall({ items, locale, labels }: { items: WallItem[]; locale: Locale; labels: Record<Group | "close" | "prev" | "next", string> }) {
  const [group, setGroup] = useState<Group>("all");
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);
  const shown = useMemo(() => items.filter((it) => group === "all" || it.group === group), [items, group]);
  const pad = (n: number) => String(n).padStart(2, "0");

  const show = (i: number) => {
    setOpen(i);
    if (!dialog.current?.open) dialog.current?.showModal();
  };
  const close = useCallback(() => {
    dialog.current?.close();
    setOpen(null);
  }, []);
  const step = useCallback((d: number) => setOpen((o) => (o == null ? o : (o + d + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    const dl = dialog.current;
    if (!dl) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setOpen(null);
    dl.addEventListener("keydown", onKey);
    dl.addEventListener("close", onClose);
    return () => {
      dl.removeEventListener("keydown", onKey);
      dl.removeEventListener("close", onClose);
    };
  }, [step]);

  const cur = open == null ? null : shown[open];
  const alt = (im: ImageRef) => im.alt[locale] || im.alt.en;

  return (
    <>
      <div role="group" aria-label={labels.all} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={group === g}
            onClick={() => setGroup(g)}
            className={cn(
              "min-h-10 shrink-0 rounded-full px-4 text-[11px] font-semibold tracking-[0.2em] whitespace-nowrap uppercase ring-1 transition-colors",
              group === g ? "bg-charcoal text-bone ring-charcoal" : "text-charcoal ring-travertine-deep hover:ring-charcoal",
            )}
          >
            {labels[g]}
            <span className={cn("ml-2 tabular-nums", group === g ? "text-bone/75" : "text-charcoal-soft")}>{g === "all" ? items.length : items.filter((it) => it.group === g).length}</span>
          </button>
        ))}
      </div>

      <ul className="mt-8 columns-1 gap-4 sm:columns-2 md:mt-10 md:gap-5 lg:columns-3">
        {shown.map((it, i) => (
          <li key={it.key} className="mb-4 break-inside-avoid md:mb-5">
            <button type="button" onClick={() => show(i)} className="group block w-full text-left">
              <span className="relative block overflow-hidden rounded-[16px] bg-travertine" style={{ aspectRatio: `${it.image.width} / ${it.image.height}` }} data-focal={it.image.focal}>
                <Image
                  src={it.image.src}
                  alt={alt(it.image)}
                  fill
                  sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 50vw, 420px"
                  quality={80}
                  className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.03]"
                  style={{ objectPosition: it.image.focal }}
                />
              </span>
              <span className="mt-2.5 block text-[11px] tracking-[0.2em] text-charcoal-soft uppercase transition-colors group-hover:text-charcoal">{it.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={cur?.title}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-basalt p-0 text-bone backdrop:bg-basalt/90"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        {cur && (
          <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
              <span className="text-[11px] tracking-[0.22em] text-bone/70 tabular-nums">
                {pad((open ?? 0) + 1)} / {pad(shown.length)}
              </span>
              <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full ring-1 ring-bone/30 hover:ring-bone" aria-label={labels.close}>
                <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden>
                  <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
            <div className="relative mx-auto h-full w-full max-w-[1600px] px-3 md:px-20">
              <Image key={cur.key} src={cur.image.src} alt={alt(cur.image)} fill sizes="100vw" quality={85} className="object-contain" />
              <button type="button" onClick={() => step(-1)} aria-label={labels.prev} className="absolute top-1/2 left-2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-bone/10 ring-1 ring-bone/30 backdrop-blur-sm hover:bg-bone/20 md:left-5 md:grid">
                ←
              </button>
              <button type="button" onClick={() => step(1)} aria-label={labels.next} className="absolute top-1/2 right-2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-bone/10 ring-1 ring-bone/30 backdrop-blur-sm hover:bg-bone/20 md:right-5 md:grid">
                →
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
              <p className="font-[family-name:var(--font-display)] text-[20px] md:text-[24px]">{cur.title}</p>
              <span className="flex gap-2 md:hidden">
                <button type="button" onClick={() => step(-1)} aria-label={labels.prev} className="grid size-11 place-items-center rounded-full ring-1 ring-bone/30">
                  ←
                </button>
                <button type="button" onClick={() => step(1)} aria-label={labels.next} className="grid size-11 place-items-center rounded-full ring-1 ring-bone/30">
                  →
                </button>
              </span>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
