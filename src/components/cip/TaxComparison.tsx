"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { compound, estimate, JURISDICTIONS, type LocalTax } from "@/lib/capitalGainsTax";
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
  // Client meeting, 24 Nov: "two lines": capital gains, and qualified ordinary income (interest and dividends).
  const [ordinary, setOrdinary] = useState(0);
  // Client meeting, 24 Nov: the "third part", the yearly savings compounded over 10, 20 or 30 years.
  const [growth, setGrowth] = useState<0.1 | 0.15 | 0.2>(0.1);
  const [years, setYears] = useState<10 | 20 | 30>(20);
  const [rate, setRate] = useState<0 | 0.04>(0.04);
  const [code, setCode] = useState("US");
  // Client meeting, 24 Nov: "put the address and it picks up state, city and other taxes".
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState<{ code: string; matched: string; areas: string[]; locals: LocalTax[] } | null>(null);
  const [lookup, setLookup] = useState<"idle" | "busy" | "not_found" | "error">("idle");
  const selectId = useId();
  const addressId = useId();
  const findAddress = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (address.trim().length < 8) return setLookup("not_found");
    setLookup("busy");
    try {
      const res = await fetch(`/api/tax-place?q=${encodeURIComponent(address.trim())}`);
      const json = await res.json();
      if (!json.ok) return setLookup(res.status === 404 ? "not_found" : "error");
      setPlace(json);
      setCode(json.code);
      setLookup("idle");
    } catch {
      setLookup("error");
    }
  };
  const rateText = (l: LocalTax) =>
    l.flat != null ? `${+(l.flat * 100).toFixed(3)}%${l.base === "stateTax" ? (es ? " del impuesto estatal" : " of state tax") : ""}` : es ? "según el tramo" : "by bracket";
  const money = new Intl.NumberFormat(es ? "es-PR" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const pct = new Intl.NumberFormat(es ? "es-PR" : "en-US", { style: "percent", maximumFractionDigits: 0 });
  const e = estimate({ gain, ordinary }, code, rate, place?.code === code ? place.locals : undefined);
  const j = JURISDICTIONS.find((x) => x.code === code);

  const federal = useTween(e.federal, seen);
  const stateLocal = useTween(e.stateLocal, seen);
  const current = useTween(e.current, seen);
  const pr = useTween(e.pr, seen);
  const savings = useTween(e.savings, seen);
  const reduction = useTween(e.reduction, seen);
  const grown = useTween(compound(e.savings, growth, years), seen);

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
          onChange={(ev) => {
            setCode(ev.target.value);
            setPlace(null);
          }}
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

      <form onSubmit={findAddress} className="mt-4" role="search" aria-label={es ? "Buscar los impuestos locales por dirección" : "Find local taxes by address"}>
        <label htmlFor={addressId} className="block text-[13px] text-bone/80">
          {es ? "O escriba su dirección para incluir los impuestos de su condado, ciudad y distrito escolar" : "Or enter your address to include county, city and school district taxes"}
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id={addressId}
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
            autoComplete="street-address"
            placeholder={es ? "Calle, ciudad, estado y código postal" : "Street, city, state and ZIP"}
            className="min-h-11 min-w-0 flex-1 rounded-xl bg-bone/10 px-3.5 text-[15px] text-bone ring-1 ring-bone/20 outline-none placeholder:text-bone/45 focus-visible:ring-2 focus-visible:ring-brass-light"
          />
          <button type="submit" disabled={lookup === "busy"} className="min-h-11 shrink-0 rounded-xl bg-bone px-4 text-[12px] font-semibold tracking-[0.12em] text-basalt uppercase disabled:opacity-60">
            {lookup === "busy" ? "…" : es ? "Buscar" : "Find"}
          </button>
        </div>
        <div aria-live="polite" className="mt-2 text-[12px] leading-snug text-bone/70">
          {lookup === "not_found" && <p>{es ? "No encontramos esa dirección. Pruebe con calle, ciudad, estado y código postal." : "We could not find that address. Try street, city, state and ZIP."}</p>}
          {lookup === "error" && <p>{es ? "La búsqueda no está disponible ahora. Elija su estado arriba." : "The lookup is unavailable right now. Choose your state above."}</p>}
          {place && place.code === code && (
            <div data-place>
              <p className="text-bone/85">{place.matched}</p>
              <p>{place.areas.join(" · ")}</p>
              <p className="mt-1 text-bone/85">
                {place.locals.length
                  ? `${es ? "Impuestos locales incluidos" : "Local taxes included"}: ${place.locals.map((l) => `${l.name} (${rateText(l)})`).join(", ")}`
                  : es
                    ? "No hay impuesto local sobre ganancias de capital en esta dirección."
                    : "No local income tax on capital gains at this address."}
              </p>
            </div>
          )}
          <p className="mt-1 text-bone/50">
            {es ? "Su dirección se envía a la Oficina del Censo de EE. UU. solo para identificar sus áreas fiscales; no se guarda." : "Your address is sent to the U.S. Census Bureau only to find your tax areas; it is not stored."}
          </p>
        </div>
      </form>

      <Slider
        label={es ? "Ganancias de capital a largo plazo" : "Long-term capital gains"}
        value={gain}
        min={100_000}
        max={10_000_000}
        step={50_000}
        onChange={setGain}
        format={money.format}
      />
      <Slider
        label={es ? "Ingreso ordinario calificado (intereses y dividendos)" : "Qualified ordinary income (interest and dividends)"}
        value={ordinary}
        min={0}
        max={5_000_000}
        step={25_000}
        onChange={setOrdinary}
        format={money.format}
      />

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
        {ordinary > 0 && <Row label={es ? "Ingreso ordinario calificado" : "Qualified ordinary income"} value={money.format(ordinary)} />}
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

      <div className="mt-5 rounded-2xl bg-bone/[0.07] p-4 ring-1 ring-bone/10" data-compound>
        <p className="text-[13px] text-bone/80">{es ? "Si invierte el ahorro de cada año" : "If you invest each year's savings"}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Choice label={es ? "Rendimiento anual" : "Yearly return"} options={[0.1, 0.15, 0.2] as const} value={growth} onChange={setGrowth} text={(v) => `${v * 100}%`} />
          <Choice label={es ? "Años" : "Years"} options={[10, 20, 30] as const} value={years} onChange={setYears} text={(v) => (es ? `${v} años` : `${v} years`)} />
        </div>
        <p className="mt-4 text-[13px] text-bone/80">
          {es ? `Valor hipotético después de ${years} años` : `Hypothetical value after ${years} years`}
        </p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-[34px] leading-none text-brass-light tabular-nums md:text-[40px]" aria-live="polite">
          {money.format(grown)}
        </p>
        <p className="mt-2 text-[10.5px] leading-snug text-bone/60">
          {es
            ? `Hipotético: ${money.format(e.savings)} de ahorro al año durante ${years} años, invertidos al final de cada año con un rendimiento constante de ${growth * 100}%. No es una proyección; los rendimientos no están garantizados y pueden ser menores o negativos.`
            : `Hypothetical: ${money.format(e.savings)} of savings a year for ${years} years, invested at the end of each year at a constant ${growth * 100}% return. Not a projection; returns are not guaranteed and can be lower or negative.`}
        </p>
      </div>

      <p className="mt-4 text-[10.5px] leading-snug text-bone/60">
        {es
          ? "Estimaciones para 2026: contribuyente soltero, las ganancias y el ingreso ordinario indicados como único ingreso del año, intereses y dividendos gravados como ingreso ordinario, tasas federales a largo plazo de 0%, 15% y 20% más el impuesto de 3.8% sobre ingresos netos de inversión, y los tramos, deducciones y reglas de ganancias de capital publicados por cada estado."
          : "2026 estimates: a single filer, the gains and ordinary income above as the only income for the year, interest and dividends taxed as ordinary income, federal long-term rates of 0%, 15% and 20% plus the 3.8% net investment income tax, and each state's published brackets, deductions and capital gains rules."}
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

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string }) {
  return (
    <label className="mt-5 block">
      <span className="flex items-baseline justify-between gap-3 text-[13px] text-bone/80">
        {label}
        <b className="font-[family-name:var(--font-display)] text-[22px] font-normal text-bone tabular-nums">{format(value)}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(ev) => onChange(Number(ev.target.value))} className="mt-2 w-full accent-[var(--color-brass)]" aria-valuetext={format(value)} />
    </label>
  );
}

function Choice<T extends number>({ label, options, value, onChange, text }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void; text: (v: T) => string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-bone/10 p-0.5 text-[11px] ring-1 ring-bone/15">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)} className={cn("min-h-8 rounded-full px-3 font-semibold transition-colors", value === o ? "bg-bone text-basalt" : "text-bone/80 hover:text-bone")}>
          {text(o)}
        </button>
      ))}
    </div>
  );
}
