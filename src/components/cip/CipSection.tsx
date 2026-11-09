import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CipTone = "white" | "pale" | "dark";

/**
 * One section of the Cipriani-style homepage: numbered eyebrow, serif capitals heading, one intro line, optional
 * bullet groups and a gold CTA on the left; the visual (a card rail, an image, a form) on the right.
 */
export function CipSection({
  id,
  n,
  eyebrow,
  title,
  intro,
  groups,
  bullets,
  cta,
  tone = "white",
  children,
  wideVisual = true,
  className,
}: {
  id: string;
  n: string;
  eyebrow: string;
  title: string;
  intro?: string;
  groups?: { label: string; items: string[] }[];
  bullets?: string[];
  cta?: ReactNode;
  tone?: CipTone;
  children?: ReactNode;
  wideVisual?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-tone={dark ? "dark" : "light"}
      className={cn(
        "border-b px-5 py-16 md:px-10 md:py-24",
        tone === "white" && "border-travertine-deep/60 bg-white",
        tone === "pale" && "border-travertine-deep/60 bg-bone",
        dark && "on-dark border-basalt bg-basalt text-bone",
        className,
      )}
    >
      <div className={cn("mx-auto grid max-w-[1280px] gap-10 lg:items-start lg:gap-14", wideVisual ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" : "lg:grid-cols-2")}>
        <div className="min-w-0">
          <p className="eyebrow" data-n={n} data-reveal>
            <span className="rule" aria-hidden />
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className={cn("display-l mt-5", dark ? "text-bone" : "text-charcoal")} data-reveal>
            {title}
          </h2>
          {intro && (
            <p className={cn("mt-5 max-w-[46ch] text-[16px] leading-relaxed", dark ? "text-bone/80" : "text-charcoal-soft")} data-reveal>
              {intro}
            </p>
          )}
          {groups && groups.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {groups.map((g) => (
                <div key={g.label} className={cn("rounded-[16px] p-5", dark ? "bg-white/5 ring-1 ring-white/10" : "bg-bone ring-1 ring-travertine-deep/70")} data-reveal>
                  <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-ink uppercase [[data-tone=dark]_&]:text-brass-light">{g.label}</p>
                  <ul className="mt-3 space-y-2.5">
                    {g.items.map((it) => (
                      <li key={it} className={cn("flex gap-2.5 text-[14px] leading-snug", dark ? "text-bone/85" : "text-charcoal-soft")}>
                        <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-brass" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {bullets && bullets.length > 0 && (
            <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {bullets.map((b) => (
                <li key={b} className={cn("flex gap-2.5 text-[14px] leading-snug", dark ? "text-bone/85" : "text-charcoal-soft")} data-reveal>
                  <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-brass" />
                  {b}
                </li>
              ))}
            </ul>
          )}
          {cta && <div className="mt-9 flex flex-wrap gap-3">{cta}</div>}
        </div>
        {children && <div className="min-w-0">{children}</div>}
      </div>
    </section>
  );
}
