import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import Image from "next/image";
import { HeroStage } from "./HeroStage";

/**
 * Hero (client, 16 Nov; reference 888.dolcegabbana.com): the film full screen from the very top of the page, under a
 * clear bar that fades in after the opening; the opening (client, 16 Nov): on a dark screen the ORA World logo comes in,
 * then "ORA World, where longevity lives" appears word by word, then the film is revealed behind them; then the place, then the one button, "Inquire" (client call, 10 Nov), then a "scroll to continue"
 * cue. Scrolling brings in the white bar (Header). The film's sound and pause buttons sit bottom-left.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  const h = home.hero;
  if (!h.enabled) return null;
  const es = locale === "es";
  const words = tr(cip.hero.title, locale).split(" ");

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-tone="dark"
      className="on-dark relative isolate -mt-[80px] flex h-[100svh] min-h-[560px] flex-col items-center justify-center overflow-hidden bg-basalt px-5 text-center lg:-mt-[96px]"
    >
      <HeroStage locale={locale} youtubeId={settings.filmYoutubeId} mp4={settings.filmMp4} webm={settings.filmWebm} poster={settings.filmPoster} />
      {/* Cinematic, like the reference: an even dark veil over the whole film, a little deeper behind the words. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-[rgb(28_24_18/0.34)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(28_24_18/0.28),transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-44 bg-gradient-to-b from-basalt/50 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-48 bg-gradient-to-t from-basalt/50 to-transparent" />

      {/* The opening (client, 16 Nov): a dark screen; the logo comes in; then the line, word by word; then this curtain
          lifts and the film appears behind them. */}
      <div aria-hidden className="hero-curtain pointer-events-none absolute inset-0 z-[4] bg-basalt" />

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center">
        <Image
          src="/brand/ora-world-logo-white.png"
          alt=""
          width={1200}
          height={845}
          priority
          className="hero-logo h-[96px] w-auto md:h-[128px] lg:h-[150px]"
        />
        <h1 id="hero-title" className="hero-title hero-text-shadow mt-7 text-bone md:mt-9" style={{ "--hero-start": "1300ms" } as React.CSSProperties}>
          {words.map((w, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span className="hero-word" style={{ "--w": i } as React.CSSProperties}>
                {w}
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* Scroll to continue */}
      <a
        href="#who"
        data-scroll-cue
        className="hero-fade absolute bottom-[96px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[12px] tracking-[0.2em] whitespace-nowrap text-bone uppercase hover:text-white lg:bottom-9 lg:text-[13px]"
        style={{ animationDelay: "3900ms" }}
      >
        {es ? "Desplácese para continuar" : "Scroll to continue"}
        <svg aria-hidden width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.2" className="scroll-cue-chevron">
          <path d="M1 1l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
