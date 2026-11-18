"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * The cream statement band (in the manner of parksidebrickell.com): one very large serif line that slides sideways as
 * the visitor scrolls past, with small pictures floating at different speeds. Reduced motion: the line wraps, still.
 */
export function ScrollStatement({ text, images }: { text: string; images: { src: string; alt: string; className: string; speed: number }[] }) {
  const box = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLParagraphElement>(null);
  const floats = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      const l = line.current;
      if (l) l.style.transform = `translate3d(${(0.5 - p) * Math.max(0, l.scrollWidth - el.clientWidth + 200)}px,0,0)`;
      floats.current.forEach((f, k) => {
        if (f) f.style.transform = `translate3d(0,${(0.5 - p) * images[k].speed}px,0)`;
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [images]);
  return (
    <div ref={box} className="relative flex min-h-[78svh] items-center overflow-hidden py-24 md:min-h-[96svh]">
      {images.map((im, k) => (
        <div
          key={im.src}
          ref={(n) => {
            floats.current[k] = n;
          }}
          className={`absolute overflow-hidden shadow-[0_30px_60px_-30px_rgb(21_40_30/0.45)] ${im.className}`}
        >
          <Image src={im.src} alt={im.alt} fill sizes="320px" quality={80} className="object-cover" style={{ objectPosition: "50% 50%" }} />
        </div>
      ))}
      <p ref={line} className="relative z-10 px-5 font-[family-name:var(--font-display)] text-[64px] leading-[1.02] whitespace-nowrap text-[var(--v2-green)] will-change-transform motion-reduce:whitespace-normal md:text-[120px] lg:text-[150px]">
        {text}
      </p>
    </div>
  );
}
