import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/Icons";
import { CountUp } from "./CountUp";

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
  body,
  longTitle = false,
  facts,
  cta,
  dark = false,
  tone,
  children,
}: {
  id: string;
  n: string;
  /** the numbered label above the title; omit for none */
  eyebrow?: string;
  title: string;
  intro: string;
  cards: ShowcaseCard[];
  /** a long headline (a full sentence): set smaller so it stays elegant */
  longTitle?: boolean;
  /** a quiet row of figures under the cards (e.g. property specs) */
  facts?: { value: string; label: string }[];
  /** a second paragraph under the intro */
  body?: string;
  cta?: { href: string; label: string; track: string };
  dark?: boolean;
  /** light sections: "white" (default) or "pale" (bone), to alternate like the reference */
  tone?: "white" | "pale";
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-tone={dark ? "dark" : "light"}
      className={cn(
        "border-b px-5 py-16 md:px-10 md:py-24",
        dark
          ? "on-dark border-basalt bg-basalt text-bone"
          : cn("border-travertine-deep/60", tone === "pale" ? "bg-bone" : "bg-white"),
      )}
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-14">
        <div className="min-w-0">
          {eyebrow && (
            <p className="eyebrow mb-5" data-n={n} data-reveal>
              <span className="rule" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h2
            id={`${id}-title`}
            className={cn(
              "display-l",
              longTitle
                ? "!text-[1.75rem] !leading-[1.18] md:!text-[2.125rem] lg:!text-[2.375rem]"
                : "lg:!text-[3rem]",
              dark ? "text-bone" : "text-charcoal",
            )}
            data-reveal
          >
            {title}
          </h2>
          <p
            className={cn(
              "mt-7 max-w-[46ch] text-[16px] leading-8",
              dark ? "text-bone/80" : "text-charcoal-soft",
            )}
            data-reveal
          >
            {intro}
          </p>
          {body && (
            <p
              className={cn(
                "mt-4 max-w-[46ch] text-[15px] leading-7",
                dark ? "text-bone/70" : "text-charcoal-soft",
              )}
              data-reveal
            >
              {body}
            </p>
          )}
          {cards.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2" data-reveal>
              {cards.map((c) => (
                <div
                  key={c.label}
                  className={cn(
                    "rounded-[18px] px-6 pt-7 pb-6",
                    dark
                      ? "bg-white/[0.06] ring-1 ring-bone/15"
                      : "bg-bone/50 ring-1 ring-travertine-deep/70",
                  )}
                >
                  <p
                    className={cn(
                      "text-[11px] font-semibold tracking-[0.26em] uppercase",
                      dark ? "text-brass-light" : "text-brass-ink",
                    )}
                  >
                    {c.label}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {c.items.map((it) => (
                      <li
                        key={it}
                        className={cn(
                          "flex gap-2.5 text-[14px] leading-7",
                          dark ? "text-bone/80" : "text-charcoal-soft",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "mt-[0.6em] size-1 shrink-0 rounded-full",
                            dark ? "bg-brass-light" : "bg-brass",
                          )}
                        />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {facts && facts.length > 0 && (
            <dl
              className={cn(
                "mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4",
                dark ? "text-bone" : "text-charcoal",
              )}
              data-reveal
            >
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-[family-name:var(--font-display)] text-[26px] leading-none">
                    <CountUp value={f.value} />
                  </dd>
                  <dd
                    aria-hidden
                    className={cn(
                      "mt-1 text-[12px] leading-snug",
                      dark ? "text-bone/65" : "text-charcoal-soft",
                    )}
                  >
                    {f.label}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {cta && (
            <a
              href={cta.href}
              className="cta mt-8 min-h-[52px] px-8"
              data-track={cta.track}
              data-track-label={id}
              data-reveal
            >
              {cta.label} <ArrowRight width={14} height={14} />
            </a>
          )}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
