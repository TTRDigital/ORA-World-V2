import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/Icons";

export type ShowcaseCard = { label: string; items: string[] };

/**
 * The Cipriani "Amenities & features" layout (client, 16 Nov: "this section needs to be like Cipriani"): on the left
 * the numbered eyebrow, a large serif title, one short intro, two cards side by side (a gold label over a dotted list)
 * and one gold button; on the right a large visual (a swipeable gallery or a film card), aligned to the top.
 */
export function CipShowcase({
  id,
  n,
  eyebrow,
  title,
  intro,
  cards,
  cta,
  dark = false,
  children,
}: {
  id: string;
  n: string;
  eyebrow: string;
  title: string;
  intro: string;
  cards: ShowcaseCard[];
  cta?: { href: string; label: string; track: string };
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-tone={dark ? "dark" : "light"}
      className={cn("border-b px-5 py-16 md:px-10 md:py-24", dark ? "on-dark border-basalt bg-basalt text-bone" : "border-travertine-deep/60 bg-white")}
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-14">
        <div className="min-w-0">
          <p className="eyebrow" data-n={n} data-reveal>
            <span className="rule" aria-hidden />
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className={cn("display-l mt-5", dark ? "text-bone" : "text-charcoal")} data-reveal>
            {title}
          </h2>
          <p className={cn("mt-6 max-w-[44ch] text-[16px] leading-relaxed md:text-[17px]", dark ? "text-bone/85" : "text-charcoal")} data-reveal>
            {intro}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2" data-reveal>
            {cards.map((c) => (
              <div key={c.label} className={cn("rounded-[18px] p-6", dark ? "bg-white/[0.06] ring-1 ring-bone/15" : "bg-bone/60 ring-1 ring-travertine-deep/70")}>
                <p className={cn("text-[11px] font-semibold tracking-[0.26em] uppercase", dark ? "text-brass-light" : "text-brass-ink")}>{c.label}</p>
                <ul className="mt-4 space-y-3">
                  {c.items.map((it) => (
                    <li key={it} className={cn("flex gap-2.5 text-[15px] leading-snug", dark ? "text-bone/85" : "text-charcoal")}>
                      <span aria-hidden className={cn("mt-[0.55em] size-1 shrink-0 rounded-full", dark ? "bg-brass-light" : "bg-brass")} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {cta && (
            <a href={cta.href} className="cta mt-8 min-h-[52px] px-8" data-track={cta.track} data-track-label={id} data-reveal>
              {cta.label} <ArrowRight width={14} height={14} />
            </a>
          )}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
