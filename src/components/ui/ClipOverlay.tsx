"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A short film laid over its own still (client, 17 Nov: "short videos created to replace those images, to make this
 * site live"). The still stays underneath as the poster and the accessible image; the film loads only when the frame
 * comes on screen, plays muted on a loop while it is visible, pauses when it leaves, and fades in once it really plays.
 * Visitors who ask for reduced motion keep the still.
 */
export function ClipOverlay({ src, poster, focal, className }: { src: string; poster?: string; focal?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      tabIndex={-1}
      aria-hidden="true"
      data-clip
      onPlaying={() => setOn(true)}
      className={cn("pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700", on ? "opacity-100" : "opacity-0", className)}
      style={focal ? { objectPosition: focal } : undefined}
    />
  );
}
