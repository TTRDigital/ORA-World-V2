import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { ArrowRight } from "@/components/ui/Icons";
import { HeroStage } from "./HeroStage";

/**
 * Hero (client reference: theresidencesatcipriani.com): the film full screen behind the floating header, a soft
 * dark veil, the brochure's line "A life to treasure" in serif capitals, centred, and one button: "Get price list"
 * (client: "So many CTA … Get price list is enough").
 */
export async function Hero({ locale }: { locale: Locale }) {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  const h = home.hero;
  if (!h.enabled) return null;
  const es = locale === "es";

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-tone="dark"
      className="on-dark relative isolate -mt-[96px] flex h-[100svh] min-h-[560px] flex-col items-center justify-center overflow-hidden bg-basalt px-5 text-center lg:-mt-[104px]"
    >
      <HeroStage locale={locale} youtubeId={settings.filmYoutubeId} mp4={settings.filmMp4} webm={settings.filmWebm} poster={settings.filmPoster} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-basalt/45" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-basalt/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1100px] pt-16">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-bone/85 uppercase" data-hero-rise>
          {tr(cip.hero.sub, locale)}
        </p>
        <h1 id="hero-title" className="display-xl mt-5 text-bone" data-hero-rise style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          {tr(cip.hero.title, locale)}
        </h1>
        <div className="mt-9 flex justify-center" data-hero-rise style={{ "--reveal-delay": "260ms" } as React.CSSProperties}>
          <a href="#contact" className="cta min-h-[52px] px-8" data-track="cta_price_list" data-track-label="hero">
            {es ? "Lista de precios" : "Get price list"} <ArrowRight width={14} height={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
