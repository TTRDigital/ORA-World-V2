"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { isRegistered, setRegistered } from "@/lib/registration";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { Lock } from "@/components/ui/Icons";

/**
 * One-step registration gate for full plan detail, remembered for a year. While the gate decides
 * (first paint, before the cookie is read) it shows a clean locked card, never a blur.
 */
export function RegistrationGate({ children, consentText, preview }: { children: ReactNode; consentText: string; preview?: ReactNode }) {
  const t = useTranslations("gate");
  const tf = useTranslations("form");
  const [state, setState] = useState<"deciding" | "locked" | "open">("deciding");
  useEffect(() => {
    setState(isRegistered() ? "open" : "locked");
    const on = () => setState("open");
    window.addEventListener("ora2:registered", on);
    return () => window.removeEventListener("ora2:registered", on);
  }, []);
  if (state === "open") return <>{children}</>;
  return (
    <div className="grid gap-6 lg:grid-cols-12" data-testid="gate">
      <div className="lg:col-span-6">{preview}</div>
      <div className="card p-6 md:p-8 lg:col-span-6">
        <span className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-bone-deep text-brass-ink">
          <Lock />
        </span>
        <h2 className="display-s">{t("title")}</h2>
        <p className="body mt-2 mb-5 text-[15px] text-charcoal-soft">{t("text")}</p>
        {state === "locked" && (
          <LeadFormLazy variant="gate" consentText={consentText} submitLabel={tf("unlock")} compact onSuccess={() => setRegistered()} />
        )}
      </div>
    </div>
  );
}
