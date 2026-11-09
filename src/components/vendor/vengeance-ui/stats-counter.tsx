// Source: https://www.vengeanceui.com/r/stats-counter.json
"use client";

/*
 * Vengeance UI stats-counter, adapted for ORA World v2:
 * - the real, formatted value is rendered on the server, so no-JS visitors and crawlers never see 0;
 * - on the client it resets to 0 in useLayoutEffect (before paint) and counts up once in view;
 * - digits are written to the span's textContent through a ref, not React state on every frame;
 * - toLocaleString keeps grouping (65,500 / 65.500) in the visitor's language;
 * - useInView has no negative margin, so numbers near the fold still count;
 * - reduced motion skips the animation and leaves the final value.
 */
import { useLayoutEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
  className?: string;
}

export default function StatsCounter({ value, duration = 1.5, prefix = "", suffix = "", decimals = 0, locale = "en-US", className }: StatsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const armed = useRef(false);
  const format = (n: number) =>
    `${prefix}${n.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  // Before first paint: start from 0 unless reduced motion is on or the number is already in view.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    armed.current = true;
    el.textContent = format(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !isInView || !armed.current) return;
    armed.current = false;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        el.textContent = format(latest);
      },
      onComplete: () => {
        el.textContent = format(value);
      },
    });
    return () => {
      controls.stop();
      el.textContent = format(value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(value)}
    </span>
  );
}
