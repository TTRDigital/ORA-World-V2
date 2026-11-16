import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { HeroStage } from "./HeroStage";

/**
 * Hero (client, 16 Nov): the white bar at the top, the film below it, playing at once, and in the middle only
 * "Beyond expectations" (no other text: "really clean"). The film's sound and pause controls sit bottom-left.
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
      {/* Clean (client, 16 Nov): one light, even veil over the film so the words read without a visible shade behind
          them, and a soft bottom edge for the sound controls. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-[rgb(28_24_18/0.2)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 bg-gradient-to-t from-basalt/35 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center">
        <h1 id="hero-title" className="hero-title text-bone [text-shadow:0_2px_30px_rgb(28_22_14/0.45)]">
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
    </section>
  );
}
