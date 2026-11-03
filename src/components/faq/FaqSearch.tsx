"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Faq } from "@/content/types";
import { cn } from "@/lib/utils";
import { Search } from "@/components/ui/Icons";
import { Accordion } from "./Accordion";

const TOPICS = ["general", "residences", "resilience", "tax", "buying"] as const;

/** Search across every question with topic chips. Used on the homepage, the FAQ page and Ask ORA. */
export function FaqSearch({
  faqs,
  columns = 2,
  compact,
  initialTopic,
  limit,
  featured,
  stagger,
}: {
  faqs: Faq[];
  columns?: 1 | 2;
  compact?: boolean;
  initialTopic?: string;
  limit?: number;
  /** Slugs shown by default (in this order) until the visitor searches or picks a topic. */
  featured?: string[];
  /** Reveal the accordion items with a stagger (homepage). */
  stagger?: boolean;
}) {
  const t = useTranslations("faq");
  const locale = useLocale() as "en" | "es";
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>(initialTopic ?? "all");
  const id = useId();
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && topic === "all" && featured?.length) {
      return featured.map((s) => faqs.find((f) => f.slug === s)).filter((f): f is Faq => Boolean(f));
    }
    return faqs.filter((f) => (topic === "all" || f.topic === topic) && (!q || `${f.question[locale]} ${f.answer[locale].join(" ")}`.toLowerCase().includes(q))).slice(0, limit ?? 100);
  }, [faqs, query, topic, locale, limit, featured]);
  const counts = useMemo(() => Object.fromEntries(TOPICS.map((k) => [k, faqs.filter((f) => f.topic === k).length])), [faqs]);
  useEffect(() => {
    // Items mounted after the initial scan (a new search) register their reveal themselves.
    if (stagger) window.dispatchEvent(new Event("ora2:reveal"));
  }, [results, stagger]);

  return (
    <div>
      <div className={cn("flex flex-col gap-3", !compact && "md:flex-row md:items-center")}>
        <label className="relative block flex-1">
          <span className="visually-hidden">{t("search")}</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-charcoal-soft" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} className="field pl-11" aria-controls={`${id}-results`} />
        </label>
        <div role="group" aria-label={t("all")} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <button type="button" className="chip shrink-0" aria-pressed={topic === "all"} onClick={() => setTopic("all")}>
            {t("all")}
          </button>
          {TOPICS.map((k) => (
            <button key={k} type="button" className="chip shrink-0" aria-pressed={topic === k} onClick={() => setTopic(k)}>
              {t(`topics.${k}`)} <span className="count">{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="small mt-3 text-charcoal-soft" aria-live="polite" id={`${id}-results`}>
        {t("count", { count: results.length })}
      </p>
      {results.length === 0 ? (
        <p className="body mt-4">{t("none")}</p>
      ) : (
        <Accordion items={results.map((f) => ({ id: f.slug, title: f.question[locale], body: f.answer[locale] }))} columns={columns} stagger={stagger} />
      )}
    </div>
  );
}
