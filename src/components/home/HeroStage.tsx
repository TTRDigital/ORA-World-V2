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
const SOUND_KEY = "ora2_film_sound";
const wantsSound = () => {
  try {
    return localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
};

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
  // Sound (client, 11 Nov 2026: "sound on auto when open, and off by clicking the button"). The film is created with
  // sound on. If the browser blocks sound before any click (most first visits), the film plays silently and the sound
  // comes on at the visitor's first click, tap or key press anywhere. "Sound off" is remembered for later visits.
  const [sound, setSound] = useState(false);
  const soundRef = useRef(false);
  // The iframe's starting state (sound on unless the visitor turned it off); never changed after it loads.
  const [startWithSound, setStartWithSound] = useState(false);
  const startRef = useRef(false);
  const playingRef = useRef(false);
  const pendingRef = useRef(false);
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
      const start = () => {
        const on = wantsSound();
        startRef.current = on;
        soundRef.current = on;
        setStartWithSound(on);
        setSound(on);
        setMount(true);
      };
      if (typeof w.requestIdleCallback === "function") idle = w.requestIdleCallback(start, { timeout: 3000 });
      else timer = window.setTimeout(start, 1500);
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
      if (data.event === "onReady") {
        startSilencing();
        if (startRef.current)
          window.setTimeout(() => {
            if (playingRef.current) return;
            // The browser blocked autoplay with sound: play silently now, turn sound on at the first gesture.
            soundRef.current = false;
            setSound(false);
            pendingRef.current = wantsSound();
            post({ event: "command", func: "mute", args: [] });
            post({ event: "command", func: "playVideo", args: [] });
          }, 2500);
      }
      const state =
        data.event === "onStateChange"
          ? data.info
          : data.event === "infoDelivery"
            ? (data.info as { playerState?: number })?.playerState
            : undefined;
      // Some browsers start the film muted instead of blocking it: the player reports that, so wait for a gesture.
      const muted = data.event === "infoDelivery" ? (data.info as { muted?: boolean })?.muted : undefined;
      if (muted === true && soundRef.current && !offscreenRef.current && startRef.current) {
        soundRef.current = false;
        setSound(false);
        pendingRef.current = wantsSound();
      }
      if (state === 1) {
        playingRef.current = true;
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

  const root = useRef<HTMLDivElement>(null);
  const mountRef = useRef(false);
  const offscreenRef = useRef(false);
  useEffect(() => {
    mountRef.current = mount;
  }, [mount]);

  const unmuteNow = useCallback(() => {
    soundRef.current = true;
    setSound(true);
    pendingRef.current = false;
    if (offscreenRef.current) return; // comes on when the banner is back in view
    if (selfHosted && video.current) {
      video.current.muted = false;
      video.current.play().catch(() => {});
      return;
    }
    post({ event: "command", func: "unMute", args: [] });
    post({ event: "command", func: "setVolume", args: [100] });
    post({ event: "command", func: "playVideo", args: [] });
  }, [post, selfHosted]);

  const muteNow = useCallback(() => {
    soundRef.current = false;
    setSound(false);
    pendingRef.current = false;
    if (selfHosted && video.current) video.current.muted = true;
    else post({ event: "command", func: "mute", args: [] });
  }, [post, selfHosted]);

  const toggleSound = () => {
    const next = !soundRef.current;
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {}
    if (!next) return muteNow();
    if (!mountRef.current && !selfHosted) {
      // Not loaded yet (reduced motion shows the poster): load it now, with sound, from this click.
      startRef.current = true;
      soundRef.current = true;
      setStartWithSound(true);
      setSound(true);
      setMount(true);
      return;
    }
    unmuteNow();
  };

  // Self-hosted film: try sound on; if the browser blocks it, play silently and wait for the first gesture.
  useEffect(() => {
    const v = video.current;
    if (!mount || !selfHosted || !v) return;
    if (!wantsSound()) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
      soundRef.current = false;
      setSound(false);
      pendingRef.current = true;
    });
  }, [mount, selfHosted]);

  // First click, tap or key press anywhere: if sound is wanted but was blocked, turn it on now.
  useEffect(() => {
    if (!youtubeId && !selfHosted) return;
    const onGesture = (e: Event) => {
      if ((e.target as HTMLElement | null)?.closest("[data-film-sound]")) return; // the button handles itself
      if (soundRef.current || !wantsSound()) return;
      if (!mountRef.current) return; // the player mounts on this gesture (phones) and starts with sound
      if (!pendingRef.current) return; // only when the browser blocked the sound at start
      unmuteNow();
    };
    window.addEventListener("pointerdown", onGesture, true);
    window.addEventListener("keydown", onGesture, true);
    return () => {
      window.removeEventListener("pointerdown", onGesture, true);
      window.removeEventListener("keydown", onGesture, true);
    };
  }, [youtubeId, selfHosted, unmuteNow]);

  // Mute while the banner is out of view; bring the sound back when it returns.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        offscreenRef.current = !e.isIntersecting;
        if (!soundRef.current) return;
        if (selfHosted && video.current) video.current.muted = !e.isIntersecting;
        else post({ event: "command", func: e.isIntersecting ? "unMute" : "mute", args: [] });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [post, selfHosted]);

  const embed =
    youtubeId && mount && !selfHosted && typeof window !== "undefined"
      ? `${YT_ORIGIN}/embed/${youtubeId}?autoplay=1&mute=${startWithSound ? 0 : 1}&loop=1&playlist=${youtubeId}&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
      : null;

  return (
    <div ref={root} className="absolute inset-0 [container-type:size]" data-hero-image data-focal={poster.focal} data-film-state={playing ? "playing" : "poster"}>
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
          data-film-sound
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
