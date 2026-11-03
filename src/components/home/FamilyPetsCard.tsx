"use client";

import { useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Check } from "@/components/ui/Icons";

type Side = "family" | "pets";

/** Family | Pets toggle card: a segmented control (radiogroup, arrow keys) over two crossfading checklists. */
export function FamilyPetsCard({ family, pets }: { family: string[]; pets: string[] }) {
  const t = useTranslations("living");
  const [side, setSide] = useState<Side>("family");
  const id = useId();
  const refs = useRef<Record<Side, HTMLButtonElement | null>>({ family: null, pets: null });

  const onKey = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next: Side = side === "family" ? "pets" : "family";
    setSide(next);
    refs.current[next]?.focus();
  };

  const lists: { key: Side; title: string; items: string[] }[] = [
    { key: "family", title: t("familyTitle"), items: family },
    { key: "pets", title: t("petsTitle"), items: pets },
  ];

  return (
    <div className="card flex h-full flex-col rounded-[20px] bg-bone-deep p-5 md:p-6">
      <div
        role="radiogroup"
        aria-label={`${t("familyToggle")} | ${t("petsToggle")}`}
        className="relative inline-flex w-fit rounded-full bg-bone p-1 shadow-[inset_0_0_0_1px_var(--color-travertine-deep)]"
      >
        <span
          aria-hidden
          className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-basalt transition-transform duration-500 [transition-timing-function:var(--ease-out)]"
          style={{ transform: side === "family" ? "translateX(0)" : "translateX(100%)" }}
        />
        {(["family", "pets"] as Side[]).map((k) => (
          <button
            key={k}
            ref={(el) => {
              refs.current[k] = el;
            }}
            type="button"
            role="radio"
            aria-checked={side === k}
            tabIndex={side === k ? 0 : -1}
            onClick={() => setSide(k)}
            onKeyDown={onKey}
            className={cn(
              "relative z-10 min-h-9 min-w-24 rounded-full px-4 text-[13px] font-semibold transition-colors duration-300",
              side === k ? "text-bone" : "text-charcoal-soft",
            )}
          >
            {k === "family" ? t("familyToggle") : t("petsToggle")}
          </button>
        ))}
      </div>
      <div className="relative mt-5 grid flex-1">
        {lists.map((l) => (
          <div
            key={l.key}
            id={`${id}-${l.key}`}
            aria-hidden={side !== l.key}
            className={cn(
              "[grid-area:1/1] transition-opacity duration-500 [transition-timing-function:var(--ease-out)]",
              side === l.key ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <p className="display-s">{l.title}</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {l.items.map((item, i) => (
                <li
                  key={item}
                  className={cn(
                    "flex items-start gap-2 text-[15px] leading-snug transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-out)]",
                    side === l.key ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                  )}
                  style={{ transitionDelay: side === l.key ? `${80 + i * 50}ms` : "0ms" }}
                >
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brass text-basalt">
                    <Check width={12} height={12} strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
