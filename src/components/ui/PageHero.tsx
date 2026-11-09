import type { ImageRef, Locale } from "@/content/types";
import { Headline } from "./Headline";
import { Picture } from "./Picture";
import { cn } from "@/lib/utils";

/** Inner-page opener: label, headline (max three lines) and intro beside a 16:10 render frame. */
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
  /** Up to four key published facts for this page, shown as a row of small tiles. Unknown values read "To be confirmed". */
  facts?: { label: string; value: string }[];
}) {
  return (
    <section className={cn("panel panel-bone container-x", compact ? "py-10 md:py-14" : "section-y")}>
      <div className={cn("grid gap-8", image && "lg:grid-cols-12 lg:items-center")}>
        <div className={cn(image && "lg:col-span-6")}>
          {place && (
            <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-charcoal-soft" data-hero-rise>
              <span aria-hidden className="relative inline-flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-brass/50 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-brass" />
              </span>
              {place}
            </p>
          )}
          <p className="label mb-3" data-hero-rise>{label}</p>
          <div data-hero-rise style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
            <Headline as="h1" size="xl" text={headline} />
          </div>
          {intro && (
            <p className="statement mt-5 text-charcoal-soft" data-hero-rise style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
              {intro}
            </p>
          )}
          {children && <div className="mt-6 flex flex-wrap gap-3" data-hero-rise style={{ "--reveal-delay": "240ms" } as React.CSSProperties}>{children}</div>}
          {facts && facts.length > 0 && (
            <dl className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4" data-hero-rise style={{ "--reveal-delay": "320ms" } as React.CSSProperties} data-testid="page-facts">
              {facts.slice(0, 4).map((f) => (
                <div key={f.label} className="rounded-[16px] bg-bone px-3.5 py-3 shadow-[inset_0_0_0_1px_var(--color-travertine-deep)]">
                  <dt className="text-[12px] font-semibold text-charcoal-soft">{f.label}</dt>
                  <dd className="numeral mt-1 text-[20px] leading-tight text-brass-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {image && (
          <div className="lg:col-span-6">
            <Picture image={image} locale={locale} ratio="16/10" rounded="lg" priority sizes="(max-width: 1024px) 92vw, 46vw" />
          </div>
        )}
      </div>
    </section>
  );
}
