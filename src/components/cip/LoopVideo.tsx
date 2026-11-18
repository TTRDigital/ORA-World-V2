"use client";

import { useEffect, useRef } from "react";

/**
 * A short silent film loop in place of a still picture (client, 15 Nov: "make it like a video that goes inside the
 * gym"). Plays only while on screen and pauses when scrolled away; loads nothing until it is about to be seen. Reduced
 * motion: the poster frame stays still. The poster is the film's first frame, so nothing jumps when it starts.
 */
export function LoopVideo({ src, poster, label, ratio, flat = false, focal }: { src: string; poster: string; label: string; ratio: string; /** inside a card: no own rounding or shadow */ flat?: boolean; /** where the film is framed (CSS object-position) */ focal?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

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
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className={flat ? "relative overflow-hidden bg-travertine" : "relative overflow-hidden rounded-[20px] bg-travertine shadow-[0_24px_50px_-30px_rgb(44_36_22/0.5)]"} style={{ aspectRatio: ratio }}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        style={focal ? { objectPosition: focal } : undefined}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        disablePictureInPicture
        tabIndex={-1}
      />
    </div>
  );
}
