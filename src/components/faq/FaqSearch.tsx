"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Faq } from "@/content/types";
import { cn } from "@/lib/utils";
import { Search } from "@/components/ui/Icons";
import { Building2, HelpCircle, Landmark, MessageCircle, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Accordion } from "./Accordion";

const TOPICS = ["general", "residences", "resilience", "tax", "buying"] as const;
const TOPIC_ICONS = { all: HelpCircle, general: Sparkles, residences: Building2, resilience: ShieldCheck, tax: Landmark, buying: KeyRound } as const;

/** Search across every question with topic chips. Used on the homepage, the FAQ page and Ask ORA. */
export function FaqSearch({
  faqs,
  columns = 2,
  compact,
  initialTopic,
  limit,
  featured,
  stagger,
  variant = "chips",
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
  /** "centre": a guided help centre with topic tiles and an Ask ORA empty state (homepage and /faq). */
  variant?: "chips" | "centre";
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

  const showingFeatured = !query.trim() && topic === "all" && Boolean(featured?.length);
  const askOra = () => window.dispatchEvent(new CustomEvent("ora2:ask", { detail: "questions" }));

  if (variant === "centre") {
    const tiles = [{ key: "all", count: faqs.length }, ...TOPICS.map((k) => ({ key: k, count: counts[k] }))];
    return (
      <div data-testid="faq-centre">
        <label className="relative block">
          <span className="visually-hidden">{t("search")}</span>
          <Search className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-brass-ink" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchLong")}
            className="field min-h-14 rounded-full pl-13 text-[15px] md:text-[17px]"
            aria-controls={`${id}-results`}
          />
        </label>
        <div role="group" aria-label={t("topicsLabel")} className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map(({ key, count }) => {
            const Icon = TOPIC_ICONS[key as keyof typeof TOPIC_ICONS];
            const on = topic === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setTopic(key)}
                className={cn(
                  "group flex min-h-[76px] flex-col justify-between rounded-[18px] p-3 text-left transition-[background-color,color,box-shadow,transform] duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-0.5",
                  on ? "bg-basalt text-bone shadow-lift" : "bg-bone text-charcoal shadow-[inset_0_0_0_1px_var(--color-travertine-deep)] hover:shadow-lift",
                )}
              >
                <span className="flex items-center justify-between">
                  <Icon aria-hidden size={18} strokeWidth={1.75} className={on ? "text-brass-light" : "text-brass-ink"} />
                  <span aria-hidden className={cn("numeral tabular text-[18px]", on ? "text-brass-light" : "text-brass-ink")}>{count}</span>
                </span>
                <span className="mt-2 text-[14px] leading-tight font-semibold">
                  {key === "all" ? t("all") : t(`topics.${key}`)}
                  <span className="visually-hidden"> ({t("count", { count })})</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex items-baseline justify-between gap-3">
          <p className="label">{showingFeatured ? t("popular") : key4(topic, t)}</p>
          <p className="small text-charcoal-soft" aria-live="polite" id={`${id}-results`}>
            {t("count", { count: results.length })}
          </p>
        </div>
        {results.length === 0 ? (
          <div className="mt-4 flex flex-col items-start gap-4 rounded-[20px] bg-bone p-6 md:flex-row md:items-center md:justify-between" role="status">
            <div>
              <p className="display-s">{t("emptyTitle")}</p>
              <p className="small mt-1 text-charcoal-soft">{t("none")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={askOra} className="pill pill-basalt">
                <MessageCircle aria-hidden size={18} strokeWidth={1.75} className="text-brass-light" /> {t("askOra")}
              </button>
              <Link href="/visit" className="pill pill-ghost">{t("bookVisit")}</Link>
            </div>
          </div>
        ) : (
          <Accordion items={results.map((f) => ({ id: f.slug, title: f.question[locale], body: f.answer[locale] }))} columns={columns} stagger={stagger} />
        )}
        {results.length > 0 && (
          <div className="mt-6 flex flex-col items-start gap-3 rounded-[20px] bg-bone px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] font-semibold">{t("stillCurious")}</p>
            <button type="button" onClick={askOra} className="pill pill-ghost min-h-11">
              <MessageCircle aria-hidden size={18} strokeWidth={1.75} className="text-brass-ink" /> {t("askOra")}
            </button>
          </div>
        )}
      </div>
    );
  }

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
            {t("all")} <span className="count">{faqs.length}</span>
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

function key4(topic: string, t: ReturnType<typeof useTranslations<"faq">>) {
  return topic === "all" ? t("all") : t(`topics.${topic}` as "topics.general");
}
