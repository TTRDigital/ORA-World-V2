"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up from 0 when it scrolls into view (client, 16 Nov). The server HTML carries the real value
 * ("65,500"), so search engines and screen readers get it, and nothing depends on the animation. Reduced motion: the
 * value shows as is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const target = Number(value.replace(/[^\d.]/g, ""));
  const grouped = value.includes(",");
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target) || target <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Start from zero only if the figure is not already on screen (so it never visibly jumps back).
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;
    // Keeps decimals while counting ("10.6"), so the figure never jumps at the end.
    const dec = (value.split(".")[1] ?? "").replace(/\D/g, "").length;
    const fmt = (n: number) => (grouped ? Math.round(n).toLocaleString("en-US") : dec ? n.toFixed(dec) : String(Math.round(n)));
    const zero = requestAnimationFrame(() => setShown(fmt(0)));
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          setShown(fmt(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(step);
          else setShown(value);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(zero);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [target, grouped, value]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown}
    </span>
  );
}
