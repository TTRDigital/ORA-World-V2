"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Delegated click tracking for elements with data-track="event_name". */
export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (el?.dataset.track) track(el.dataset.track, { label: el.dataset.trackLabel });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
