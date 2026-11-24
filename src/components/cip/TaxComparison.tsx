"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { estimate, JURISDICTIONS } from "@/lib/capitalGainsTax";
import { panel, useSeen, useTween } from "./WhyWidgets";

/**
 * The Act 60 capital gains calculator on the Act 60 pages (client, 24 Nov): the visitor picks where they live now, the
 * gain and the Puerto Rico regime, and sees federal, state and local tax at home against the Act 60 rate. Same panel,
 * toggle and slider as the homepage card; every figure updates as anything changes. Rates and the model are in
 * src/content/capitalGainsRates.ts and src/lib/capitalGainsTax.ts.
 */
export function TaxComparison({ es }: { es: boolean }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const [gain, setGain] = useState(1_000_000);
  const [rate, setRate] = useState<0 | 0.04>(0.04);
  const [code, setCode] = useState("US");
  const selectId = useId();
  const money = new Intl.NumberFormat(es ? "es-PR" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const pct = new Intl.NumberFormat(es ? "es-PR" : "en-US", { style: "percent", maximumFractionDigits: 0 });
  const e = estimate(gain, code, rate);
  const j = JURISDICTIONS.find((x) => x.code === code);

  const federal = useTween(e.federal, seen);
  const stateLocal = useTween(e.stateLocal, seen);
  const current = useTween(e.current, seen);
  const pr = useTween(e.pr, seen);
  const savings = useTween(e.savings, seen);
  const reduction = useTween(e.reduction, seen);

  const fedShare = e.current > 0 ? (e.federal / e.current) * 100 : 0;
  const prShare = e.current > 0 ? (e.pr / e.current) * 100 : 0;

  return (
    <div ref={ref} className={panel} data-widget="tax-compare">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-light uppercase">{es ? "Calculadora Ley 60" : "Act 60 calculator"}</p>
        <div role="radiogroup" aria-label={es ? "Régimen de Ley 60 en Puerto Rico" : "Puerto Rico Act 60 regime"} className="inline-flex rounded-full bg-bone/10 p-0.5 text-[11px] ring-1 ring-bone/15">
          {([0, 0.04] as const).map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={rate === r}
              onClick={() => setRate(r)}
              className={cn("min-h-8 rounded-full px-2.5 font-semibold transition-colors", rate === r ? "bg-bone text-basalt" : "text-bone/80 hover:text-bone")}
            >
              {r === 0 ? (es ? "0% · solicitudes 2026" : "0% · 2026 applications") : es ? "4% · desde 2027" : "4% · from 2027"}
            </button>
          ))}
        </div>
      </div>

      <label htmlFor={selectId} className="mt-5 block text-[13px] text-bone/80">
        {es ? "Estado de residencia actual" : "Current State of Residence"}
      </label>
      <div className="relative mt-2">
        <select
          id={selectId}
          value={code}
          onChange={(ev) => setCode(ev.target.value)}
          className="min-h-11 w-full appearance-none rounded-xl bg-bone/10 py-2 pr-10 pl-3.5 text-[15px] text-bone ring-1 ring-bone/20 outline-none focus-visible:ring-2 focus-visible:ring-brass-light"
        >
          <option value="US" className="bg-basalt text-bone">
            {es ? "Solo impuesto federal de EE. UU." : "U.S. Federal Tax Only"}
          </option>
          {JURISDICTIONS.map((x) => (
            <option key={x.code} value={x.code} className="bg-basalt text-bone">
              {es ? (x.nameEs ?? x.name) : x.name}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-bone/70">
          <path d="M2 4.5 6 8.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <label className="mt-5 block">
        <span className="flex items-baseline justify-between gap-3 text-[13px] text-bone/80">
          {es ? "Ganancias de capital a largo plazo" : "Long-term capital gains"}
          <b className="font-[family-name:var(--font-display)] text-[22px] font-normal text-bone tabular-nums">{money.format(gain)}</b>
        </span>
        <input
          type="range"
          min={100_000}
          max={10_000_000}
          step={50_000}
          value={gain}
          onChange={(ev) => setGain(Number(ev.target.value))}
          className="mt-2 w-full accent-[var(--color-brass)]"
          aria-valuetext={money.format(gain)}
        />
      </label>

      {/* Two bars on one scale: tax where you live now (federal, then state and local) and in Puerto Rico. */}
      <div className="mt-5 grid gap-3 text-[13px]" aria-hidden>
        <div>
          <div className="flex justify-between gap-3">
            <span className="text-bone/80">{es ? "Residencia actual" : "Current residence"}</span>
            <span className="font-semibold text-bone tabular-nums">{money.format(current)}</span>
          </div>
          <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-bone/10">
            <div className="h-full bg-bone/45 transition-[width] duration-[900ms]" style={{ width: seen ? `${fedShare}%` : 0 }} />
            <div className="h-full bg-bone/25 transition-[width] duration-[900ms]" style={{ width: seen ? `${100 - fedShare}%` : 0 }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between gap-3">
            <span className="text-bone/80">{`Puerto Rico · Act 60 (${rate === 0 ? "0%" : "4%"})`}</span>
            <span className="font-semibold text-bone tabular-nums">{money.format(pr)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-bone/10">
            <div className="h-full rounded-full bg-brass-light transition-[width] duration-[900ms]" style={{ width: seen ? `${Math.max(prShare, prShare > 0 ? 1.5 : 0)}%` : 0 }} />
          </div>
        </div>
      </div>

      <dl className="mt-5 grid gap-2 border-t border-bone/15 pt-4 text-[13px]">
        <Row label={es ? "Ganancias de capital totales" : "Total capital gains"} value={money.format(gain)} />
        <Row label={es ? "Impuesto federal estimado" : "Estimated federal tax"} value={money.format(federal)} />
        <Row label={es ? "Impuestos estatales y locales estimados" : "Estimated state and local taxes"} value={money.format(stateLocal)} />
        <Row label={es ? "Impuesto total estimado en su residencia actual" : "Total estimated tax at current residence"} value={money.format(current)} strong />
        <Row label={es ? "Impuesto estimado en Puerto Rico" : "Estimated Puerto Rico tax"} value={money.format(pr)} />
      </dl>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 gap-y-1 border-t border-bone/15 pt-4" aria-live="polite">
        <p className="text-[13px] text-bone/80">{es ? "Ahorro fiscal potencial total" : "Total potential tax savings"}</p>
        <p className="text-right text-[13px] text-bone/80">{es ? "Reducción" : "Reduction"}</p>
        <p className="font-[family-name:var(--font-display)] text-[34px] leading-none text-brass-light tabular-nums md:text-[40px]">{money.format(savings)}</p>
        <p className="text-right font-[family-name:var(--font-display)] text-[34px] leading-none text-bone tabular-nums md:text-[40px]">{pct.format(reduction)}</p>
      </div>

      <p className="mt-4 text-[10.5px] leading-snug text-bone/60">
        {es
          ? "Estimaciones para 2026: contribuyente soltero, la ganancia como único ingreso del año, tasas federales a largo plazo de 0%, 15% y 20% más el impuesto de 3.8% sobre ingresos netos de inversión, y los tramos, deducciones y reglas de ganancias de capital publicados por cada estado."
          : "2026 estimates: a single filer, the gain as the only income for the year, federal long-term rates of 0%, 15% and 20% plus the 3.8% net investment income tax, and each state's published brackets, deductions and capital gains rules."}
        {j ? ` ${es ? (j.noteEs ?? j.note) : j.note}` : ""}
      </p>
      <p className="mt-2 text-[10.5px] leading-snug text-bone/60">
        {es
          ? "Esta calculadora ofrece estimaciones fiscales ilustrativas para ganancias de capital a largo plazo que califiquen. Las obligaciones fiscales y los ahorros potenciales reales dependen de los ingresos, el estado civil tributario, la residencia, el tipo de activo y la elegibilidad bajo la Ley 60 de Puerto Rico. Consulte a un asesor fiscal calificado antes de tomar decisiones financieras o de mudanza."
          : "This calculator provides illustrative tax estimates for qualifying long-term capital gains. Actual tax liabilities and potential savings depend on income, filing status, residency, asset type, and eligibility under Puerto Rico Act 60. Consult a qualified tax advisor before making financial or relocation decisions."}
      </p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? "text-bone" : "text-bone/75"}>{label}</dt>
      <dd className={cn("tabular-nums", strong ? "font-semibold text-bone" : "text-bone")}>{value}</dd>
    </div>
  );
}
