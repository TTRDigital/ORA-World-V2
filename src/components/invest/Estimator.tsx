"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatNumber } from "@/lib/utils";

/** Payment estimator: a hypothetical price and deposit percentage, clearly marked "estimate only". */
export function Estimator() {
  const t = useTranslations("invest");
  const locale = useLocale();
  const [price, setPrice] = useState(1_500_000);
  const [pct, setPct] = useState(20);
  const deposit = Math.round((price * pct) / 100);
  return (
    <div className="card p-6" data-testid="estimator">
      <h3 className="display-s">{t("estimator")}</h3>
      <p className="small mt-1 mb-5 text-brass-ink">{t("estimateOnly")}</p>
      <label className="small block font-semibold" htmlFor="est-price">{t("price")}: <span className="tabular">${formatNumber(price, locale)}</span></label>
      <input id="est-price" type="range" min={500000} max={5000000} step={50000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-2 w-full accent-[var(--color-brass-ink)]" />
      <label className="small mt-4 block font-semibold" htmlFor="est-pct">{t("deposit")}: <span className="tabular">{pct}%</span></label>
      <input id="est-pct" type="range" min={5} max={50} step={5} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="mt-2 w-full accent-[var(--color-brass-ink)]" />
      <dl className="tabular mt-5 grid grid-cols-2 gap-3 border-t border-travertine-deep pt-4 text-[15px]">
        <dt className="text-charcoal-soft">{t("deposit")}</dt><dd className="numeral text-right text-[26px]" aria-live="polite">${formatNumber(deposit, locale)}</dd>
        <dt className="text-charcoal-soft">{t("balance")}</dt><dd className="numeral text-right text-[26px]">${formatNumber(price - deposit, locale)}</dd>
      </dl>
    </div>
  );
}
