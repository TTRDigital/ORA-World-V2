import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { ClipOverlay } from "./ClipOverlay";
import { cn, splitAccent } from "@/lib/utils";

/**
 * Inner-page opener in the homepage layout (client, 18 Nov: "every page should have the homepage layout"): the picture
 * (or its film) runs edge to edge under the white bar, a soft shade rises from the bottom-left, and the label, the
 * serif title, the line and any buttons sit at the bottom left. Pages without a picture get the same opener on Deep
 * Earth, shorter.
 */
export function PageHero({
  locale,
  label,
  headline,
  intro,
  image,
  children,
  compact,
  place,
  facts,
}: {
  locale: Locale;
  label: string;
  headline: string;
  intro?: string;
  image?: ImageRef;
  children?: React.ReactNode;
  compact?: boolean;
  /** A location line above the label, e.g. "Dorado · Puerto Rico". */
  place?: string;
  /** Up to four key published facts for this page, shown as a row of small figures. */
  facts?: { label: string; value: string }[];
}) {
  const tall = !!image && !compact;
  return (
    <section
      data-tone="dark"
      className={cn(
        "on-dark relative isolate flex flex-col justify-end overflow-hidden bg-basalt text-bone",
        tall ? "min-h-[560px] md:h-[calc(82svh-96px)] md:min-h-[600px]" : image ? "min-h-[440px] md:min-h-[480px]" : "min-h-[340px] md:min-h-[380px]",
      )}
    >
      {image && (
        <div className="absolute inset-0 -z-10" data-hero-image data-focal={image.focal}>
          <Image src={image.src} alt={image.alt[locale] || image.alt.en} fill priority fetchPriority="high" sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: image.focal }} />
          {image.video && <ClipOverlay src={image.video} poster={image.poster} focal={image.focal} />}
          <span aria-hidden className="absolute inset-0 bg-[rgb(28_24_18/0.18)]" />
          <span aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_0%_100%,rgb(28_24_18/0.72),rgb(28_24_18/0.25)_55%,transparent_82%)]" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-basalt/60 to-transparent" />
        </div>
      )}
      <div className="relative w-full px-5 pt-28 pb-12 md:px-10 md:pb-16 lg:px-14 lg:pb-20">
        <div className="mx-auto max-w-[1440px]">
          {place && (
            <p className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-bone/85" data-hero-rise>
              <span aria-hidden className="relative inline-flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-brass-light/60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-brass-light" />
              </span>
              {place}
            </p>
          )}
          <p className="eyebrow !text-bone/90 [text-shadow:0_1px_10px_rgb(28_22_14/0.6)]" data-hero-rise>
            <span className="rule" aria-hidden />
            {label}
          </p>
          <h1
            className="mt-5 max-w-[18ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.04] font-normal text-bone [text-shadow:0_2px_24px_rgb(28_22_14/0.45)] md:text-[64px] lg:text-[76px]"
            data-hero-rise
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            {splitAccent(headline).map((p, i) => (p.accent ? <em key={i} className="text-brass-light italic">{p.text}</em> : <span key={i}>{p.text}</span>))}
          </h1>
          {intro && (
            <p className="mt-5 max-w-[56ch] text-[16px] leading-relaxed text-bone/85 md:text-[18px]" data-hero-rise style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
              {intro}
            </p>
          )}
          {children && (
            <div className="page-hero-actions mt-7 flex flex-wrap gap-3" data-hero-rise style={{ "--reveal-delay": "240ms" } as React.CSSProperties}>
              {children}
            </div>
          )}
          {facts && facts.length > 0 && (
            <dl className="mt-8 grid max-w-[720px] grid-cols-2 gap-x-8 gap-y-4 border-t border-bone/20 pt-6 sm:grid-cols-4" data-hero-rise style={{ "--reveal-delay": "320ms" } as React.CSSProperties} data-testid="page-facts">
              {facts.slice(0, 4).map((f) => (
                <div key={f.label}>
                  <dt className="text-[12px] text-bone/70">{f.label}</dt>
                  <dd className="mt-1 font-[family-name:var(--font-display)] text-[24px] leading-tight text-bone [font-variant-numeric:lining-nums]">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
