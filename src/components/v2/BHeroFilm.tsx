"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "@/components/ui/Icons";

/**
 * Version B banner film (client, 18 Nov: "have the video play like Version 1"): as on Version A, a sharp poster shows at
 * once and fades when the film really plays; the film is written as HTML so "muted" and "autoplay" reach the browser in
 * the first response, is nudged to play on mount (some phones wait), and has a pause button.
 */
export function BHeroFilm({ alt, pauseLabel, playLabel }: { alt: string; pauseLabel: string; playLabel: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const v = wrap.current?.querySelector("video");
    if (!v) return;
    const on = () => setPlaying(true);
    v.addEventListener("playing", on);
    if (!v.paused && v.readyState > 2) on();
    v.muted = true;
    v.play().catch(() => {});
    return () => v.removeEventListener("playing", on);
  }, []);
  const toggle = () => {
    const v = wrap.current?.querySelector("video");
    if (!v) return;
    if (paused) v.play().catch(() => {});
    else v.pause();
    setPaused(!paused);
  };
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <Image src="/videos/hero-film-v4-poster.jpg" alt={alt} fill priority fetchPriority="high" sizes="100vw" quality={80} className={`z-[2] object-cover transition-opacity duration-700 ${playing ? "opacity-0" : "opacity-100"}`} style={{ objectPosition: "50% 50%" }} />
        <div
          ref={wrap}
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          dangerouslySetInnerHTML={{
            __html:
              '<video autoplay muted loop playsinline preload="auto" poster="/videos/hero-film-v4-poster.jpg" disablepictureinpicture tabindex="-1" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><source src="/videos/hero-film-v4-720.mp4" media="(max-width: 767px)" type="video/mp4"><source src="/videos/hero-film-v4.mp4" type="video/mp4"></video>',
          }}
        />
      </div>
      <button type="button" onClick={toggle} aria-label={paused ? playLabel : pauseLabel} className="absolute right-5 bottom-6 z-10 grid size-11 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white md:right-10">
        {paused ? <Play width={14} height={14} /> : <Pause width={14} height={14} />}
      </button>
    </>
  );
}
