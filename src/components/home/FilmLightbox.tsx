"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { Close } from "@/components/ui/Icons";

/** "Watch the film": a focus-trapped dialog with the YouTube player WITH sound and controls. */
export function FilmLightbox({
  youtubeId,
  mp4,
  open,
  onClose,
}: {
  youtubeId: string | null;
  mp4: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("common");
  const th = useTranslations("hero");
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const closeBtn = panel.current?.querySelector<HTMLElement>("button");
    closeBtn?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(
          panel.current.querySelectorAll<HTMLElement>(
            "button, iframe, video, [tabindex]:not([tabindex='-1'])",
          ),
        );
        if (!f.length) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open, onClose]);

  if (!open) return null;
  const src = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`
    : null;
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={th("filmTitle")}
    >
      <button
        type="button"
        aria-label={t("closeFilm")}
        onClick={onClose}
        className="fade-in absolute inset-0 bg-basalt/90"
      />
      <div ref={panel} className="fade-in relative w-full max-w-6xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeFilm")}
          className="absolute -top-14 right-0 inline-flex size-11 items-center justify-center rounded-full bg-bone text-charcoal md:-right-2"
        >
          <Close />
        </button>
        <div className="frame frame-lg bg-basalt-soft" style={{ aspectRatio: "16/9" }}>
          {mp4 ? (
            <video src={mp4} controls autoPlay playsInline className="h-full w-full" />
          ) : src ? (
            <iframe
              src={src}
              title={th("filmTitle")}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
