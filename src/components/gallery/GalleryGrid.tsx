"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { GalleryImage, Locale } from "@/content/types";
import { Picture } from "@/components/ui/Picture";
import { Lightbox } from "./Lightbox";

const CATS = ["exteriors", "interiors", "amenities"] as const;

/** Masonry (CSS columns) with filter chips and a keyboard lightbox. Tower renders stay 16:10, never cropped from the top. */
export function GalleryGrid({ images, locale }: { images: GalleryImage[]; locale: Locale }) {
  const t = useTranslations("gallery");
  const tc = useTranslations("common");
  const [cat, setCat] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo(() => images.filter((g) => cat === "all" || g.category === cat), [images, cat]);
  useEffect(() => { window.dispatchEvent(new Event("ora2:reveal")); }, [list]);
  const counts = Object.fromEntries(CATS.map((c) => [c, images.filter((g) => g.category === c).length]));
  return (
    <div>
      <div role="group" aria-label={t("filters")} className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        <button type="button" className="chip shrink-0" aria-pressed={cat === "all"} onClick={() => setCat("all")}>{tc("all")} <span className="count">{images.length}</span></button>
        {CATS.map((c) => (
          <button key={c} type="button" className="chip shrink-0" aria-pressed={cat === c} onClick={() => setCat(c)}>{t(`categories.${c}`)} <span className="count">{counts[c]}</span></button>
        ))}
      </div>
      <ul className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4 [&>li]:break-inside-avoid" data-testid="gallery">
        {list.map((g, i) => (
          <li key={g.id} data-reveal style={{ "--reveal-delay": `${(i % 9) * 40}ms` } as React.CSSProperties}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`${g.caption[locale]} · ${t("open", { n: i + 1 })}`} className="card lift ambient-zoom block w-full overflow-hidden text-left">
              <Picture image={g.image} locale={locale} ratio={g.image.width / g.image.height > 1.3 ? "16/10" : "4/5"} rounded="none" reveal={false} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw" />
              <span className="small block px-4 py-3 text-charcoal-soft">{g.caption[locale]}</span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox items={list.map((g) => ({ image: g.image, caption: g.caption[locale] }))} index={open} onClose={() => setOpen(null)} onIndex={setOpen} locale={locale} />}
    </div>
  );
}
