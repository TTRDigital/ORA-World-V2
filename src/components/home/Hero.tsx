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

  const es = locale === "es";
  const heroPoster = { ...settings.filmPoster, src: "/videos/hero-film-v5-poster.jpg", width: 1920, height: 1080, focal: "50% 50%", alt: { en: "The ORA World jet on arrival, the opening scene of the Tesoro del Mar film", es: "El jet de ORA World a su llegada, la primera escena de la película de Tesoro del Mar" } };

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-tone="dark"
      className="on-dark relative isolate flex aspect-[3/2] flex-col justify-end overflow-hidden bg-basalt md:aspect-auto md:h-[calc(100svh-80px)] md:min-h-[520px] lg:h-[calc(100svh-96px)]"
    >
      {/* Client, 17 Nov: the banner plays "Tesoro Layout Film v5" (silent, self-hosted, in the server HTML so it starts
          at once); the YouTube film no longer loads here. */}
      {/* Client, 24 Nov (iPhone): on phones the banner is a 3:2 band, so nearly all of each scene shows (not a narrow
          zoomed slice), with "Beyond expectations" written on the film; from tablets up it fills the screen. */}
      <div className="absolute inset-0">
        <HeroStage locale={locale} youtubeId={null} mp4={null} webm={null} poster={heroPoster} />
      </div>
      {/* Client, 16 Nov: the line bottom-left and easy to read: a light veil over the film, and a deeper shade rising
          from the bottom-left corner behind the words. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-[rgb(28_24_18/0.12)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_75%_60%_at_0%_100%,rgb(28_24_18/0.62),rgb(28_24_18/0.2)_55%,transparent_80%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-48 bg-gradient-to-t from-basalt/45 to-transparent" />

      <div className="relative z-10 w-full px-5 pb-6 md:px-10 md:pb-24 lg:px-14 lg:pb-20">
        <div className="mx-auto max-w-[1440px]">
          <h1 id="hero-title" className="hero-title max-w-[12ch] text-left text-bone max-md:!text-[34px] [text-shadow:0_2px_24px_rgb(28_22_14/0.55)]">
            {/* Client, 17 Nov: the line types itself in when the page opens. Every letter is in the HTML from the start
                (search engines and screen readers read the whole line; nothing shifts); each one appears in turn with
                a caret just after it, then the caret blinks and fades. Reduced motion shows the line at once. */}
            {words.map((w, i) => {
              const before = words.slice(0, i).reduce((n, x) => n + x.length + 1, 0);
              return (
                <span key={i}>
                  {i > 0 && " "}
                  <span className="whitespace-nowrap">
                    {Array.from(w).map((ch, j) => (
                      <span key={j} className="type-ch" data-last={i === words.length - 1 && j === w.length - 1 ? "" : undefined} style={{ "--c": before + j } as React.CSSProperties}>
                        {ch}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
          </h1>
          <span aria-hidden className="hero-fade mt-4 block h-px w-24 bg-brass-light md:mt-6" style={{ animationDelay: "2500ms" }} />
        </div>
      </div>

      {/* Scroll prompt (client, 16 Nov: show people they need to scroll down). */}
      <a
        href="#who"
        data-scroll-cue
        className="hero-fade absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 md:flex flex-col items-center gap-2 text-[11px] font-semibold tracking-[0.28em] whitespace-nowrap text-bone uppercase [text-shadow:0_1px_8px_rgb(28_22_14/0.6)] hover:text-white md:bottom-7"
        style={{ animationDelay: "2800ms" }}
      >
        {es ? "Desplácese" : "Scroll down"}
        <span className="scroll-cue-ring flex size-10 items-center justify-center rounded-full ring-1 ring-bone/70 backdrop-blur-[2px]">
          <svg aria-hidden width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="scroll-cue-arrow">
            <path d="M7 1v13M1.5 8.5 7 14l5.5-5.5" />
          </svg>
        </span>
      </a>
    </section>
  );
}
