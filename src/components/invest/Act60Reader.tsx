"use client";

import { useState } from "react";
import type { Incentive, Locale } from "@/content/types";
import { t, tp } from "@/lib/localize";
import { cn } from "@/lib/utils";

/** The published Act 60 explainer as tabs (roles + arrow keys), one section per tab, summary first. */
export function Act60Reader({ incentives, locale }: { incentives: Incentive[]; locale: Locale }) {
  const [active, setActive] = useState(0);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const n = e.key === "Home" ? 0 : e.key === "End" ? incentives.length - 1 : (i + (e.key === "ArrowRight" ? 1 : incentives.length - 1)) % incentives.length;
    setActive(n);
    (e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus();
  };
  const cur = incentives[active];
  return (
    <div className="grid gap-6 lg:grid-cols-12" data-testid="act60-reader">
      <div role="tablist" aria-orientation="vertical" className="no-scrollbar flex gap-1 overflow-x-auto lg:col-span-4 lg:flex-col" aria-label="Act 60">
        {incentives.map((inc, i) => (
          <button key={inc.slug} role="tab" id={`act60-tab-${inc.slug}`} aria-selected={active === i} aria-controls={`act60-panel-${inc.slug}`} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={(e) => onKey(e, i)} className={cn("hairline flex min-h-11 shrink-0 items-center gap-3 rounded-2xl px-3 text-left text-[14px] font-semibold", active === i ? "is-active bg-bone text-brass-ink" : "text-charcoal-soft hover:text-charcoal")}>
            <span className="numeral text-brass text-[20px]">{String(i + 1).padStart(2, "0")}</span>
            <span className="whitespace-nowrap lg:whitespace-normal">{t(inc.title, locale)}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`act60-panel-${cur.slug}`} aria-labelledby={`act60-tab-${cur.slug}`} className="card fade-in p-6 md:p-8 lg:col-span-8" key={cur.slug}>
        <h3 className="display-m">{t(cur.title, locale)}</h3>
        <p className="statement mt-3 text-charcoal-soft">{t(cur.summary, locale)}</p>
        <div className="rule my-5" />
        {tp(cur.body, locale).map((p, i) => (
          <p key={i} className="body mb-3 text-charcoal-soft">{p}</p>
        ))}
      </div>
    </div>
  );
}
