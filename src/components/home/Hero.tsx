import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { HeroStage } from "./HeroStage";

/**
 * Hero (client, 16 Nov; reference 888.dolcegabbana.com): the film full screen from the very top of the page, under a
 * clear bar that fades in after the opening text; "ORA WORLD" on top, then the title appears word by word ("A Life To
 * Treasure", client 16 Nov), then the place, then the one button, "Inquire" (client call, 10 Nov), then a "scroll to continue"
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
      {/* The film reads bright: a soft shade behind the words, a light top edge for the clear bar and a light bottom
          edge for the buttons and the scroll cue, plus a text shadow, so the text stays crisp. */}
      {/* Cinematic, like the reference: an even dark veil over the whole film, a little deeper behind the words. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-[rgb(28_24_18/0.34)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(28_24_18/0.28),transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-44 bg-gradient-to-b from-basalt/50 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-48 bg-gradient-to-t from-basalt/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <p className="hero-fade hero-text-shadow mb-5 text-[12px] font-semibold tracking-[0.5em] text-bone uppercase md:mb-6 md:text-[14px]" style={{ animationDelay: "150ms" }}>
          {tr(cip.hero.kicker, locale)}
        </p>
        <h1 id="hero-title" className="hero-title hero-text-shadow text-bone">
          {words.map((w, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span className="hero-word" style={{ "--w": i } as React.CSSProperties}>
                {w}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-fade hero-text-shadow mt-5 text-[11px] font-semibold tracking-[0.2em] text-bone/90 uppercase sm:tracking-[0.32em] md:text-[13px]" style={{ animationDelay: `${300 + words.length * 140 + 350}ms` }}>
          {tr(cip.hero.sub, locale)}
        </p>
      </div>

      {/* Scroll to continue */}
      <a
        href="#who"
        data-scroll-cue
        className="hero-fade absolute bottom-[96px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[12px] tracking-[0.2em] whitespace-nowrap text-bone uppercase hover:text-white lg:bottom-9 lg:text-[13px]"
        style={{ animationDelay: `${300 + words.length * 140 + 800}ms` }}
      >
        {es ? "Desplácese para continuar" : "Scroll to continue"}
        <svg aria-hidden width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.2" className="scroll-cue-chevron">
          <path d="M1 1l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
