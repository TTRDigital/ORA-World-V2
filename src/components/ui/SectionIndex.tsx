"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky in-page index with scroll-spy: the active section's hairline draws, sections reveal as they enter. */
export function SectionIndex({ items, label }: { items: { id: string; title: string }[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label={label} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 lg:sticky lg:top-24 lg:flex-col lg:self-start">
      {items.map((it, n) => (
        <a key={it.id} href={`#${it.id}`} aria-current={active === it.id ? "location" : undefined} className={cn("hairline inline-flex min-h-10 shrink-0 items-center gap-3 px-2 text-[14px] font-semibold", active === it.id ? "is-active text-brass-ink" : "text-charcoal-soft hover:text-charcoal")}>
          <span className="numeral text-brass text-[18px]">{String(n + 1).padStart(2, "0")}</span>
          {it.title}
        </a>
      ))}
    </nav>
  );
}
