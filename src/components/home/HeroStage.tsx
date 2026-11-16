"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { preconnect } from "react-dom";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";
import { SoundOn, SoundOff, Pause, Play } from "@/components/ui/Icons";
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
/** True once the visitor has clicked, tapped or pressed a key on the page: from then on the browser allows sound. */
const userHasInteracted = () => (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive ?? false;
/**
 * Will this browser play sound right now, before any click? Chrome allows it for visitors who often play media on the
 * site; Safari and Firefox (default settings) and first-time Chrome visitors do not. Asked up front so the film never
 * waits: it starts with sound where allowed, and silently (still at once) everywhere else.
 */
const soundAllowedNow = () => {
  const nav = navigator as Navigator & { getAutoplayPolicy?: (type: string) => string };
  const apple = /iP(hone|ad|od)/.test(nav.userAgent) || (/Macintosh/.test(nav.userAgent) && nav.maxTouchPoints > 1) || (/Safari\//.test(nav.userAgent) && !/Chrom(e|ium)|Edg\/|OPR\/|Firefox\//.test(nav.userAgent));
  try {
    if (typeof nav.getAutoplayPolicy === "function") return nav.getAutoplayPolicy("mediaelement") === "allowed";
  } catch {}
  if (userHasInteracted()) return true;
  if (apple) return false;
  try {
    const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return false;
    const ctx = new Ctx();
    const ok = ctx.state === "running";
    void ctx.close();
    return ok;
  } catch {
    return false;
  }
};
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
  // Open the connections to YouTube while the page is still loading, so the film starts sooner.
  if (youtubeId) {
    preconnect(YT_ORIGIN);
    preconnect("https://www.youtube.com");
    preconnect("https://i.ytimg.com");
  }
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
  const unmutedAtRef = useRef(0);
  // A player created before the visitor's first click cannot be unmuted later (Chrome ties the permission to the
  // moment the player loads), so it is reloaded with sound from that click, at the same point in the film.
  const preClickPlayerRef = useRef(false);
  const filmTimeRef = useRef(0);
  const [playerKey, setPlayerKey] = useState(0);
  const [startAt, setStartAt] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [paused, setPaused] = useState(false);
  // The instant film: a self-hosted loop in the server HTML, so it starts the moment the page arrives (client, 16 Nov:
  // "the video plays as soon as someone lands"). The YouTube film loads underneath and takes over once it really plays.
  const ambientWrap = useRef<HTMLDivElement>(null);
  const [ambientOn, setAmbientOn] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const selfHosted = Boolean(mp4 || webm);

  // Mount the player straight away, for everyone (client, 15 Nov: the film must play when people land; reduced-motion
  // visitors get it too, with the pause button beside the sound button). Only Save-Data keeps the poster.
  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || (!youtubeId && !selfHosted)) return;
    // Client: the film plays the moment the site opens, with sound, and the visitor can turn the sound off. It loads
    // straight away (no waiting for the rest of the page). With sound where the browser allows it; where it does not
    // (until the first click or tap), it still plays at once, silently, the sound button asks for a tap, and the first
    // tap anywhere brings the sound in.
    const start = () => {
      const want = wantsSound();
      const on = want && soundAllowedNow();
      startRef.current = on;
      soundRef.current = on;
      setStartWithSound(on);
      setSound(on);
      pendingRef.current = want && !on;
      setBlocked(want && !on);
      setMount(true);
    };
    const frame = requestAnimationFrame(start); // the next frame after the page appears
    return () => cancelAnimationFrame(frame);
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
            // After a click the browser allows sound: never mute then. Before one, show the film silently if it
            // has not started (the browser held it back) and turn the sound on at the first interaction.
            if (playingRef.current || soundRef.current === false || userHasInteracted()) return;
            // The browser blocked autoplay with sound: play silently now, turn sound on at the first gesture.
            soundRef.current = false;
            setSound(false);
            pendingRef.current = wantsSound();
            setBlocked(wantsSound());
            post({ event: "command", func: "mute", args: [] });
            post({ event: "command", func: "playVideo", args: [] });
          }, 1500);
      }
      const state =
        data.event === "onStateChange"
          ? data.info
          : data.event === "infoDelivery"
            ? (data.info as { playerState?: number })?.playerState
            : undefined;
      const time = data.event === "infoDelivery" ? (data.info as { currentTime?: number })?.currentTime : undefined;
      if (typeof time === "number") filmTimeRef.current = time;
      // Some browsers start the film muted instead of blocking it: the player reports that, so wait for a gesture.
      const muted = data.event === "infoDelivery" ? (data.info as { muted?: boolean })?.muted : undefined;
      if (muted === true && soundRef.current && !offscreenRef.current && Date.now() - unmutedAtRef.current > 2000) {
        if (userHasInteracted() && preClickPlayerRef.current) {
          reloadWithSound();
          return;
        }
        if (userHasInteracted()) {
          // The browser allows sound now: the player just has not applied it yet.
          unmutedAtRef.current = Date.now();
          post({ event: "command", func: "unMute", args: [] });
          post({ event: "command", func: "setVolume", args: [100] });
          return;
        }
        soundRef.current = false;
        setSound(false);
        pendingRef.current = wantsSound();
        setBlocked(wantsSound());
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
  }, [mount, selfHosted, youtubeId, post, silence, playerKey]);

  useEffect(() => {
    if (mount && !selfHosted && youtubeId) preClickPlayerRef.current = !userHasInteracted();
  }, [mount, selfHosted, youtubeId, playerKey]);

  const root = useRef<HTMLDivElement>(null);
  const mountRef = useRef(false);
  const offscreenRef = useRef(false);
  useEffect(() => {
    mountRef.current = mount;
  }, [mount]);

  /** The banner counts as off screen once less than a third of it is still visible. */
  const bannerOffscreen = () => {
    const r = root.current?.getBoundingClientRect();
    if (!r || !r.height) return false;
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    return visible < r.height * 0.33;
  };

  /** Reload the player with sound, from the visitor's click, at the same point in the film. */
  function reloadWithSound() {
    preClickPlayerRef.current = false;
    startRef.current = true;
    playingRef.current = false;
    setPlaying(false);
    unmutedAtRef.current = Date.now();
    setStartAt(Math.floor(filmTimeRef.current));
    setStartWithSound(true);
    setPlayerKey((k) => k + 1);
  }

  const unmuteNow = useCallback(() => {
    soundRef.current = true;
    setSound(true);
    pendingRef.current = false;
    setBlocked(false);
    unmutedAtRef.current = Date.now();
    if (bannerOffscreen()) return; // comes on when the banner is back in view
    if (selfHosted && video.current) {
      video.current.muted = false;
      video.current.play().catch(() => {});
      return;
    }
    if (preClickPlayerRef.current && userHasInteracted()) return reloadWithSound();
    setPaused(false); // sound on also means the film plays
    post({ event: "command", func: "unMute", args: [] });
    post({ event: "command", func: "setVolume", args: [100] });
    post({ event: "command", func: "playVideo", args: [] });
  }, [post, selfHosted]);

  const muteNow = useCallback(() => {
    soundRef.current = false;
    setSound(false);
    pendingRef.current = false;
    setBlocked(false);
    if (selfHosted && video.current) video.current.muted = true;
    else post({ event: "command", func: "mute", args: [] });
  }, [post, selfHosted]);

  const ambientVideo = () => ambientWrap.current?.querySelector("video") ?? null;
  useEffect(() => {
    const v = ambientVideo();
    if (!v) return;
    const on = () => setAmbientOn(true);
    v.addEventListener("playing", on);
    if (!v.paused && v.readyState > 2) on();
    else v.play().catch(() => {}); // in case the browser waited for the page to settle
    return () => v.removeEventListener("playing", on);
  }, []);
  // Once the YouTube film is really playing, the loop steps aside (and stops, to save battery).
  useEffect(() => {
    const v = ambientVideo();
    if (!v) return;
    if (playing) v.pause();
  }, [playing]);

  const togglePause = () => {
    const next = !paused;
    setPaused(next);
    const amb = ambientVideo();
    if (amb && !playing) {
      if (next) amb.pause();
      else amb.play().catch(() => {});
    }
    if (selfHosted && video.current) {
      if (next) video.current.pause();
      else video.current.play().catch(() => {});
      return;
    }
    post({ event: "command", func: next ? "pauseVideo" : "playVideo", args: [] });
  };

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

  // The welcome screen's "Enter with sound" / "Enter without sound" (that click is the permission browsers require).
  useEffect(() => {
    const on = () => {
      try {
        localStorage.setItem(SOUND_KEY, "on");
      } catch {}
      if (!mountRef.current && !selfHosted) {
        startRef.current = true;
        soundRef.current = true;
        setStartWithSound(true);
        setSound(true);
        setMount(true);
        return;
      }
      unmuteNow();
    };
    const off = () => {
      try {
        localStorage.setItem(SOUND_KEY, "off");
      } catch {}
      muteNow();
    };
    window.addEventListener("ora2:sound-on", on);
    window.addEventListener("ora2:sound-off", off);
    return () => {
      window.removeEventListener("ora2:sound-on", on);
      window.removeEventListener("ora2:sound-off", off);
    };
  }, [selfHosted, unmuteNow, muteNow]);

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
      setBlocked(true);
    });
  }, [mount, selfHosted]);

  // First click, tap or key press anywhere: if sound is wanted but was blocked, turn it on now.
  useEffect(() => {
    if (!youtubeId && !selfHosted) return;
    const onGesture = (e: Event) => {
      if ((e.target as HTMLElement | null)?.closest("[data-film-sound], [data-film-pause]")) return; // these buttons handle themselves
      if (soundRef.current || !wantsSound()) return;
      if (!userHasInteracted()) return; // e.g. the pointerdown of a touch: sound is allowed from its touchend
      if (!mountRef.current) {
        // Still loading: it will load with sound, since the visitor has now interacted.
        startRef.current = true;
        soundRef.current = true;
        setStartWithSound(true);
        setSound(true);
        pendingRef.current = false;
        setBlocked(false);
        return;
      }
      unmuteNow();
    };
    // Every event browsers count as a real interaction (a scroll with the wheel does not count, by browser rule).
    const events = ["pointerdown", "pointerup", "touchend", "click", "keydown"] as const;
    events.forEach((ev) => window.addEventListener(ev, onGesture, true));
    return () => events.forEach((ev) => window.removeEventListener(ev, onGesture, true));
  }, [youtubeId, selfHosted, unmuteNow]);

  // Mute while the banner is scrolled out of view; bring the sound back when it returns.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const off = bannerOffscreen();
      if (off === offscreenRef.current) return;
      offscreenRef.current = off;
      if (!soundRef.current) return;
      if (selfHosted && video.current) video.current.muted = off;
      else post({ event: "command", func: off ? "mute" : "unMute", args: [] });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [post, selfHosted]);

  const embed =
    youtubeId && mount && !selfHosted && typeof window !== "undefined"
      ? `${YT_ORIGIN}/embed/${youtubeId}?autoplay=1&mute=${startWithSound ? 0 : 1}${startAt ? `&start=${startAt}` : ""}&loop=1&playlist=${youtubeId}&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
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
        className={cn("z-[2] object-cover transition-opacity duration-700 [transition-timing-function:var(--ease-out)]", playing || ambientOn ? "opacity-0" : "opacity-100")}
        style={{ objectPosition: poster.focal }}
      />
      {/* The instant film (written as HTML so "muted" and "autoplay" are in the very first response: browsers only
          autoplay muted video, and React leaves "muted" out of server HTML). Phones get the portrait cut. */}
      <div
        ref={ambientWrap}
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 z-[1] transition-opacity duration-1000", playing ? "opacity-0" : "opacity-100")}
        dangerouslySetInnerHTML={{
          __html:
            '<video autoplay muted loop playsinline preload="auto" disablepictureinpicture tabindex="-1" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">' +
            '<source src="/videos/hero-portrait.mp4" type="video/mp4" media="(orientation: portrait)">' +
            '<source src="/videos/hero-landscape.mp4" type="video/mp4">' +
            "</video>",
        }}
      />
      {/* YouTube player: a 16:9 box sized to cover the banner (container units), plus 30% so no chrome shows. It stays
          fully visible under the poster (iPhone Safari may refuse to start a film it considers hidden); the poster
          fades away once the film really plays. */}
      {embed && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <iframe
            key={playerKey}
            ref={iframe}
            src={embed}
            title={t("filmTitle")}
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            className={cn(
              "absolute top-1/2 left-1/2 h-[max(130cqh,73.125cqw)] w-[max(130cqw,231.11cqh)] -translate-x-1/2 -translate-y-1/2 border-0",
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
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: poster.focal }}
        >
          {webm && <source src={webm} type="video/webm" />}
          {mp4 && <source src={mp4} type="video/mp4" />}
        </video>
      )}
      {(youtubeId || selfHosted) && (
        <div className="hero-fade absolute bottom-5 left-3 z-20 flex items-center gap-1 md:bottom-7 md:left-7" style={{ animationDelay: "1.2s" }}>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          data-film-sound
          className={cn(
            // Understated, like the reference: white words and a small icon over the film, no pill.
            "inline-flex min-h-11 items-center gap-2 px-2 text-[11px] tracking-[0.2em] text-bone uppercase [text-shadow:0_1px_8px_rgb(28_22_14/0.6)] transition-opacity hover:opacity-100",
            blocked ? "opacity-100" : "opacity-85",
          )}
          data-track={sound ? "film_sound_off" : "film_sound_on"}
        >
          {sound ? <SoundOn width={17} height={17} /> : <SoundOff width={17} height={17} />}
          {sound ? t("soundOff") : blocked ? t("tapForSound") : t("soundOn")}
        </button>
        {/* Pause / play: anyone can stop the moving film (WCAG 2.2.2). */}
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={paused}
          aria-label={paused ? t("playFilm") : t("pauseFilm")}
          data-film-pause
          className="inline-flex size-11 items-center justify-center text-bone opacity-85 [filter:drop-shadow(0_1px_6px_rgb(28_22_14/0.6))] transition-opacity hover:opacity-100"
          data-track={paused ? "film_play" : "film_pause"}
        >
          {paused ? <Play width={16} height={16} /> : <Pause width={16} height={16} />}
        </button>
        </div>
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
