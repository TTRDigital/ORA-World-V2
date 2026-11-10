"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";
import { SoundOn, SoundOff } from "@/components/ui/Icons";
import { FilmLightbox } from "./FilmLightbox";

type Props = {
  locale: Locale;
  youtubeId: string | null;
  mp4: string | null;
  webm: string | null;
  poster: ImageRef;
};

const YT_ORIGIN = "https://www.youtube-nocookie.com";

/**
 * The film as the background of the single hero banner (client feedback: one banner, the video, not two panels).
 * It covers the banner at any aspect ratio. Poster first (priority). The YouTube iframe mounts only after window load + idle, and the poster
 * fades out only once the IFrame API reports playerState 1 through the "listening" handshake. If
 * YouTube never plays, the poster stays. Captions are unloaded repeatedly for 20 s. The iframe is
 * oversized to 130% inside the overflow-hidden frame so no player chrome is visible.
 */
export function HeroStage({ locale, youtubeId, mp4, webm, poster }: Props) {
  const t = useTranslations("hero");
  const [mount, setMount] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  // Sound (client: "watch the film" with a sound on/off control). Browsers never allow sound before a click, so the
  // film plays silently and the visitor turns sound on; that click restarts the film from the beginning with sound.
  const [sound, setSound] = useState(false);
  const soundRef = useRef(false);
  // Only an iframe created by the sound click starts unmuted; toggling later never reloads the player.
  const [startWithSound, setStartWithSound] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const selfHosted = Boolean(mp4 || webm);

  // Mount the player after load + idle, unless reduced motion or Save-Data asks for the poster only.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData || (!youtubeId && !selfHosted)) return;
    let idle = 0;
    let timer = 0;
    const go = () => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      };
      if (typeof w.requestIdleCallback === "function")
        idle = w.requestIdleCallback(() => setMount(true), { timeout: 3000 });
      else timer = window.setTimeout(() => setMount(true), 1500);
    };
    // Phones: the YouTube player is about 1.1 MB of script, so it waits for the visitor's first touch, scroll or
    // key press instead of loading during start-up. The poster render shows until then. Self-hosted loops are light.
    const phone = !selfHosted && window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const events = ["pointerdown", "touchstart", "wheel", "keydown"] as const;
    const onFirst = () => {
      events.forEach((e) => window.removeEventListener(e, onFirst));
      go();
    };
    if (phone) events.forEach((e) => window.addEventListener(e, onFirst, { once: true, passive: true }));
    else if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      events.forEach((e) => window.removeEventListener(e, onFirst));
      window.removeEventListener("load", go);
      if (idle && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, [youtubeId, selfHosted]);

  const post = useCallback((msg: Record<string, unknown>) => {
    iframe.current?.contentWindow?.postMessage(JSON.stringify(msg), YT_ORIGIN);
  }, []);

  const silence = useCallback(() => {
    post({ event: "command", func: "unloadModule", args: ["captions"] });
    post({ event: "command", func: "unloadModule", args: ["cc"] });
    post({ event: "command", func: "setOption", args: ["captions", "track", {}] });
    if (!soundRef.current) post({ event: "command", func: "mute", args: [] });
  }, [post]);

  // Handshake with the IFrame API; fade the poster only on playerState 1.
  useEffect(() => {
    if (!mount || selfHosted || !youtubeId) return;
    let listening = 0;
    let silencer = 0;
    let silenceUntil = 0;
    const startSilencing = () => {
      silenceUntil = Date.now() + 20_000;
      if (silencer) return;
      silence();
      silencer = window.setInterval(() => {
        if (Date.now() > silenceUntil) {
          clearInterval(silencer);
          silencer = 0;
          return;
        }
        silence();
      }, 1000);
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== iframe.current?.contentWindow) return;
      let data: { event?: string; info?: { playerState?: number } | number } | null = null;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (!data) return;
      if (data.event === "onReady") startSilencing();
      const state =
        data.event === "onStateChange"
          ? data.info
          : data.event === "infoDelivery"
            ? (data.info as { playerState?: number })?.playerState
            : undefined;
      if (state === 1) {
        setPlaying(true);
        startSilencing();
      }
    };
    window.addEventListener("message", onMessage);
    const hello = () => post({ event: "listening", id: 1, channel: "widget" });
    listening = window.setInterval(hello, 500);
    const stop = window.setTimeout(() => clearInterval(listening), 30_000);
    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(listening);
      clearTimeout(stop);
      clearInterval(silencer);
    };
  }, [mount, selfHosted, youtubeId, post, silence]);

  const toggleSound = () => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSound(next);
    if (selfHosted && video.current) {
      video.current.muted = !next;
      if (next) {
        video.current.currentTime = 0;
        video.current.play().catch(() => {});
      }
      return;
    }
    if (!mount) {
      // Not loaded yet (phones wait for a first touch; reduced motion shows the poster): load it now, with sound.
      setStartWithSound(true);
      setMount(true);
      return;
    }
    if (next) {
      post({ event: "command", func: "seekTo", args: [0, true] });
      post({ event: "command", func: "unMute", args: [] });
      post({ event: "command", func: "setVolume", args: [100] });
      post({ event: "command", func: "playVideo", args: [] });
    } else {
      post({ event: "command", func: "mute", args: [] });
    }
  };

  const embed =
    youtubeId && mount && !selfHosted && typeof window !== "undefined"
      ? `${YT_ORIGIN}/embed/${youtubeId}?autoplay=1&mute=${startWithSound ? 0 : 1}&loop=1&playlist=${youtubeId}&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
      : null;

  return (
    <div className="absolute inset-0 [container-type:size]" data-hero-image data-focal={poster.focal} data-film-state={playing ? "playing" : "poster"}>
      {/* Poster render: priority, sharp; fades only once the film really plays. */}
      <Image
        src={poster.src}
        alt={poster.alt[locale] || poster.alt.en}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={80}
        className={cn("object-cover transition-opacity duration-700 [transition-timing-function:var(--ease-out)]", playing ? "opacity-0" : "opacity-100")}
        style={{ objectPosition: poster.focal }}
      />
      {/* YouTube player: a 16:9 box sized to cover the banner (container units), plus 30% so no chrome shows. */}
      {embed && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <iframe
            ref={iframe}
            src={embed}
            title={t("filmTitle")}
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            className={cn(
              "absolute top-1/2 left-1/2 h-[max(130cqh,73.125cqw)] w-[max(130cqw,231.11cqh)] -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700",
              playing ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      )}
      {mount && selfHosted && (
        <video
          ref={video}
          muted
          loop
          playsInline
          autoPlay
          onPlaying={() => setPlaying(true)}
          aria-hidden="true"
          tabIndex={-1}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", playing ? "opacity-100" : "opacity-0")}
          style={{ objectPosition: poster.focal }}
        >
          {webm && <source src={webm} type="video/webm" />}
          {mp4 && <source src={mp4} type="video/mp4" />}
        </video>
      )}
      {(youtubeId || selfHosted) && (
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          className="absolute bottom-6 left-5 z-20 inline-flex min-h-11 items-center gap-2.5 rounded-full bg-basalt/55 px-4 text-[11px] font-semibold tracking-[0.2em] text-bone uppercase ring-1 ring-bone/30 backdrop-blur-sm transition-colors hover:bg-basalt/75 md:bottom-8 md:left-8"
          data-track={sound ? "film_sound_off" : "film_sound_on"}
        >
          {sound ? <SoundOn className="text-brass-light" /> : <SoundOff className="text-brass-light" />}
          {sound ? t("soundOff") : t("soundOn")}
        </button>
      )}
      <p className="visually-hidden" aria-live="polite">
        {playing ? t("filmPlaying") : ""}
      </p>
      <FilmLightbox youtubeId={youtubeId} mp4={mp4} open={lightbox} onClose={() => setLightbox(false)} />
      {/* The "Watch the film" pill dispatches this event. */}
      <OpenFilmListener onOpen={() => setLightbox(true)} />
    </div>
  );
}

function OpenFilmListener({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const h = () => onOpen();
    window.addEventListener("ora2:film", h);
    return () => window.removeEventListener("ora2:film", h);
  }, [onOpen]);
  return null;
}
