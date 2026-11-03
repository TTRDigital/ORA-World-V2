"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "@/components/ui/Icons";

type Item = { id: string; title: string; body: string[] };

/** Accessible accordion (button + region) in one or two columns, hairline under the open item. */
export function Accordion({ items, columns = 1, dark }: { items: Item[]; columns?: 1 | 2; dark?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className={cn("mt-4 grid gap-x-8", columns === 2 && "md:grid-cols-2")}>
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <li key={it.id} className={cn("border-b", dark ? "border-brass-light/25" : "border-travertine-deep")}>
            <h3 className="font-sans text-base font-semibold">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`acc-${it.id}`}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex w-full items-start justify-between gap-4 py-4 text-left"
              >
                <span className={cn("hairline", isOpen && "is-active")}>{it.title}</span>
                <Plus className={cn("mt-0.5 shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-out)]", isOpen && "rotate-45", dark ? "text-brass-light" : "text-brass-ink")} />
              </button>
            </h3>
            <div id={`acc-${it.id}`} role="region" hidden={!isOpen} className="pb-5">
              {it.body.map((p, i) => (
                <p key={i} className={cn("body mt-2 text-[15px]", dark ? "text-bone/80" : "text-charcoal-soft")}>
                  {p}
                </p>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
