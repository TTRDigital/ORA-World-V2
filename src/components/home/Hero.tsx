import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { splitAccent, formatNumber } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { HeroStage } from "./HeroStage";
import { WatchFilmButton } from "./WatchFilmButton";

/**
 * Module 1, Hero: split stage. Left a basalt panel (headline, one factual line, two pills, four stat chips);
 * right the film in a 24px-radius 16:10 frame with four render thumbnails. Mobile: film first, panel below.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  const h = home.hero;
  if (!h.enabled) return null;
  const th = await getTranslations({ locale, namespace: "hero" });

  // Per-word staggered reveal; the accent word keeps its italic.
  const words = splitAccent(tr(h.headline, locale)).flatMap((part) =>
    part.text
      .split(/(\s+)/)
      .filter((w) => w.trim().length > 0)
      .map((w) => ({ text: w, accent: part.accent })),
  );

  return (
    <section id="hero" aria-labelledby="hero-title" className="grid gap-3 lg:grid-cols-12">
      {/* Film stage: first on mobile, right on desktop. */}
      <div className="order-1 min-w-0 lg:order-2 lg:col-span-7">
        <div className="panel panel-bone p-3 md:p-4">
          <HeroStage
            locale={locale}
            youtubeId={settings.filmYoutubeId}
            mp4={settings.filmMp4}
            webm={settings.filmWebm}
            poster={settings.filmPoster}
            thumbnails={h.thumbnails.map((x) => ({ label: tr(x.label, locale), image: x.image }))}
            filmLabel={th("filmFrame")}
          />
        </div>
      </div>

      {/* Basalt panel. */}
      <div
        data-tone="dark"
        className="panel panel-basalt on-dark order-2 flex min-w-0 flex-col justify-between px-6 py-8 md:px-10 md:py-12 lg:order-1 lg:col-span-5"
      >
        <div>
          <p className="label mb-4" data-reveal>
            Dorado · Puerto Rico
          </p>
          <h1 id="hero-title" className="display-xl max-w-[12ch] lg:max-w-none">
            {words.map((w, i) => (
              <span key={i} className="inline-block whitespace-pre">
                <span
                  className={w.accent ? "accent inline-block" : "inline-block"}
                  data-reveal
                  style={{ "--reveal-delay": `${80 + i * 60}ms` } as React.CSSProperties}
                >
                  {w.text}
                </span>{" "}
              </span>
            ))}
          </h1>
          <p
            className="statement mt-6 text-bone/85"
            data-reveal
            style={{ "--reveal-delay": `${120 + words.length * 60}ms` } as React.CSSProperties}
          >
            {tr(h.line, locale)}
          </p>
          <div
            className="mt-8 flex flex-wrap gap-3"
            data-reveal
            style={{ "--reveal-delay": `${200 + words.length * 60}ms` } as React.CSSProperties}
          >
            <Link
              href="/visit"
              className="pill pill-brass min-h-12 px-6"
              data-track="cta_book_visit"
              data-track-label="hero"
            >
              {tr(h.ctaPrimary, locale)}
            </Link>
            <WatchFilmButton label={tr(h.ctaFilm, locale)} />
          </div>
        </div>

        {/* Four stat chips, labelled Tesoro Del Mar. */}
        <div
          className="mt-10 lg:mt-12"
          data-reveal
          style={{ "--reveal-delay": `${280 + words.length * 60}ms` } as React.CSSProperties}
        >
          <p className="label mb-3">{tr(h.statsLabel, locale)}</p>
          <ul
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
            aria-label={tr(h.statsLabel, locale)}
          >
            {h.stats.map((s) => (
              <li
                key={tr(s.label, locale)}
                className="rounded-[18px] bg-basalt-soft px-4 py-3 ring-1 ring-brass-light/15"
              >
                <span
                  className="numeral block text-[28px] text-brass-light md:text-[32px]"
                  data-counter={s.value ?? undefined}
                  data-prefix={s.prefix}
                  data-suffix={s.suffix}
                >
                  {s.value == null
                    ? ""
                    : `${s.prefix ?? ""}${formatNumber(s.value, locale)}${s.suffix ?? ""}`}
                </span>
                <span className="mt-1 block text-[13px] leading-tight text-bone/70">
                  {tr(s.label, locale)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
