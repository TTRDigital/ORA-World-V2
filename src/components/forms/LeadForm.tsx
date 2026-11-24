"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { leadSchema, type LeadInput, type LeadVariant } from "@/lib/lead-schema";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Check } from "@/components/ui/Icons";
import { readPicks, picksMessage, onPicks } from "@/lib/finish-selection";
import { readAttribution } from "@/lib/attribution";

type Props = {
  variant: LeadVariant;
  consentText: string;
  onSuccess?: () => void;
  submitLabel?: string;
  dark?: boolean;
  defaults?: Partial<LeadInput>;
  className?: string;
  compact?: boolean;
  /** Short set of fields only (name, email, phone, preferred time): used by CTA cards. */
  short?: boolean;
};

/**
 * One form component with variants short, full, broker, gate, visit, quiz and reserve. Zod on the client mirrors the
 * server schema; a hidden honeypot; Turnstile token when the site key exists; in-page success panel.
 */
export function LeadForm({
  variant,
  consentText,
  onSuccess,
  submitLabel,
  dark,
  defaults,
  className,
  compact,
  short,
}: Props) {
  const t = useTranslations("form");
  const locale = useLocale() as "en" | "es";
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    // No pre-selected buyer/broker choice: the visitor must pick one (the broker registration form is always "broker").
    defaultValues: { variant, locale, page: pathname, consent: undefined, ...defaults, ...(variant === "broker" ? { lead_type: "broker" as const } : {}) },
  });

  // Client, 18 Nov: finishes picked on the Finishes page arrive in the message, ready to send (the visitor can edit it).
  useEffect(() => {
    let last = "";
    const fill = () => {
      const msg = picksMessage(readPicks(), locale === "es");
      const cur = getValues("message") ?? "";
      if (msg && (!cur || cur === last)) {
        setValue("message", msg);
        last = msg;
      }
    };
    fill();
    return onPicks(fill);
  }, [getValues, setValue, locale]);

  const onSubmit = async (data: LeadInput) => {
    setStatus("busy");
    try {
      const token = siteKey
        ? (document.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value ?? "")
        : undefined;
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Where the visitor came from (src/lib/attribution.ts), under the same field names.
        body: JSON.stringify({ ...readAttribution(), ...data, turnstileToken: token }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      track("lead_submit", { variant });
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  const reserve = variant === "reserve";
  const full = !short && (variant === "full" || variant === "visit");
  const broker = variant === "broker";
  const showPhone = variant !== "newsletter";
  const field = (
    name: keyof LeadInput,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => {
    const err = errors[name]?.message as string | undefined;
    const msg = err
      ? name === "email"
        ? t("invalidEmail")
        : name === "phone"
          ? t("invalidPhone")
          : t("required")
      : undefined;
    return (
      <div>
        <label htmlFor={`${variant}-${name}`} className="small mb-1 block font-semibold">
          {label}
        </label>
        <input
          id={`${variant}-${name}`}
          className="field"
          aria-invalid={!!err}
          aria-describedby={err ? `${variant}-${name}-err` : undefined}
          {...props}
          {...register(name)}
        />
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("grid gap-4", className)}
      data-variant={variant}
      data-ttr-skip
    >
      <input type="hidden" {...register("variant")} />
      <input type="hidden" {...register("locale")} />
      <input type="hidden" {...register("page")} />
      {broker ? (
        <input type="hidden" {...register("lead_type")} />
      ) : (
        <fieldset aria-describedby={errors.lead_type ? `${variant}-lead_type-err` : undefined}>
          <legend className="small mb-1 block font-semibold">{t("role")}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["buyer", "broker"] as const).map((v) => (
              <label
                key={v}
                className={cn(
                  "field flex cursor-pointer items-center gap-3 font-semibold has-checked:shadow-[inset_0_0_0_2px_var(--color-brass-ink)]! has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brass-ink",
                  errors.lead_type && "shadow-[inset_0_0_0_2px_#9a3b2e]!",
                )}
              >
                <input
                  type="radio"
                  value={v}
                  className="size-5 shrink-0 accent-[var(--color-brass-ink)]"
                  aria-describedby={errors.lead_type ? `${variant}-lead_type-err` : undefined}
                  {...register("lead_type")}
                />
                <span className="text-[15px]">{t(v === "buyer" ? "leadTypeBuyer" : "leadTypeBroker")}</span>
              </label>
            ))}
          </div>
          {errors.lead_type && (
            <p id={`${variant}-lead_type-err`} role="alert" className="small mt-1 text-[#9a3b2e]">
              {t("leadTypeRequired")}
            </p>
          )}
        </fieldset>
      )}
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        {field("name", t("name"), { autoComplete: "name" })}
        {field("email", t("email"), { type: "email", autoComplete: "email", inputMode: "email" })}
        {showPhone && field("phone", t("phone"), { type: "tel", autoComplete: "tel", inputMode: "tel" })}
        {broker && field("licence", t("licence"))}
        {broker && field("brokerage", t("brokerage"))}
        {broker && field("client", t("client"))}
        {variant === "visit" && field("preferred", t("preferred"), { placeholder: "" })}
        {reserve && field("residence", t("residence"), { placeholder: t("residenceHint") })}
        {full && (
          <div>
            <label htmlFor={`${variant}-goal`} className="small mb-1 block font-semibold">
              {t("goal")}
            </label>
            <select id={`${variant}-goal`} className="field" {...register("goal")}>
              <option value=""></option>
              {t.raw("goalOptions").map((o: string) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        )}
        {full && (
          <div>
            <label htmlFor={`${variant}-source`} className="small mb-1 block font-semibold">
              {t("source")}
            </label>
            <select id={`${variant}-source`} className="field" {...register("source")}>
              <option value=""></option>
              {t.raw("sourceOptions").map((o: string) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {(full || broker || reserve) && (
        <div>
          <label htmlFor={`${variant}-message`} className="small mb-1 block font-semibold">
            {t("message")}
          </label>
          <textarea id={`${variant}-message`} rows={3} className="field" {...register("message")} />
        </div>
      )}
      {reserve && (
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 size-5 accent-[var(--color-brass-ink)]" {...register("attorney")} />
          <span className="small">{t("attorney")}</span>
        </label>
      )}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("company")}
      />
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 size-5 accent-[var(--color-brass-ink)]"
          aria-invalid={!!errors.consent}
          {...register("consent")}
        />
        <span className="small">
          {t("consent")}
          {errors.consent && (
            <span role="alert" className="mt-1 block text-[#9a3b2e]">
              {t("consentRequired")}
            </span>
          )}
        </span>
      </label>
      <p className="legal max-w-prose opacity-70">{consentText}</p>
      {siteKey && (
        <div className="cf-turnstile" data-sitekey={siteKey} data-theme={dark ? "dark" : "light"} />
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "busy"}
          className={cn("pill min-h-12 px-6", dark ? "pill-brass" : "pill-basalt")}
        >
          {status === "busy" ? t("submitting") : (submitLabel ?? t("submit"))}
        </button>
        {status === "error" && (
          <p role="alert" className="small text-[#9a3b2e]">
            {t("error")}
          </p>
        )}
      </div>
    </form>
  );
}
