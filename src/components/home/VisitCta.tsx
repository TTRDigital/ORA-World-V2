import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { Headline } from "@/components/ui/Headline";
import { VisitForm } from "./VisitForm";

/**
 * Module 12, Book a visit: a full-width rounded frame with the golf exterior render and a gradient,
 * label, headline and text over it, and a floating form card (sales gallery or video call, then the
 * short lead form). Desktop: the render fills the panel behind a two-column grid so the card always
 * fits; mobile: a 3:2 frame with the card overlapping its bottom edge by 48px.
 */
export async function VisitCta({ locale }: { locale: Locale }) {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  const v = home.visit;
  if (!v.enabled) return null;
  const tc = await getTranslations({ locale, namespace: "common" });
  const tv = await getTranslations({ locale, namespace: "visit" });
  const steps = tv.raw("steps") as string[];
  const alt = v.image.alt[locale] || v.image.alt.en;

  return (
    <section id="visit" aria-labelledby="visit-title" className="relative">
      {/* Mobile: image frame with text; desktop: the same frame stretches behind the grid. */}
      <div
        className="frame frame-lg relative aspect-[3/2] lg:absolute lg:inset-0 lg:aspect-auto"
        data-reveal="image"
        data-focal={v.image.focal}
      >
        <Image
          src={v.image.src}
          alt={alt}
          fill
          sizes="calc(100vw - 24px)"
          quality={80}
          className="object-cover"
          style={{ objectPosition: v.image.focal }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(44 36 22 / .8), rgb(44 36 22 / .25) 55%, transparent 80%)",
          }}
          aria-hidden
        />
        {/* Desktop: a left-side scrim so the label, headline and steps read over the bright greens. */}
        <div className="absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(to right, rgb(44 36 22 / .62), rgb(44 36 22 / .2) 48%, transparent 62%)" }} aria-hidden />
        <p className="legal absolute top-4 right-4 rounded-full bg-basalt/50 px-3 py-1 text-bone/80">
          {tc("rendering")}
        </p>
        <div data-tone="dark" className="on-dark absolute inset-x-0 bottom-0 p-6 pb-20 lg:hidden">
          <p className="label mb-3" data-reveal>
            {tr(v.label, locale)}
          </p>
          <div data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties} aria-hidden="true">
            <Headline as="p" text={tr(v.headline, locale)} size="l" className="text-bone" />
          </div>
        </div>
      </div>

      {/* Desktop grid over the image; mobile the card flows under the frame. */}
      <div className="relative z-10 grid lg:min-h-[700px] lg:grid-cols-12 lg:items-end lg:gap-8 lg:px-10 lg:py-10">
        <div data-tone="dark" className="on-dark max-lg:sr-only lg:col-span-6 lg:self-end lg:pb-2">
          <p className="label mb-3" data-reveal>
            {tr(v.label, locale)}
          </p>
          <div data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
            <Headline id="visit-title" text={tr(v.headline, locale)} size="l" className="text-bone" />
          </div>
          <p
            className="lead mt-4 max-w-[46ch] text-bone/85"
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            {tr(v.text, locale)}
          </p>
          {/* What happens after booking, as published on the visit page: three numbered steps on frosted glass. */}
          <div className="mt-6 max-w-[520px] rounded-[20px] bg-basalt/45 p-4 backdrop-blur-md" data-reveal style={{ "--reveal-delay": "220ms" } as React.CSSProperties}>
            <p className="label mb-3">{tv("next")}</p>
            <ol className="grid gap-2.5">
              {steps.map((st, i) => (
                <li key={st} className="flex items-start gap-3 text-[14px] leading-snug text-bone/90">
                  <span className="numeral flex size-7 shrink-0 items-center justify-center rounded-full bg-brass-light/15 text-[13px] text-brass-light" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pt-1">{st}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div
          className="-mt-12 px-3 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:self-center lg:px-0"
          data-reveal
          style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
        >
          <div className="card rounded-[24px] bg-bone p-5 text-charcoal shadow-lift md:p-7">
            <p className="mb-5 text-[15px] leading-relaxed text-charcoal-soft lg:hidden">
              {tr(v.text, locale)}
            </p>
            <VisitForm consentText={settings.consentText[locale]} submitLabel={tr(v.label, locale)} />
          </div>
          {/* Phones: the same three steps follow the card as a compact list. */}
          <div className="mt-4 rounded-[20px] bg-bone-deep p-4 lg:hidden">
            <p className="label mb-3">{tv("next")}</p>
            <ol className="grid gap-2.5">
              {steps.map((st, i) => (
                <li key={st} className="flex items-start gap-3 text-[14px] leading-snug text-charcoal">
                  <span className="numeral flex size-7 shrink-0 items-center justify-center rounded-full bg-bone text-[13px] text-brass-ink" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pt-1">{st}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
