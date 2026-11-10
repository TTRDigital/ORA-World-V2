import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { ArrowRight } from "@/components/ui/Icons";
import { HeroStage } from "./HeroStage";

/**
 * Hero (client reference: theresidencesatcipriani.com): the film full screen behind the floating header, a soft
 * dark veil, one line in serif capitals, centred ("Live the ORA World legacy", client), and one button: "Inquire"
 * (client call, 10 Nov 2026: one clean call to action). The film's sound toggle sits bottom-left.
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
      {/* Client: the film should read bright. No full veil: only a soft shade behind the words, a light top edge for the
          header and a light bottom edge for the sound button, plus a text shadow, so the text stays crisp. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_38%_at_50%_54%,rgb(44_36_22/0.42),rgb(44_36_22/0.12)_62%,transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-basalt/30 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-basalt/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1100px] pt-16">
        <h1 id="hero-title" className="hero-text-shadow display-xl text-bone" data-hero-rise style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          {tr(cip.hero.title, locale)}
        </h1>
        <div className="mt-9 flex justify-center" data-hero-rise style={{ "--reveal-delay": "260ms" } as React.CSSProperties}>
          <a href="#inquire" className="cta min-h-[52px] px-8" data-track="cta_inquire" data-track-label="hero">
            {es ? "Consultar" : "Inquire"} <ArrowRight width={14} height={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
