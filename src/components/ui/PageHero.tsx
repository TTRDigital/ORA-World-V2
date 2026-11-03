import type { ImageRef, Locale } from "@/content/types";
import { Headline } from "./Headline";
import { Picture } from "./Picture";
import { cn } from "@/lib/utils";

/** Inner-page opener: label, headline (max three lines) and intro beside a 16:10 render frame. */
export function PageHero({ locale, label, headline, intro, image, children, compact }: { locale: Locale; label: string; headline: string; intro?: string; image?: ImageRef; children?: React.ReactNode; compact?: boolean }) {
  return (
    <section className={cn("panel panel-bone container-x", compact ? "py-10 md:py-14" : "section-y")}>
      <div className={cn("grid gap-8", image && "lg:grid-cols-12 lg:items-center")}>
        <div className={cn(image && "lg:col-span-6")}>
          <p className="label mb-3" data-reveal>{label}</p>
          <div data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
            <Headline as="h1" size="xl" text={headline} />
          </div>
          {intro && (
            <p className="statement mt-5 text-charcoal-soft" data-reveal style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
              {intro}
            </p>
          )}
          {children && <div className="mt-6 flex flex-wrap gap-3" data-reveal style={{ "--reveal-delay": "240ms" } as React.CSSProperties}>{children}</div>}
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
