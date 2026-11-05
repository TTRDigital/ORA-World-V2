"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { Picture } from "@/components/ui/Picture";
import { RenderCarousel } from "@/components/place/RenderCarousel";
import { Lightbox } from "@/components/gallery/Lightbox";
import { Grid, List } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/** Collection gallery with a Grid | Single view toggle (radiogroup), lightbox on click. */
export function CollectionGallery({ images, locale, label }: { images: ImageRef[]; locale: Locale; label: string }) {
  const tr = useTranslations("pages.residences");
  const tg = useTranslations("gallery");
  const [view, setView] = useState<"grid" | "single">("grid");
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="label">{tr("gallery")}</p>
        <div role="radiogroup" aria-label={tr("viewToggle")} className="flex gap-1" onKeyDown={(e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") setView((v) => (v === "grid" ? "single" : "grid")); }}>
          <button type="button" role="radio" aria-checked={view === "grid"} onClick={() => setView("grid")} className={cn("chip px-3", view === "grid" && "is-active")} aria-label={tr("grid")}><Grid /></button>
          <button type="button" role="radio" aria-checked={view === "single"} onClick={() => setView("single")} className={cn("chip px-3", view === "single" && "is-active")} aria-label={tr("single")}><List /></button>
        </div>
      </div>
      {view === "grid" ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="collection-grid">
          {images.map((img, i) => (
            <li key={img.src} data-reveal style={{ "--reveal-delay": `${i * 50}ms` } as React.CSSProperties}>
              <button type="button" onClick={() => setOpen(i)} aria-label={tg("open", { n: i + 1 })} className="card lift ambient-zoom block w-full overflow-hidden text-left">
                <Picture image={img} locale={locale} ratio="16/10" rounded="none" reveal={false} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <RenderCarousel images={images} locale={locale} label={label} />
      )}
      {open !== null && <Lightbox items={images.map((img) => ({ image: img, caption: img.alt[locale] }))} index={open} onClose={() => setOpen(null)} onIndex={setOpen} locale={locale} />}
    </div>
  );
}
