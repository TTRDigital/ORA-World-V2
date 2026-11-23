"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Version E interiors: a full-width slideshow (in the manner of ciprianiresidencesmiami.com): one photograph at a
 * time, crossfading on its own every 5 s (films since 23 Nov), a line of text at the bottom left and dots to choose. Reduced motion: no
 * automatic change.
 */
export function EGallery({ slides, locale, text, label }: { slides: { image: ImageRef; caption: string; video?: string }[]; locale: Locale; text: string; label: string }) {
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  // Client, 23 Nov: the slides are films; only the one on show plays.
  const films = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    films.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) {
        v.muted = true;
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [i]);
  useEffect(() => {
    if (held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((k) => (k + 1) % slides.length), 5000);
    return () => clearTimeout(t);
  }, [i, held, slides.length]);
  return (
    <section aria-roledescription="carousel" aria-label={label} className="relative isolate h-[78svh] min-h-[480px] overflow-hidden text-white" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
      {slides.map((s, k) => (
        <div key={s.image.src} aria-hidden={k !== i} className={cn("absolute inset-0 -z-10 transition-opacity duration-[1200ms]", k === i ? "opacity-100" : "opacity-0")}>
          <Image src={s.image.src} alt={s.image.alt[locale] || s.image.alt.en} fill sizes="100vw" quality={82} className="object-cover" style={{ objectPosition: s.image.focal }} priority={k === 0} />
          {s.video && (
            <video
              ref={(el) => {
                films.current[k] = el;
              }}
              src={s.video}
              muted
              loop
              playsInline
              preload={k === 0 ? "auto" : "metadata"}
              disablePictureInPicture
              tabIndex={-1}
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: s.image.focal }}
            />
          )}
        </div>
      ))}
      <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_45%,rgb(28_24_18/0.72))]" />
      <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-10 md:pb-10">
        <p className="max-w-[64ch] text-[15px] leading-relaxed md:text-[16px]">{text}</p>
        <p className="mt-2 text-[12px] tracking-[0.18em] uppercase opacity-80">{slides[i].caption}</p>
        <div className="mt-4 flex gap-1">
          {slides.map((s, k) => (
            <button key={s.image.src} type="button" aria-label={`${k + 1}: ${s.caption}`} aria-current={k === i} onClick={() => setI(k)} className="grid size-8 place-items-center">
              <span className={cn("block size-2.5 rounded-full border border-white", k === i && "bg-white")} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
