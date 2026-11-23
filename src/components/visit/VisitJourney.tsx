"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Chat, Check, Heart } from "@/components/ui/Icons";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";

type Who = "buyer" | "broker";

/**
 * Contact journey (TTR-3011): 1 the visitor says buyer or broker, 2 a short form (buyers: name, email, phone;
 * brokers: the same plus a message), sent through /api/lead with lead_type, 3 one thank-you confirmation.
 * The team then calls the lead and books from ORA World OS. No calendar or booking here, no person's name.
 */
export function VisitJourney({ consentText }: { consentText: string }) {
  const t = useTranslations("visit");
  const [step, setStep] = useState(1);
  const [who, setWho] = useState<Who | null>(null);
  const steps = [t("who"), t("details"), t("doneStep")];
  const choose = (w: Who) => {
    setWho(w);
    setStep(2);
  };
  return (
    <div className="grid gap-6 lg:grid-cols-12" data-testid="visit-journey">
      <ol className="flex gap-2 lg:col-span-3 lg:flex-col" aria-label={t("who")}>
        {steps.map((s, i) => {
          const n = i + 1;
          const state = n < step || step === 3 ? "done" : n === step ? "current" : "todo";
          return (
            <li key={n} aria-current={n === step ? "step" : undefined} className={cn("flex flex-1 items-center gap-3 rounded-2xl px-3 py-2 text-[14px] font-semibold lg:flex-none", n === step ? "bg-basalt text-bone" : "bg-bone-deep text-charcoal-soft")}>
              <span className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[12px]", state === "done" ? "bg-brass text-basalt" : state === "current" ? "bg-brass-light text-basalt" : "bg-travertine")}>{state === "done" ? <Check width={14} height={14} /> : n}</span>
              <span className="hidden sm:inline">{s}</span>
            </li>
          );
        })}
      </ol>
      <div className="card p-6 md:p-8 lg:col-span-9" key={step}>
        <div className="fade-in">
          {step === 1 && (
            <div>
              <h2 className="display-s mb-5">{t("who")}</h2>
              <div role="radiogroup" aria-label={t("who")} className="grid gap-4 sm:grid-cols-2">
                {([["buyer", Heart, t("buyer"), t("buyerSub")], ["broker", Chat, t("broker"), t("brokerSub")]] as const).map(([w, Icon, label, sub]) => (
                  <button key={w} type="button" role="radio" aria-checked={who === w} onClick={() => choose(w)} data-who={w} className={cn("card lift flex flex-col items-start gap-3 border p-5 text-left", who === w ? "border-brass" : "border-travertine-deep")}>
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-bone-deep text-brass-ink"><Icon /></span>
                    <span className="display-s">{label}</span>
                    <span className="small text-charcoal-soft">{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && who && (
            <div>
              <h2 className="display-s mb-1">{t("details")}</h2>
              <p className="small mb-5 text-charcoal-soft">{who === "buyer" ? t("buyerNote") : t("brokerNote")}</p>
              <LeadFormLazy key={who} variant="visit" leadType={who} short withMessage={who === "broker"} consentText={consentText} onSuccess={() => setStep(3)} />
              <button type="button" onClick={() => setStep(1)} className="pill pill-ghost mt-4">{t("back")}</button>
            </div>
          )}
          {step === 3 && (
            <div role="status" data-testid="visit-thanks">
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-brass text-basalt"><Check /></span>
              <h2 className="display-s">{t("doneTitle")}</h2>
              <p className="body mt-2 max-w-prose">{t("doneText")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
