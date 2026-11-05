"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";
import { Play } from "@/components/ui/Icons";
import { FilmLightbox } from "./FilmLightbox";

type Thumb = { label: string; image: ImageRef };

type Props = {
  locale: Locale;
  youtubeId: string | null;
  mp4: string | null;
  webm: string | null;
  poster: ImageRef;
  thumbnails: Thumb[];
  filmLabel: string;
};

const YT_ORIGIN = "https://www.youtube-nocookie.com";

/**
 * The film in a 24px-radius 16:10 frame (never full-bleed) with four render thumbnails under it.
 * Poster first (priority). The YouTube iframe mounts only after window load + idle, and the poster
 * fades out only once the IFrame API reports playerState 1 through the "listening" handshake. If
 * YouTube never plays, the poster stays. Captions are unloaded repeatedly for 20 s. The iframe is
 * oversized to 130% inside the overflow-hidden frame so no player chrome is visible.
 */
export function HeroStage({ locale, youtubeId, mp4, webm, poster, thumbnails, filmLabel }: Props) {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const [mount, setMount] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState<number>(-1); // -1 = film
  const [lightbox, setLightbox] = useState(false);
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
    post({ event: "command", func: "mute", args: [] });
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

  // Self-hosted loop: play/pause follows the active render.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (active === -1) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  // YouTube: pause the frame while a render is shown, resume on "Resume film".
  useEffect(() => {
    if (selfHosted || !mount) return;
    post({ event: "command", func: active === -1 ? "playVideo" : "pauseVideo", args: [] });
  }, [active, selfHosted, mount, post]);

  const embed =
    youtubeId && mount && !selfHosted && typeof window !== "undefined"
      ? `${YT_ORIGIN}/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
      : null;

  const showFilm = active === -1;
  const current = active >= 0 ? thumbnails[active] : null;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div
        className="frame frame-lg relative"
        style={{ aspectRatio: "16/10" }}
        data-hero-image
        data-focal={poster.focal}
        data-film-state={playing ? "playing" : "poster"}
      >
        {/* Poster render: priority, sharp, over travertine. */}
        <Image
          src={poster.src}
          alt={poster.alt[locale] || poster.alt.en}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1023px) calc(100vw - 24px), 56vw"
          quality={80}
          className={cn(
            "object-cover transition-opacity duration-700 [transition-timing-function:var(--ease-out)]",
            playing && showFilm ? "opacity-0" : "opacity-100",
          )}
          style={{ objectPosition: poster.focal }}
        />
        {/* Player, oversized to hide the chrome. */}
        {embed && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <iframe
              ref={iframe}
              src={embed}
              title={t("filmTitle")}
              tabIndex={-1}
              allow="autoplay; encrypted-media"
              className={cn(
                "absolute top-1/2 left-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700",
                playing && showFilm ? "opacity-100" : "opacity-0",
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
            poster={undefined}
            aria-hidden="true"
            tabIndex={-1}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              playing && showFilm ? "opacity-100" : "opacity-0",
            )}
            style={{ objectPosition: poster.focal }}
          >
            {webm && <source src={webm} type="video/webm" />}
            {mp4 && <source src={mp4} type="video/mp4" />}
          </video>
        )}
        {/* Selected render, crossfaded over the film frame. */}
        {thumbnails.map((th, i) => (
          <Image
            key={th.label}
            src={th.image.src}
            alt={active === i ? th.image.alt[locale] || th.image.alt.en : ""}
            fill
            sizes="(max-width: 1023px) calc(100vw - 24px), 56vw"
            quality={80}
            aria-hidden={active !== i}
            className={cn(
              "object-cover transition-opacity duration-[600ms] [transition-timing-function:var(--ease-out)]",
              active === i ? "opacity-100" : "opacity-0",
            )}
            style={{ objectPosition: th.image.focal }}
          />
        ))}
        {/* Resume film pill appears over a paused render. */}
        <div
          className={cn(
            "absolute right-4 bottom-4 transition-opacity duration-500",
            showFilm ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <button
            type="button"
            onClick={() => setActive(-1)}
            className="pill pill-bone min-h-11 gap-2 shadow-lift"
            tabIndex={showFilm ? -1 : 0}
          >
            <Play className="text-brass-ink" width={16} height={16} />
            {tc("resumeFilm")}
          </button>
        </div>
        <p className="visually-hidden" aria-live="polite">
          {current ? t("nowShowing", { label: current.label }) : playing ? t("filmPlaying") : ""}
        </p>
      </div>

      {/* Thumbnails: a swipe row on mobile, a four-up row on desktop. */}
      <div
        role="group"
        aria-label={t("thumbnails")}
        className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0"
      >
        <button
          type="button"
          onClick={() => setActive(-1)}
          aria-pressed={showFilm}
          className={cn(
            "group relative w-[31vw] shrink-0 snap-start rounded-[16px] text-left lg:w-auto",
            "focus-visible:outline-offset-4",
          )}
        >
          <span
            className="frame relative block w-full overflow-hidden rounded-[16px] bg-basalt-soft"
            style={{ aspectRatio: "16/10" }}
          >
            <Image
              src={poster.src}
              alt=""
              fill
              sizes="(max-width: 1023px) 31vw, 11vw"
              quality={80}
              className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: poster.focal }}
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-bone/90 text-brass-ink">
                <Play width={16} height={16} />
              </span>
            </span>
          </span>
          <span
            className={cn(
              "hairline mt-2 inline-block text-[13px] font-semibold text-charcoal",
              showFilm && "is-active",
            )}
          >
            {filmLabel}
          </span>
        </button>
        {thumbnails.map((th, i) => (
          <button
            key={th.label}
            type="button"
            onClick={() => setActive(active === i ? -1 : i)}
            aria-pressed={active === i}
            aria-label={t("showRender", { label: th.label })}
            className="group relative w-[31vw] shrink-0 snap-start rounded-[16px] text-left lg:w-auto"
          >
            <span
              className="frame relative block w-full overflow-hidden rounded-[16px]"
              style={{ aspectRatio: "16/10" }}
            >
              <Image
                src={th.image.src}
                alt=""
                fill
                sizes="(max-width: 1023px) 31vw, 11vw"
                quality={80}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: th.image.focal }}
              />
            </span>
            <span
              className={cn(
                "hairline mt-2 inline-block text-[13px] font-semibold text-charcoal",
                active === i && "is-active",
              )}
            >
              {th.label}
            </span>
          </button>
        ))}
      </div>

      <FilmLightbox youtubeId={youtubeId} mp4={mp4} open={lightbox} onClose={() => setLightbox(false)} />
      {/* The "Watch the film" pill in the basalt panel dispatches this event. */}
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
