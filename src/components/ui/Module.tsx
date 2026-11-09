import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Headline } from "./Headline";

type Tone = "bone" | "travertine" | "basalt" | "none";

/** A homepage module: a rounded panel with its own label, headline and interaction. */
export function Module({ id, tone = "bone", label, headline, intro, children, className, headerClassName, headlineSize = "l" }: {
  id: string;
  tone?: Tone;
  label?: string;
  headline?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  headlineSize?: "xl" | "l" | "m";
}) {
  const dark = tone === "basalt";
  return (
    <section
      id={id}
      aria-labelledby={headline ? `${id}-title` : undefined}
      data-tone={dark ? "dark" : "light"}
      className={cn("panel section-y container-x", tone === "bone" && "panel-bone", tone === "travertine" && "panel-travertine", dark && "panel-basalt on-dark", className)}
    >
      {(label || headline || intro) && (
        // Centred heading, intro underneath (client reference: zendesk.com), on a 1200px column.
        <header className={cn("mx-auto mb-10 max-w-[760px] text-center md:mb-14", headerClassName)}>
          {label && (
            <p className="label mb-3" data-reveal>
              {label}
            </p>
          )}
          {headline && (
            <div data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
              <Headline id={`${id}-title`} text={headline} size={headlineSize} words />
            </div>
          )}
          {intro && (
            <p className={cn("lead mx-auto mt-4", dark ? "text-bone/80" : "text-charcoal-soft")} data-reveal style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
              {intro}
            </p>
          )}
        </header>
      )}
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}
