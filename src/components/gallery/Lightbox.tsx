"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { ArrowLeft, ArrowRight, Close } from "@/components/ui/Icons";

type Item = { image: ImageRef; caption: string };

/** Keyboard lightbox: arrows navigate, Escape closes, focus trapped, swipe on touch. */
export function Lightbox({ items, index, onClose, onIndex, locale }: { items: Item[]; index: number; onClose: () => void; onIndex: (i: number) => void; locale: Locale }) {
  const t = useTranslations("gallery");
  const tc = useTranslations("common");
  const ref = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const [dir, setDir] = useState(0);
  const go = useCallback((d: number) => { setDir(d); onIndex((index + d + items.length) % items.length); }, [index, items.length, onIndex]);
  useEffect(() => {
    lockScroll();
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && ref.current) {
        const f = Array.from(ref.current.querySelectorAll<HTMLElement>("button"));
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); unlockScroll(); };
  }, [go, onClose]);
  const it = items[index];
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={t("lightbox")} className="fade-in fixed inset-0 z-[90] flex flex-col bg-basalt text-bone" onTouchStart={(e) => (touch.current = e.touches[0].clientX)} onTouchEnd={(e) => { if (touch.current != null) { const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); } touch.current = null; }}>
      <div className="flex items-center justify-between px-4 py-3">
        <p className="tabular text-[14px] text-bone/80" aria-live="polite">{index + 1} / {items.length}</p>
        <button type="button" onClick={onClose} aria-label={tc("close")} className="inline-flex size-11 items-center justify-center rounded-full bg-basalt-soft"><Close /></button>
      </div>
      <div className="relative flex-1 px-4" key={index}>
        <div className="fade-in relative mx-auto h-full max-w-6xl">
          <Image src={it.image.src} alt={it.image.alt[locale]} fill sizes="100vw" quality={80} className="object-contain" style={{ objectPosition: "50% 50%", animation: dir ? "fade-in 300ms var(--ease-out)" : undefined }} priority />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-4">
        <button type="button" onClick={() => go(-1)} aria-label={tc("previous")} className="pill pill-ghost on-dark size-11 px-0"><ArrowLeft /></button>
        <p className="small flex-1 text-center text-bone/80">{it.caption}{it.image.rendering ? ` · ${tc("rendering")}` : ""}</p>
        <button type="button" onClick={() => go(1)} aria-label={tc("next")} className="pill pill-ghost on-dark size-11 px-0"><ArrowRight /></button>
      </div>
    </div>
  );
}
