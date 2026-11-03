"use client";

import { useEffect } from "react";

/** Lenis smooth scroll on desktop pointers only; off on touch and under reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 1024;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    let raf = 0;
    let lenis: import("lenis").default | null = null;
    let cancelled = false;
    (async () => {
      const [{ default: Lenis }, { ScrollTrigger }] = await Promise.all([import("lenis"), import("@/lib/gsap")]);
      if (cancelled) return;
      const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      instance.on("scroll", () => ScrollTrigger.update());
      lenis = instance;
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
  return null;
}
