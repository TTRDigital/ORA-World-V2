"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { leadSchema, type LeadInput, type LeadVariant } from "@/lib/lead-schema";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Check } from "@/components/ui/Icons";

type Props = {
  variant: LeadVariant;
  consentText: string;
  onSuccess?: () => void;
  submitLabel?: string;
  dark?: boolean;
  defaults?: Partial<LeadInput>;
  className?: string;
  compact?: boolean;
};

/**
 * One form component with variants short, full, broker, gate, visit and quiz. Zod on the client mirrors the
 * server schema; a hidden honeypot; Turnstile token when the site key exists; in-page success panel.
 */
export function LeadForm({ variant, consentText, onSuccess, submitLabel, dark, defaults, className, compact }: Props) {
  const t = useTranslations("form");
  const locale = useLocale() as "en" | "es";
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const { register, handleSubmit, formState: { errors } } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { variant, locale, page: pathname, role: "buyer", consent: undefined, ...defaults },
  });

  const onSubmit = async (data: LeadInput) => {
    setStatus("busy");
    try {
      const token = siteKey ? (document.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value ?? "") : undefined;
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, turnstileToken: token }) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      track("lead_submit", { variant });
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  const full = variant === "full" || variant === "visit";
  const broker = variant === "broker";
  const showPhone = variant !== "newsletter";
  const field = (name: keyof LeadInput, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => {
    const err = errors[name]?.message as string | undefined;
    const msg = err ? (name === "email" ? t("invalidEmail") : name === "phone" ? t("invalidPhone") : t("required")) : undefined;
    return (
      <div>
        <label htmlFor={`${variant}-${name}`} className="small mb-1 block font-semibold">
          {label}
        </label>
        <input id={`${variant}-${name}`} className="field" aria-invalid={!!err} aria-describedby={err ? `${variant}-${name}-err` : undefined} {...props} {...register(name)} />
        {msg && (
          <p id={`${variant}-${name}-err`} role="alert" className="small mt-1 text-[#9a3b2e]">
            {msg}
          </p>
        )}
      </div>
    );
  };

  if (status === "done") {
    return (
      <div role="status" className={cn("card p-6 text-center", dark && "card-dark")}>
        <span className="mx-auto mb-3 inline-flex size-12 items-center justify-center rounded-full bg-brass text-basalt">
          <Check />
        </span>
        <p className="display-s">{t("thanks")}</p>
        <p className="body mx-auto mt-2 text-[15px]">{t("received")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("grid gap-4", className)} data-variant={variant}>
      <input type="hidden" {...register("variant")} />
      <input type="hidden" {...register("locale")} />
      <input type="hidden" {...register("page")} />
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        {field("name", t("name"), { autoComplete: "name" })}
        {field("email", t("email"), { type: "email", autoComplete: "email", inputMode: "email" })}
        {showPhone && field("phone", t("phone"), { type: "tel", autoComplete: "tel", inputMode: "tel" })}
        {(full || broker) && (
          <div>
            <label htmlFor={`${variant}-role`} className="small mb-1 block font-semibold">{t("role")}</label>
            <select id={`${variant}-role`} className="field" {...register("role")}>
              <option value="buyer">{t("buyer")}</option>
              <option value="broker">{t("broker")}</option>
            </select>
          </div>
        )}
        {broker && field("licence", t("licence"))}
        {broker && field("brokerage", t("brokerage"))}
        {broker && field("client", t("client"))}
        {variant === "visit" && field("preferred", t("preferred"), { placeholder: "" })}
        {full && (
          <div>
            <label htmlFor={`${variant}-source`} className="small mb-1 block font-semibold">{t("source")}</label>
            <select id={`${variant}-source`} className="field" {...register("source")}>
              <option value=""></option>
              {t.raw("sourceOptions").map((o: string) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {(full || broker) && (
        <div>
          <label htmlFor={`${variant}-message`} className="small mb-1 block font-semibold">{t("message")}</label>
          <textarea id={`${variant}-message`} rows={3} className="field" {...register("message")} />
        </div>
      )}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("company")} />
      <label className="flex items-start gap-3">
        <input type="checkbox" className="mt-1 size-5 accent-[var(--color-brass-ink)]" aria-invalid={!!errors.consent} {...register("consent")} />
        <span className="small">
          {t("consent")}
          {errors.consent && (
            <span role="alert" className="mt-1 block text-[#9a3b2e]">{t("consentRequired")}</span>
          )}
        </span>
      </label>
      <p className="legal max-w-prose opacity-70">{consentText}</p>
      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} data-theme={dark ? "dark" : "light"} />}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status === "busy"} className={cn("pill min-h-12 px-6", dark ? "pill-brass" : "pill-basalt")}>
          {status === "busy" ? t("submitting") : (submitLabel ?? t("submit"))}
        </button>
        {status === "error" && (
          <p role="alert" className="small text-[#9a3b2e]">{t("error")}</p>
        )}
      </div>
    </form>
  );
}
