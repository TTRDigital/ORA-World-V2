import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { HeroStage } from "./HeroStage";

/**
 * Hero (client, 16 Nov): the white bar at the top, the film below it, playing at once, and in the middle only
 * "Beyond expectations", with the client's sentence under it. A soft shade behind the words keeps them crisp on the
 * bright film. The film's sound and pause controls sit bottom-left.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  const h = home.hero;
  if (!h.enabled) return null;
  const words = tr(cip.hero.title, locale).split(" ");

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-tone="dark"
      className="on-dark relative isolate flex h-[calc(100svh-80px)] min-h-[520px] flex-col items-center justify-center overflow-hidden bg-basalt px-5 text-center lg:h-[calc(100svh-96px)]"
    >
      <HeroStage locale={locale} youtubeId={settings.filmYoutubeId} mp4={settings.filmMp4} webm={settings.filmWebm} poster={settings.filmPoster} />
      {/* Above the film layers (z-3), below the words: a soft shade behind the text and a light bottom edge for the
          sound controls. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_62%_42%_at_50%_50%,rgb(28_24_18/0.45),rgb(28_24_18/0.12)_65%,transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-basalt/45 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center">
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
        <p className="hero-fade hero-text-shadow mt-6 max-w-[40ch] text-[16px] leading-relaxed text-bone md:mt-7 md:text-[19px]" style={{ animationDelay: `${300 + words.length * 140 + 500}ms` }}>
          {tr(cip.hero.line, locale)}
        </p>
      </div>
    </section>
  );
}
