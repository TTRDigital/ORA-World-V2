"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initReveals } from "@/lib/reveal";

/** Boots reveals and counters on every navigation; honours reduced motion and Save-Data. */
export function MotionInit() {
  const pathname = usePathname();
  useEffect(() => {
    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    html.classList.toggle("reduced-motion", reduced);
    html.classList.remove("no-js");
    const cleanup = initReveals();
    // Late-mounted content (tabs, filtered grids) registers itself through this event.
    const rebind = () => initReveals();
    window.addEventListener("ora2:reveal", rebind);
    return () => {
      cleanup();
      window.removeEventListener("ora2:reveal", rebind);
    };
  }, [pathname]);
  return null;
}
