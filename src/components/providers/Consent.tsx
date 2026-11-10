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
        // Slim strip pinned to the bottom edge so it never competes with the one button on the first screen.
        <div role="region" aria-label="Cookie consent" className="fade-in fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-basalt/95 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] text-bone backdrop-blur-md md:inset-x-auto md:bottom-5 md:left-1/2 md:w-[min(720px,calc(100%-24px))] md:-translate-x-1/2 md:rounded-2xl md:border-0 md:px-5 md:py-3 md:shadow-lift">
          <div className="flex items-center gap-3">
            <p className="flex-1 text-[12.5px] leading-snug text-bone/80 md:text-[14px]">
              {t("text")}{" "}
              <Link href="/privacy" className="underline decoration-brass-light/60 underline-offset-2">
                {t("privacy")}
              </Link>
            </p>
            <div className="flex shrink-0 gap-1.5">
              <button type="button" onClick={() => decide("denied")} className="min-h-10 rounded-full px-3 text-[13px] font-semibold text-bone/80 hover:text-bone">
                {t("decline")}
              </button>
              <button type="button" onClick={() => decide("granted")} className="min-h-10 rounded-full bg-brass px-4 text-[13px] font-semibold text-basalt">
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
