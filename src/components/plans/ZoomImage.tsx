"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { Minus, Plus } from "@/components/ui/Icons";

/** Zoomable, pannable plan drawing with buttons, wheel, drag and keyboard (+ / - / arrows). */
export function ZoomImage({ image, locale }: { image: ImageRef; locale: Locale }) {
  const t = useTranslations("plans");
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const clamp = (s: number) => Math.min(4, Math.max(1, s));
  const onKey = (e: React.KeyboardEvent) => {
    const step = 40;
    if (e.key === "+" || e.key === "=") setScale((s) => clamp(s + 0.5));
    else if (e.key === "-") setScale((s) => clamp(s - 0.5));
    else if (e.key === "ArrowLeft") setPos((p) => ({ ...p, x: p.x + step }));
    else if (e.key === "ArrowRight") setPos((p) => ({ ...p, x: p.x - step }));
    else if (e.key === "ArrowUp") setPos((p) => ({ ...p, y: p.y + step }));
    else if (e.key === "ArrowDown") setPos((p) => ({ ...p, y: p.y - step }));
    else if (e.key === "0") { setScale(1); setPos({ x: 0, y: 0 }); }
    else return;
    e.preventDefault();
  };
  return (
    <div>
      <div
        role="group"
        aria-label={t("zoom")}
        tabIndex={0}
        onKeyDown={onKey}
        onWheel={(e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setScale((s) => clamp(s - e.deltaY / 400)); } }}
        onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
        onPointerMove={(e) => { if (drag.current && scale > 1) setPos({ x: drag.current.px + (e.clientX - drag.current.x), y: drag.current.py + (e.clientY - drag.current.y) }); }}
        onPointerUp={() => (drag.current = null)}
        className="frame frame-lg touch-none select-none bg-bone"
        style={{ aspectRatio: "4/3", cursor: scale > 1 ? "grab" : "default" }}
      >
        <Image src={image.src} alt={image.alt[locale]} fill sizes="(max-width: 1024px) 92vw, 60vw" quality={80} unoptimized={image.src.endsWith(".svg")} className="object-contain transition-transform duration-200" style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, objectPosition: image.focal }} />
      </div>
      <div className="mt-3 flex items-center gap-2" role="group" aria-label={t("zoom")}>
        <button type="button" className="chip" onClick={() => setScale((s) => clamp(s - 0.5))} aria-label={t("zoomOut")}><Minus /></button>
        <span className="tabular w-14 text-center text-[14px] font-semibold" aria-live="polite">{Math.round(scale * 100)}%</span>
        <button type="button" className="chip" onClick={() => setScale((s) => clamp(s + 0.5))} aria-label={t("zoomIn")}><Plus /></button>
        <button type="button" className="chip" onClick={() => { setScale(1); setPos({ x: 0, y: 0 }); }}>{t("reset")}</button>
      </div>
    </div>
  );
}
