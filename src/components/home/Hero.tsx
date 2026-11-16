import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { ArrowRight } from "@/components/ui/Icons";
import { HeroStage } from "./HeroStage";

/**
 * Hero (client, 16 Nov; reference 888.dolcegabbana.com): the film full screen from the very top of the page, under a
 * clear bar that fades in after the opening text; the line appears word by word ("ORA World, where longevity lives",
 * client 15 Nov), then the place, then the one button, "Inquire" (client call, 10 Nov), then a "scroll to continue"
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
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_64%_42%_at_50%_52%,rgb(44_36_22/0.5),rgb(44_36_22/0.16)_62%,transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-basalt/50 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-basalt/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <h1 id="hero-title" className="hero-text-shadow display-xl text-bone">
          {words.map((w, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span className="hero-word" style={{ "--w": i } as React.CSSProperties}>
                {w}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-fade hero-text-shadow mt-5 text-[12px] font-semibold tracking-[0.32em] text-bone/90 uppercase md:text-[13px]" style={{ animationDelay: `${300 + words.length * 140 + 350}ms` }}>
          {tr(cip.hero.sub, locale)}
        </p>
        <div className="hero-fade mt-9 flex justify-center" style={{ animationDelay: `${300 + words.length * 140 + 650}ms` }}>
          <a href="#inquire" className="cta min-h-[52px] px-8" data-track="cta_inquire" data-track-label="hero">
            {es ? "Consultar" : "Inquire"} <ArrowRight width={14} height={14} />
          </a>
        </div>
      </div>

      {/* Scroll to continue */}
      <a
        href="#who"
        data-scroll-cue
        className="hero-fade absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10.5px] font-semibold tracking-[0.3em] text-bone/85 uppercase hover:text-bone sm:flex md:bottom-8"
        style={{ animationDelay: `${300 + words.length * 140 + 1000}ms` }}
      >
        {es ? "Desplácese para continuar" : "Scroll to continue"}
        <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-bone/25">
          <span className="scroll-cue-line absolute inset-0 bg-bone" />
        </span>
      </a>
    </section>
  );
}
