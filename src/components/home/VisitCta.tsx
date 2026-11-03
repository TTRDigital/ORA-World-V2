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
              "linear-gradient(to top, rgb(28 27 25 / .8), rgb(28 27 25 / .25) 55%, transparent 80%)",
          }}
          aria-hidden
        />
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
      <div className="relative z-10 grid lg:min-h-[640px] lg:grid-cols-12 lg:items-end lg:gap-8 lg:px-10 lg:py-10">
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
        </div>
      </div>
    </section>
  );
}
