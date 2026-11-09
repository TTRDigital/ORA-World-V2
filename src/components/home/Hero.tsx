import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { splitAccent } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { HeroStage } from "./HeroStage";
import { WatchFilmButton } from "./WatchFilmButton";

/**
 * Module 1, Hero (client feedback, modelled on idealdentalsolutions.com): the film edge to edge directly under the
 * header, one headline and two buttons in the lower-left corner over a soft gradient. Nothing else.
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
      className="on-dark relative isolate -mx-[var(--gutter)] -mt-[var(--gutter)] flex h-[calc(100svh-76px)] max-h-[860px] min-h-[480px] flex-col justify-end overflow-hidden bg-basalt md:h-[min(56.25vw,calc(100svh-76px))] lg:h-[min(56.25vw,calc(100svh-88px))]"
    >
      <HeroStage
        locale={locale}
        youtubeId={settings.filmYoutubeId}
        mp4={settings.filmMp4}
        webm={settings.filmWebm}
        poster={settings.filmPoster}
      />
      {/* Legibility only where the copy sits: lower left. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-basalt/75 via-basalt/15 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-basalt/40 via-transparent to-transparent md:block" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-10 md:px-8 md:pb-14 lg:px-12 lg:pb-16">
        <h1 id="hero-title" className="display-xl max-w-[20ch] text-bone">
          {words.map((w, i) => (
            <span key={i} className="inline-block whitespace-pre">
              <span className={w.accent ? "accent inline-block" : "inline-block"} data-hero-rise style={rise(80 + i * 60)}>
                {w.text}
              </span>{" "}
            </span>
          ))}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-3" data-hero-rise style={rise(160 + words.length * 60)}>
          <Link href="/visit" className="pill pill-brass min-h-12 px-6" data-track="cta_book_visit" data-track-label="hero">
            {tr(h.ctaPrimary, locale)}
          </Link>
          <WatchFilmButton label={tr(h.ctaFilm, locale)} />
        </div>
      </div>
    </section>
  );
}
