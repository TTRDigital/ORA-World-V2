"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A finish board you can look into (client, 18 Nov: "when the mouse is over, open it and make it bigger"): on desktop a
 * round lens follows the pointer and magnifies what is under it; a click (or tap) opens the board full screen, where a
 * click zooms in and the pointer moves around the enlarged board.
 */
export function ZoomBoard({ src, alt, width, height, labels }: { src: string; alt: string; width: number; height: number; labels: { open: string; close: string; zoom: string } }) {
  const box = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const LENS = 240;
  const MAG = 2.4;

  return (
    <>
      <button
        ref={box}
        type="button"
        onClick={() => {
          setZoom(false);
          dialog.current?.showModal();
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setLens({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height });
        }}
        onPointerLeave={() => setLens(null)}
        aria-label={`${labels.open}: ${alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[20px] bg-white ring-1 ring-travertine-deep/60"
      >
        <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 1279px) calc(100vw - 40px), 1280px" quality={85} className="h-auto w-full" />
        {lens && (
          <span
            aria-hidden
            className="pointer-events-none absolute hidden rounded-full shadow-[0_18px_50px_-12px_rgb(44_36_22/0.6)] ring-4 ring-white md:block"
            style={{
              width: LENS,
              height: LENS,
              left: lens.x - LENS / 2,
              top: lens.y - LENS / 2,
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${lens.w * MAG}px ${lens.h * MAG}px`,
              backgroundPosition: `${-(lens.x * MAG - LENS / 2)}px ${-(lens.y * MAG - LENS / 2)}px`,
            }}
          />
        )}
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-basalt/75 px-3 py-1.5 text-[10.5px] font-semibold tracking-[0.18em] text-bone uppercase backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden>
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11 11l3.5 3.5M7 4.5v5M4.5 7h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {labels.open}
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-label={alt}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-white p-0 text-charcoal backdrop:bg-basalt/80"
        onClose={() => setZoom(false)}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-travertine-deep/60 px-5 py-3 md:px-8">
            <p className="text-[11px] tracking-[0.2em] text-charcoal-soft uppercase">{labels.zoom}</p>
            <button type="button" onClick={() => dialog.current?.close()} className="grid size-11 place-items-center rounded-full ring-1 ring-travertine-deep hover:ring-charcoal" aria-label={labels.close}>
              <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden>
                <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
          <div
            className={cn("relative min-h-0 flex-1 overflow-hidden", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
              setZoom((z) => !z);
            }}
            onPointerMove={(e) => {
              if (!zoom) return;
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- the full-size board, served as is */}
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 m-auto h-full w-full object-contain p-3 transition-transform duration-300 md:p-8"
              style={{ transform: zoom ? "scale(2.2)" : "none", transformOrigin: origin }}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
