"use client";

import { useRef } from "react";
import Image from "next/image";

/**
 * A finish board that opens full screen (client, 18 Nov: "open it and make it bigger"; no magnifying lens, which the
 * client did not like).
 */
export function ZoomBoard({ src, alt, width, height, labels }: { src: string; alt: string; width: number; height: number; labels: { open: string; close: string } }) {
  const box = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        ref={box}
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`${labels.open}: ${alt}`}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-[20px] bg-white ring-1 ring-travertine-deep/60"
      >
        <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 1279px) calc(100vw - 40px), 1280px" quality={85} className="h-auto w-full" />
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
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-travertine-deep/60 px-5 py-3 md:px-8">
            <p className="text-[13px] text-charcoal">{alt}</p>
            <button type="button" onClick={() => dialog.current?.close()} className="grid size-11 place-items-center rounded-full ring-1 ring-travertine-deep hover:ring-charcoal" aria-label={labels.close}>
              <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden>
                <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element -- the full-size board, served as is */}
            <img src={src} alt={alt} className="absolute inset-0 m-auto h-full w-full object-contain p-3 md:p-8" />
          </div>
        </div>
      </dialog>
    </>
  );
}
