import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { splitAccent } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { HeroStage } from "./HeroStage";
import { WatchFilmButton } from "./WatchFilmButton";

/**
 * Module 1, Hero: one banner, the film (client feedback: the split panel + film stage was too busy; one section,
 * the video as the banner). The film covers a rounded full-width panel; a basalt gradient carries the label,
 * headline, one factual line, two pills and a quiet row of four published figures.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  const h = home.hero;
  if (!h.enabled) return null;

  // Per-word staggered reveal; the accent word keeps its italic.
  const words = splitAccent(tr(h.headline, locale)).flatMap((part) =>
    part.text
      .split(/(\s+)/)
      .filter((w) => w.trim().length > 0)
      .map((w) => ({ text: w, accent: part.accent })),
  );

  const rise = (i: number) => ({ "--reveal-delay": `${i}ms` }) as React.CSSProperties;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-tone="dark"
      className="panel on-dark relative isolate flex h-[calc(100svh-150px)] max-h-[940px] min-h-[520px] flex-col justify-end bg-basalt md:h-[calc(100svh-166px)] lg:h-[calc(100svh-184px)] lg:min-h-[520px]"
    >
      <HeroStage
        locale={locale}
        youtubeId={settings.filmYoutubeId}
        mp4={settings.filmMp4}
        webm={settings.filmWebm}
        poster={settings.filmPoster}
      />
      {/* Legibility: darker at the bottom and on the left, where the copy sits; the film stays clear above. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-basalt/90 via-basalt/35 to-basalt/5" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-basalt/55 via-basalt/10 to-transparent md:block" />

      <div className="relative z-10 px-6 pb-8 md:px-12 md:pb-12 lg:px-16 lg:pb-16">
        <p className="label mb-4" data-hero-rise>
          Dorado · Puerto Rico
        </p>
        <h1 id="hero-title" className="display-xl max-w-[13ch] text-bone">
          {words.map((w, i) => (
            <span key={i} className="inline-block whitespace-pre">
              <span className={w.accent ? "accent inline-block" : "inline-block"} data-hero-rise style={rise(80 + i * 60)}>
                {w.text}
              </span>{" "}
            </span>
          ))}
        </h1>
        <p className="statement mt-5 max-w-[46ch] text-bone/90 max-md:text-[18px]" data-hero-rise style={rise(120 + words.length * 60)}>
          {tr(h.line, locale)}
        </p>
        <div className="mt-7 flex flex-wrap gap-3" data-hero-rise style={rise(200 + words.length * 60)}>
          <Link href="/visit" className="pill pill-brass min-h-12 px-6" data-track="cta_book_visit" data-track-label="hero">
            {tr(h.ctaPrimary, locale)}
          </Link>
          <WatchFilmButton label={tr(h.ctaFilm, locale)} />
        </div>

      </div>
    </section>
  );
}
