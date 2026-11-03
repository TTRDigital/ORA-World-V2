"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Calendar, Check, Video } from "@/components/ui/Icons";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";

type Mode = "gallery" | "video";

/**
 * Booking journey: 1 choose gallery or video call, 2 pick a time (Calendly/Cal.com embed from the CMS,
 * lazy-loaded, or a request form note when no URL is set), 3 details, 4 success with what happens next.
 */
export function VisitJourney({ bookingUrl, consentText, galleryAddress }: { bookingUrl: string | null; consentText: string; galleryAddress: string | null }) {
  const t = useTranslations("visit");
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<Mode | null>(null);
  const [embed, setEmbed] = useState(false);
  const steps = [t("choose"), t("booking"), t("details"), t("next")];
  const choose = (m: Mode) => { setMode(m); setStep(2); };
  return (
    <div className="grid gap-6 lg:grid-cols-12" data-testid="visit-journey">
      <ol className="flex gap-2 lg:col-span-3 lg:flex-col" aria-label={t("choose")}>
        {steps.map((s, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "current" : "todo";
          return (
            <li key={s} aria-current={state === "current" ? "step" : undefined} className={cn("flex flex-1 items-center gap-3 rounded-2xl px-3 py-2 text-[14px] font-semibold lg:flex-none", state === "current" ? "bg-basalt text-bone" : "bg-bone-deep text-charcoal-soft")}>
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
              <h2 className="display-s mb-5">{t("choose")}</h2>
              <div role="radiogroup" aria-label={t("choose")} className="grid gap-4 sm:grid-cols-2">
                {([["gallery", Calendar, t("gallery"), galleryAddress ?? t("galleryAddress")], ["video", Video, t("video"), locale === "es" ? "Zoom o Google Meet, 30 minutos" : "Zoom or Google Meet, 30 minutes"]] as const).map(([m, Icon, label, sub]) => (
                  <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => choose(m)} className={cn("card lift flex flex-col items-start gap-3 border p-5 text-left", mode === m ? "border-brass" : "border-travertine-deep")}>
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-bone-deep text-brass-ink"><Icon /></span>
                    <span className="display-s">{label}</span>
                    <span className="small text-charcoal-soft">{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="display-s mb-2">{t("booking")}</h2>
              {bookingUrl ? (
                <div className="frame mt-4 bg-bone" style={{ aspectRatio: "4/3" }}>
                  {embed ? (
                    <iframe src={bookingUrl} title={t("booking")} className="absolute inset-0 h-full w-full" />
                  ) : (
                    <button type="button" onClick={() => setEmbed(true)} className="pill pill-basalt absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{t("booking")}</button>
                  )}
                </div>
              ) : (
                <p className="body text-charcoal-soft">{t("noBooking")}</p>
              )}
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="pill pill-ghost">{locale === "es" ? "Volver" : "Back"}</button>
                <button type="button" onClick={() => setStep(3)} className="pill pill-brass">{t("details")}</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="display-s mb-4">{t("details")}</h2>
              <LeadFormLazy variant="visit" consentText={consentText} defaults={{ visitMode: mode ?? "gallery" }} onSuccess={() => setStep(4)} />
              <button type="button" onClick={() => setStep(2)} className="pill pill-ghost mt-4">{locale === "es" ? "Volver" : "Back"}</button>
            </div>
          )}
          {step === 4 && (
            <div role="status">
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-brass text-basalt"><Check /></span>
              <h2 className="display-s">{t("success", { mode: mode === "video" ? t("video").toLowerCase() : t("gallery").toLowerCase() })}</h2>
              <p className="label mt-6 mb-3">{t("next")}</p>
              <ol className="grid gap-3">
                {t.raw("steps").map((s: string, i: number) => (
                  <li key={s} className="flex items-start gap-3"><span className="numeral text-brass text-[24px]">{String(i + 1).padStart(2, "0")}</span><span className="body">{s}</span></li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
