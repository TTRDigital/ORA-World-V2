"use client";

import { useState } from "react";
import type { Activity, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { Picture } from "@/components/ui/Picture";
import { cn } from "@/lib/utils";

/** Published activities as tabs (roles + arrow keys); each tab shows its group image and items. */
export function ActivitiesTabs({ activities, locale }: { activities: Activity[]; locale: Locale }) {
  const [active, setActive] = useState(0);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const n = e.key === "Home" ? 0 : e.key === "End" ? activities.length - 1 : (i + (e.key === "ArrowRight" ? 1 : activities.length - 1)) % activities.length;
    setActive(n);
    (e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus();
  };
  const cur = activities[active];
  return (
    <div data-testid="activities">
      <div role="tablist" aria-label="Activities" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
        {activities.map((a, i) => (
          <button key={a.slug} role="tab" id={`act-tab-${a.slug}`} aria-selected={active === i} aria-controls={`act-panel-${a.slug}`} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={(e) => onKey(e, i)} className={cn("hairline min-h-11 shrink-0 px-3 text-[14px] font-semibold whitespace-nowrap", active === i ? "is-active text-brass-ink" : "text-charcoal-soft hover:text-charcoal")}>
            {t(a.group, locale)}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`act-panel-${cur.slug}`} aria-labelledby={`act-tab-${cur.slug}`} key={cur.slug} className="fade-in mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Picture image={cur.image} locale={locale} ratio="4/3" rounded="lg" reveal={false} sizes="(max-width: 1024px) 92vw, 40vw" />
        </div>
        <ul className="grid content-start gap-3 sm:grid-cols-2 lg:col-span-7">
          {cur.items.map((it, i) => (
            <li key={it.name.en} className="card p-4" style={{ animation: `fade-in 400ms var(--ease-out) ${i * 40}ms both` }}>
              <p className="font-semibold">{t(it.name, locale)}</p>
              <p className="small mt-1 text-charcoal-soft">{t(it.description, locale)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
