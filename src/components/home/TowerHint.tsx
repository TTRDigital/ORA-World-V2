"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * An animated guide over the tower stack: the ORA tree avatar types the hint ("Tap a floor to choose your
 * altitude") in a speech bubble while a pointer glides to the tower, taps a band (with a ripple) and returns,
 * on a loop. It starts when the tower scrolls into view and disappears for good the moment the visitor hovers,
 * taps or picks a collection. Decorative (aria-hidden): the same instruction is in the module's intro.
 * Under reduced motion the bubble shows the full text and the pointer stays still.
 */
const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(reducedQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function TowerHint({ text, active }: { text: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Typewriter: types the hint, holds, clears and types again while the guide is on screen.
  useEffect(() => {
    if (!visible || !active || reduced) return;
    let i = 0;
    let hold = 0;
    const id = window.setInterval(() => {
      if (i <= text.length) {
        setTyped(text.slice(0, i));
        i++;
      } else if (++hold > 40) {
        i = 0;
        hold = 0;
      }
    }, 55);
    return () => clearInterval(id);
  }, [visible, active, text, reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 transition-opacity duration-500",
        visible && active ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Avatar + typed bubble, top of the tower area */}
      <div className="absolute top-0 left-1/2 flex -translate-x-1/2 items-center gap-2 lg:left-[58%]">
        <span className="tower-hint-avatar relative inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-bone shadow-lift ring-2 ring-brass/60">
          <Image src="/brand/ora-world-logo-gold.png" alt="" width={34} height={24} className="h-6 w-auto" />
        </span>
        <span className="relative min-h-9 rounded-2xl rounded-bl-md bg-basalt px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap text-bone shadow-lift">
          {reduced ? text : typed}
          <span className="tower-hint-caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-brass-light" />
        </span>
      </div>
      {/* Pointer that glides to a band and taps it */}
      <span className="tower-hint-pointer absolute">
        <span className="tower-hint-ripple absolute top-0 left-0 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brass" />
        <svg width="34" height="34" viewBox="0 0 24 24" className="relative drop-shadow-[0_6px_10px_rgb(28_27_25/0.35)]">
          <path d="M5 3.5 18.5 12l-6 1.4 3.4 6.4-2.6 1.3-3.3-6.4L5.6 18.6z" fill="var(--color-basalt)" stroke="var(--color-bone)" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
