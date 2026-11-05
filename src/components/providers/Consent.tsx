"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import Script from "next/script";
import { Link } from "@/i18n/navigation";

const KEY = "ora2_consent";
const EVENT = "ora2:consent";
type Choice = "granted" | "denied" | "unset" | "server";

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
const getSnapshot = (): Choice => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
};
const getServerSnapshot = (): Choice => "server";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Consent Mode v2. Default denied; GTM/GA4 load only after consent. The bar is slim: a single row on
 * desktop, never more than a fifth of a mobile screen.
 */
export function Consent() {
  const t = useTranslations("consent");
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const ga = process.env.NEXT_PUBLIC_GA4_ID;

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer!.push(args);
    };
    window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied", wait_for_update: 500 });
    if (getSnapshot() === "granted") window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
  }, []);

  const decide = (c: "granted" | "denied") => {
    localStorage.setItem(KEY, c);
    window.dispatchEvent(new Event(EVENT));
    if (c === "granted") window.gtag?.("consent", "update", { analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
  };

  return (
    <>
      {choice === "granted" && gtm && <Script id="gtm" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtm.js?id=${gtm}`} />}
      {choice === "granted" && !gtm && ga && (
        <>
          <Script id="ga4" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} />
          <Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga}');`}</Script>
        </>
      )}
      {choice === "unset" && (
        <div role="region" aria-label="Cookie consent" className="fade-in fixed inset-x-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+3.75rem)] z-[70] mx-auto max-w-3xl md:bottom-5 rounded-2xl bg-basalt px-4 py-3 text-bone shadow-lift md:inset-x-auto md:left-1/2 md:w-[min(720px,calc(100%-24px))] md:-translate-x-1/2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="small flex-1 basis-60 text-bone/85">
              {t("text")}{" "}
              <Link href="/privacy" className="underline decoration-brass-light/60 underline-offset-2">
                {t("privacy")}
              </Link>
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => decide("denied")} className="pill pill-ghost on-dark min-h-10 px-4 text-bone">
                {t("decline")}
              </button>
              <button type="button" onClick={() => decide("granted")} className="pill pill-brass min-h-10 px-4">
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
