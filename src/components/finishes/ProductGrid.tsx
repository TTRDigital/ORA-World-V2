"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type Product = { name: string; maker?: string; spec?: string; src: string; photo?: boolean };

/**
 * Finishes as products (client, 18 Nov: "get the finishes out and make them part of the website; I still see images"):
 * each piece cut from the presentation's boards sits on its own white card with its name and a short spec. A card
 * opens a pop-up with the piece larger; it closes with ×, Esc or a click outside. The pieces are small cut-outs, served
 * as they are (no resizing).
 */
export function ProductGrid({ items, close, cols = 4 }: { items: Product[]; close: string; cols?: 3 | 4 }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [cur, setCur] = useState<Product | null>(null);
  return (
    <>
      <ul className={cn("grid grid-cols-2 gap-3 md:gap-4", cols === 4 ? "md:grid-cols-3 lg:grid-cols-4" : "md:grid-cols-3")}>
        {items.map((p) => (
          <li key={p.name + p.src}>
            <button
              type="button"
              onClick={() => {
                setCur(p);
                dialog.current?.showModal();
              }}
              className="group flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-white text-left ring-1 ring-travertine-deep/60 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-24px_rgb(44_36_22/0.45)]"
            >
              <span className={cn("relative block aspect-square overflow-hidden", p.photo ? "bg-travertine" : "bg-white")}>
                <Image
                  src={p.src}
                  alt={p.name}
                  fill
                  unoptimized
                  className={cn("transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.05]", p.photo ? "object-cover" : "object-contain p-5 md:p-7")}
                  style={{ objectPosition: "50% 50%" }}
                />
              </span>
              <span className="flex flex-1 flex-col border-t border-travertine-deep/50 p-4 md:p-5">
                {p.maker && <span className="text-[10.5px] font-semibold tracking-[0.2em] text-brass-ink uppercase">{p.maker}</span>}
                <span className="mt-1 font-[family-name:var(--font-display)] text-[19px] leading-tight text-charcoal md:text-[21px]">{p.name}</span>
                {p.spec && <span className="mt-1.5 text-[13px] leading-snug text-charcoal-soft">{p.spec}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={cur?.name}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onClose={() => setCur(null)}
        className="m-auto w-[min(880px,92vw)] max-w-none overflow-hidden rounded-[22px] bg-white p-0 text-charcoal shadow-[0_30px_80px_-20px_rgb(28_24_18/0.6)] backdrop:bg-basalt/75 backdrop:backdrop-blur-[2px]"
      >
        {cur && (
          <div className="grid max-h-[90dvh] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className={cn("relative min-h-[300px] md:min-h-[460px]", cur.photo ? "bg-travertine" : "bg-white")}>
              <Image src={cur.src} alt={cur.name} fill unoptimized className={cur.photo ? "object-cover" : "object-contain p-8"} />
            </div>
            <div className="relative flex flex-col justify-end border-t border-travertine-deep/50 p-6 md:border-t-0 md:border-l md:p-8">
              <button type="button" onClick={() => dialog.current?.close()} aria-label={close} className="absolute top-4 right-4 grid size-11 place-items-center rounded-full ring-1 ring-travertine-deep hover:ring-charcoal">
                <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden>
                  <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              {cur.maker && <p className="text-[11px] font-semibold tracking-[0.22em] text-brass-ink uppercase">{cur.maker}</p>}
              <p className="mt-2 font-[family-name:var(--font-display)] text-[30px] leading-tight">{cur.name}</p>
              {cur.spec && <p className="mt-3 text-[15px] leading-relaxed text-charcoal-soft">{cur.spec}</p>}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
