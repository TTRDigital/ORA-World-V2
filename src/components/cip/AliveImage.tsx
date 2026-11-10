"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";

/** A single large picture that "comes alive" (slow drift and zoom) while it is on screen. */
export function AliveImage({ image, locale, ratio, sizes }: { image: ImageRef; locale: Locale; ratio: string; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (el.dataset.inview = String(e.isIntersecting)), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="alive relative overflow-hidden rounded-[20px] bg-travertine shadow-[0_24px_50px_-30px_rgb(44_36_22/0.5)]" style={{ aspectRatio: ratio }}>
      <Image src={image.src} alt={image.alt[locale] || image.alt.en} fill sizes={sizes} quality={80} className="object-cover" style={{ objectPosition: image.focal }} />
    </div>
  );
}
