"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Accordion } from "@/components/faq/Accordion";
import { ArrowLeft } from "@/components/ui/Icons";

export type OrientationSection = { slug: string; title: string; summary: string; body: string[]; tags: string[] };
type Answer = "yes" | "no" | "unsure";
const QUESTIONS = ["q1", "q2", "q3"] as const;
type Q = (typeof QUESTIONS)[number];
const TAGS: Record<Q, string> = { q1: "relocating", q2: "business", q3: "residence" };

/**
 * Three-question Act 60 orientation. It only points to the published explainer sections that match the
 * answers; it never says anyone qualifies.
 */
export function Orientation({ sections }: { sections: OrientationSection[] }) {
  const t = useTranslations("invest");
  const tc = useTranslations("common");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<Q, Answer>>>({});
  const [dir, setDir] = useState<1 | -1>(1);
  const groupRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const options: { value: Answer; label: string }[] = [
    { value: "yes", label: tc("yes") },
    { value: "no", label: tc("no") },
    { value: "unsure", label: tc("notSure") },
  ];
  const total = QUESTIONS.length;
  const done = step >= total;
  const current = QUESTIONS[Math.min(step, total - 1)];

  useEffect(() => {
    // Keep keyboard focus inside the stepper as the question changes (only once the visitor has interacted).
    if (!done && touched.current) groupRef.current?.querySelector<HTMLElement>('[role="radio"][aria-checked="true"], [role="radio"]')?.focus();
  }, [step, done]);

  const go = (next: number) => {
    touched.current = true;
    setDir(next > step ? 1 : -1);
    setStep(next);
  };
  const choose = (value: Answer) => {
    touched.current = true;
    setAnswers((a) => ({ ...a, [current]: value }));
    window.setTimeout(() => go(step + 1), 220);
  };
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const radios = Array.from(groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? []);
    const move = (delta: number) => {
      e.preventDefault();
      const j = (i + delta + options.length) % options.length;
      radios[j]?.focus();
      setAnswers((a) => ({ ...a, [current]: options[j].value }));
    };
    if (e.key === "ArrowRight" || e.key === "ArrowDown") move(1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") move(-1);
    else if (e.key === "Enter") {
      e.preventDefault();
      if (answers[current]) go(step + 1);
      else choose(options[i].value);
    }
  };

  const tags = new Set(["general", ...QUESTIONS.filter((q) => answers[q] === "yes").map((q) => TAGS[q])]);
  const matches = sections.filter((s) => s.tags.some((tg) => tags.has(tg)));
  const progress = Math.min(step, total) / total;

  return (
    <div className="card relative overflow-hidden p-5 md:p-7" data-testid="orientation">
      <style>{`@keyframes orientation-in{from{opacity:0;transform:translateY(var(--from))}to{opacity:1;transform:none}}`}</style>
      {/* Progress: three brass dots and a hairline that fills */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" aria-hidden>
          {QUESTIONS.map((q, i) => (
            <span key={q} className={cn("size-2 rounded-full transition-colors duration-500", i < step || done ? "bg-brass" : i === step ? "bg-brass-ink" : "bg-travertine-deep")} />
          ))}
        </div>
        <p className="small tabular font-semibold text-charcoal-soft" aria-live="polite">
          {done ? t("result") : t("progress", { n: step + 1, total })}
        </p>
      </div>
      <div className="relative mt-3 h-px bg-travertine-deep">
        <div className="absolute inset-y-0 left-0 bg-brass transition-[width] duration-700 [transition-timing-function:var(--ease-out)]" style={{ width: `${(done ? 1 : progress) * 100}%` }} />
      </div>

      {/* Answered steps collapse into chips that jump back */}
      {step > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2" aria-label={t("answers")}>
          <span className="label">{t("answers")}</span>
          {QUESTIONS.slice(0, Math.min(step, total)).map((q, i) => {
            const short = t(`short${i + 1}` as "short1");
            return (
              <button key={q} type="button" onClick={() => go(i)} className="chip" aria-label={t("editAnswer", { q: short })}>
                {short} <span className="count">· {options.find((o) => o.value === answers[q])?.label ?? "—"}</span>
              </button>
            );
          })}
        </div>
      )}

      <div key={step} className="mt-6" style={{ animation: "orientation-in 500ms var(--ease-out) both", ["--from" as string]: dir === 1 ? "24px" : "-24px" }}>
        {!done ? (
          <>
            <p className="display-s max-w-[26ch]" id={`orientation-${current}`}>
              {t(current)}
            </p>
            <div ref={groupRef} role="radiogroup" aria-labelledby={`orientation-${current}`} className="mt-5 flex flex-wrap gap-2">
              {options.map((o, i) => {
                const checked = answers[current] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    tabIndex={checked || (!answers[current] && i === 0) ? 0 : -1}
                    onClick={() => choose(o.value)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={cn("pill min-h-12 px-6 transition-transform", checked ? "pill-basalt scale-[1.03]" : "pill-ghost")}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
            {step > 0 && (
              <div className="mt-8 flex items-center gap-3">
                <button type="button" onClick={() => go(step - 1)} className="pill pill-ghost min-h-10 gap-1 px-4">
                  <ArrowLeft width={16} height={16} /> {tc("back")}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="display-s">{t("result")}</p>
            <p className="small mt-2 text-charcoal-soft" aria-live="polite">
              {t("matching", { count: matches.length })}
            </p>
            <Accordion items={matches.map((s) => ({ id: s.slug, title: s.title, body: [s.summary, ...s.body] }))} />
            <p className="small mt-4 rounded-2xl bg-bone-deep px-4 py-3 text-charcoal-soft">{t("notice")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="pill pill-brass min-h-12" onClick={() => window.dispatchEvent(new CustomEvent("ora2:ask", { detail: "book" }))} data-track="talk_to_advisor">
                {tc("talkToAdvisor")}
              </button>
              <Link href="/invest" className="pill pill-ghost min-h-12">
                {t("read")}
              </Link>
              <button
                type="button"
                className="pill pill-ghost min-h-12"
                onClick={() => {
                  setAnswers({});
                  go(0);
                }}
              >
                {t("restart")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
