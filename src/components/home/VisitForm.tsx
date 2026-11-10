"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Calendar, Video } from "@/components/ui/Icons";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";

type Mode = "gallery" | "video";

/** Segmented control (radiogroup, arrow keys, sliding selection) + the short "visit" lead form. */
export function VisitForm({ consentText, submitLabel }: { consentText: string; submitLabel: string }) {
  const t = useTranslations("visit");
  const [mode, setMode] = useState<Mode>("gallery");
  const id = useId();
  const options: { key: Mode; label: string; note: string; icon: React.ReactNode }[] = [
    {
      key: "gallery",
      label: t("gallery"),
      note: t("galleryNote"),
      icon: <Calendar width={18} height={18} />,
    },
    { key: "video", label: t("video"), note: t("videoNote"), icon: <Video width={18} height={18} /> },
  ];
  const onKey = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next: Mode = mode === "gallery" ? "video" : "gallery";
    setMode(next);
    (e.currentTarget.querySelector<HTMLElement>(`[data-mode="${next}"]`) ?? null)?.focus();
  };
  return (
    <div>
      <p id={`${id}-label`} className="label mb-3">
        {t("choose")}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        onKeyDown={onKey}
        className="relative grid grid-cols-2 rounded-full bg-bone-deep p-1"
      >
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-basalt shadow-[0_6px_16px_-8px_rgb(44_36_22/0.5)] transition-transform duration-300 [transition-timing-function:var(--ease-out)]"
          style={{ transform: mode === "video" ? "translateX(100%)" : "translateX(0)" }}
        />
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={mode === o.key}
            data-mode={o.key}
            tabIndex={mode === o.key ? 0 : -1}
            onClick={() => setMode(o.key)}
            className={cn(
              "relative z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition-colors duration-300",
              mode === o.key ? "text-bone" : "text-charcoal-soft",
            )}
          >
            {o.icon}
            {o.label}
          </button>
        ))}
      </div>
      <p className="small mt-3 mb-4 text-charcoal-soft" aria-live="polite">
        {options.find((o) => o.key === mode)?.note}
      </p>
      <LeadFormLazy
        key={mode}
        variant="visit"
        consentText={consentText}
        defaults={{ visitMode: mode }}
        compact
        short
        submitLabel={submitLabel}
      />
    </div>
  );
}
