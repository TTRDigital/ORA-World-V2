"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { track } from "@/lib/analytics";

export function NewsletterForm({ dark }: { dark?: boolean }) {
  const t = useTranslations("form");
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fd.get("email"), locale, company: fd.get("company") || "" }) });
      if (!res.ok) throw new Error();
      setState("done");
      track("newsletter_signup");
    } catch {
      setState("error");
    }
  };
  if (state === "done") return <p role="status" className="small text-brass-light">{t("newsletterSuccess")}</p>;
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row" aria-label={t("newsletter")}>
      <label className="visually-hidden" htmlFor="newsletter-email">{t("email")}</label>
      <input id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder={t("newsletterPlaceholder")} className="field flex-1" />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" defaultValue="" />
      <button type="submit" disabled={state === "busy"} className={dark ? "pill pill-brass" : "pill pill-basalt"}>
        {state === "busy" ? t("submitting") : t("newsletter")}
      </button>
      {state === "error" && <p role="alert" className="small text-red-300">{t("error")}</p>}
    </form>
  );
}
