"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { compound, estimate, JURISDICTIONS, type LocalTax, type Status } from "@/lib/capitalGainsTax";
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
  // Client, 27 Nov: single or married filing jointly (married rates differ federally and in every state).
  const [status, setStatus] = useState<Status>("single");
  // Client, 27 Nov: the address only, no state list ("it's going to be city taxes"). Until an address is found the
  // estimate is federal tax only. A city or ZIP without a street still finds the state (see /api/tax-place).
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState<{
    code: string;
    matched: string | null;
    areas: string[];
    locals: LocalTax[] | null;
    partial?: boolean;
  } | null>(null);
  const [lookup, setLookup] = useState<"idle" | "busy" | "not_found" | "error">("idle");
  const code = place?.code ?? "US";
  const addressId = useId();
  const findAddress = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (address.trim().length < 5) return setLookup("not_found");
    setLookup("busy");
    try {
      const res = await fetch(`/api/tax-place?q=${encodeURIComponent(address.trim())}`);
      const json = await res.json();
      if (!json.ok) return setLookup(res.status === 404 ? "not_found" : "error");
      setPlace(json);
      setLookup("idle");
    } catch {
      setLookup("error");
    }
  };
  const rateText = (l: LocalTax) =>
    l.flat != null
      ? `${+(l.flat * 100).toFixed(3)}%${l.base === "stateTax" ? (es ? " del impuesto estatal" : " of state tax") : ""}`
      : es
        ? "según el tramo"
        : "by bracket";
  const money = new Intl.NumberFormat(es ? "es-PR" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const pct = new Intl.NumberFormat(es ? "es-PR" : "en-US", { style: "percent", maximumFractionDigits: 0 });
  const e = estimate({ gain, ordinary }, code, rate, place?.locals ?? undefined, status);
  const j = JURISDICTIONS.find((x) => x.code === code);
  // The state tax line names the state: New York City residents pay New York State tax, then the city's tax.
  const stateName =
    code === "NYC" || code === "NY"
      ? es
        ? "Nueva York"
        : "New York"
      : j
        ? es
          ? (j.nameEs ?? j.name)
          : j.name
        : "";

  const federal = useTween(e.federal, seen);
  const stateT = useTween(e.state, seen);
  const current = useTween(e.current, seen);
  const pr = useTween(e.pr, seen);
  const savings = useTween(e.savings, seen);
  const reduction = useTween(e.reduction, seen);
  const grown = useTween(compound(e.savings, growth, years), seen);

  const fedShare = e.current > 0 ? (e.federal / e.current) * 100 : 0;
  const prShare = e.current > 0 ? (e.pr / e.current) * 100 : 0;

  return (
    <div ref={ref} className={cn(panel, "lg:p-10")} data-widget="tax-compare">
      {/* Wide screens: the choices on the left, the results on the right (client, 27 Nov: bigger, in the middle). */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Client, 27 Nov: four numbered steps, so visitors know what to do to get their estimate. */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-light uppercase">
            {es ? "Calculadora Ley 60" : "Act 60 calculator"}
          </p>
          <p className="mt-2 text-[15px] text-bone/80">
            {es ? "Cuatro pasos para su estimación." : "Four steps to your estimate."}
          </p>

          <form
            onSubmit={findAddress}
            className="mt-5 rounded-2xl bg-bone/[0.08] p-4 ring-1 ring-brass-light/50 md:p-5"
            role="search"
            aria-label={es ? "Calcular con su dirección" : "Calculate with your address"}
            data-step="1"
          >
            <StepHead
              n={1}
              htmlFor={addressId}
              title={es ? "Su dirección actual" : "Your current home address"}
              hint={
                es
                  ? "Incluye los impuestos de su estado, condado, ciudad y distrito escolar."
                  : "This adds your state, county, city and school district taxes."
              }
            />
            <div className="mt-3 flex gap-2">
              <input
                id={addressId}
                value={address}
                onChange={(ev) => setAddress(ev.target.value)}
                autoComplete="street-address"
                placeholder={es ? "Calle, ciudad, estado y código postal" : "Street, city, state and ZIP"}
                className="min-h-12 min-w-0 flex-1 rounded-xl bg-bone/10 px-4 text-[16px] text-bone ring-1 ring-bone/25 outline-none placeholder:text-bone/50 focus-visible:ring-2 focus-visible:ring-brass-light"
              />
              <button
                type="submit"
                disabled={lookup === "busy"}
                className="min-h-12 shrink-0 rounded-xl bg-brass-light px-5 text-[12px] font-semibold tracking-[0.14em] text-basalt uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {lookup === "busy" ? "…" : es ? "Calcular" : "Calculate"}
              </button>
            </div>
            <div aria-live="polite" className="mt-2 text-[12.5px] leading-snug text-bone/75">
              {lookup === "not_found" && (
                <p>
                  {es
                    ? "No encontramos esa dirección. Pruebe con calle, ciudad, estado y código postal."
                    : "We could not find that address. Try street, city, state and ZIP."}
                </p>
              )}
              {lookup === "error" && (
                <p>
                  {es
                    ? "La búsqueda no está disponible ahora. Inténtelo de nuevo en un momento."
                    : "The lookup is unavailable right now. Please try again in a moment."}
                </p>
              )}
              {!place && lookup === "idle" && (
                <p>
                  {es
                    ? "Hasta entonces, el cálculo muestra solo el impuesto federal."
                    : "Until then, the estimate shows federal tax only."}
                </p>
              )}
              {place && (
                <div data-place>
                  {place.matched && <p className="text-bone/90">{place.matched}</p>}
                  {place.areas.length > 0 && <p>{place.areas.join(" · ")}</p>}
                  <p className="mt-1 text-bone/90">
                    {place.partial
                      ? es
                        ? `Encontramos su estado (${j?.nameEs ?? j?.name}) pero no la dirección exacta, así que se usan los impuestos locales típicos. Escriba la calle para incluir los suyos.`
                        : `We found your state (${j?.name}) but not the exact address, so typical local taxes are used. Add the street to include yours.`
                      : place.locals && place.locals.length
                        ? `${es ? "Impuestos locales incluidos" : "Local taxes included"}: ${place.locals.map((l) => `${es ? (l.nameEs ?? l.name) : l.name} (${rateText(l)})`).join(", ")}`
                        : es
                          ? "No hay impuesto local sobre ganancias de capital en esta dirección."
                          : "No local income tax on capital gains at this address."}
                  </p>
                </div>
              )}
              <p className="mt-1 text-bone/65">
                {es
                  ? "Su dirección se envía a la Oficina del Censo de EE. UU. solo para identificar sus áreas fiscales; no se guarda."
                  : "Your address is sent to the U.S. Census Bureau only to find your tax areas; it is not stored."}
              </p>
            </div>
          </form>

          <div className="mt-7" data-step="2">
            <StepHead
              n={2}
              id={`${addressId}-status`}
              title={es ? "Su estado civil tributario" : "Your filing status"}
              hint={
                es ? "Las tasas para matrimonios son distintas." : "Married couples have different rates."
              }
            />
            <div
              role="radiogroup"
              aria-labelledby={`${addressId}-status`}
              className="mt-3 ml-10 inline-flex rounded-full bg-bone/10 p-0.5 text-[12px] ring-1 ring-bone/15"
            >
              {(["single", "mfj"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={status === v}
                  onClick={() => setStatus(v)}
                  className={cn(
                    "min-h-9 rounded-full px-4 font-semibold transition-colors",
                    status === v ? "bg-bone text-basalt" : "text-bone/80 hover:text-bone",
                  )}
                >
                  {v === "single"
                    ? es
                      ? "Soltero"
                      : "Single"
                    : es
                      ? "Casados, declaración conjunta"
                      : "Married, filing jointly"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7" data-step="3">
            <StepHead
              n={3}
              title={es ? "Sus ingresos de un año" : "Your income for a year"}
              hint={
                es ? "Mueva los controles o escriba los montos." : "Move the sliders or type the amounts."
              }
            />
            <div className="ml-10">
              <Slider
                label={es ? "Ganancias de capital a largo plazo" : "Long-term capital gains"}
                value={gain}
                min={100_000}
                max={10_000_000}
                hardMax={500_000_000}
                step={50_000}
                onChange={setGain}
                format={money.format}
              />
              <Slider
                label={
                  es
                    ? "Ingreso ordinario calificado (intereses y dividendos)"
                    : "Qualified ordinary income (interest and dividends)"
                }
                value={ordinary}
                min={0}
                max={5_000_000}
                hardMax={500_000_000}
                step={25_000}
                onChange={setOrdinary}
                format={money.format}
              />
            </div>
          </div>

          <div className="mt-7" data-step="4">
            <StepHead
              n={4}
              id={`${addressId}-regime`}
              title={es ? "Su tasa en Puerto Rico" : "Your Puerto Rico rate"}
              hint={
                es
                  ? "0% para solicitudes de Ley 60 presentadas en 2026; 4% para las presentadas desde 2027."
                  : "0% for Act 60 applications filed in 2026; 4% for those filed from 2027."
              }
            />
            <div
              role="radiogroup"
              aria-labelledby={`${addressId}-regime`}
              className="mt-3 ml-10 inline-flex rounded-full bg-bone/10 p-0.5 text-[12px] ring-1 ring-bone/15"
            >
              {([0, 0.04] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={rate === r}
                  onClick={() => setRate(r)}
                  className={cn(
                    "min-h-9 rounded-full px-4 font-semibold transition-colors",
                    rate === r ? "bg-bone text-basalt" : "text-bone/80 hover:text-bone",
                  )}
                >
                  {r === 0
                    ? es
                      ? "0% · solicitudes 2026"
                      : "0% · 2026 applications"
                    : es
                      ? "4% · desde 2027"
                      : "4% · from 2027"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-bone/15 pt-6 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-light uppercase">
            {es ? "Su estimación" : "Your estimate"}
          </p>
          {/* Client, 27 Nov: the savings first and in green: "that's the data you want to see". */}
          <div
            className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 gap-y-1 rounded-2xl bg-[#7fd6a4]/[0.12] p-4 ring-1 ring-[#7fd6a4]/40 md:p-5"
            aria-live="polite"
            data-savings
          >
            <p className="text-[14px] font-semibold text-[#a6e6c1]">
              {es ? "Ahorro fiscal potencial total" : "Total potential tax savings"}
            </p>
            <p className="text-right text-[14px] font-semibold text-[#a6e6c1]">
              {es ? "Reducción" : "Reduction"}
            </p>
            <p className="font-[family-name:var(--font-display)] text-[44px] leading-none text-[#7fd6a4] tabular-nums md:text-[56px]">
              {money.format(savings)}
            </p>
            <p className="text-right font-[family-name:var(--font-display)] text-[44px] leading-none text-[#7fd6a4] tabular-nums md:text-[56px]">
              {pct.format(reduction)}
            </p>
            <p className="col-span-2 mt-2 text-[12.5px] text-bone/70">
              {es ? "Al año, frente a su residencia actual" : "A year, compared with where you live now"}
            </p>
          </div>

          {/* Two bars on one scale: tax where you live now (federal, then state and local) and in Puerto Rico. */}
          <div className="mt-5 grid gap-3 text-[13px]" aria-hidden>
            <div>
              <div className="flex justify-between gap-3">
                <span className="text-bone/80">{es ? "Residencia actual" : "Current residence"}</span>
                <span className="font-semibold text-bone tabular-nums">{money.format(current)}</span>
              </div>
              <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-bone/10">
                <div
                  className="h-full bg-bone/45 transition-[width] duration-[900ms]"
                  style={{ width: seen ? `${fedShare}%` : 0 }}
                />
                <div
                  className="h-full bg-bone/25 transition-[width] duration-[900ms]"
                  style={{ width: seen ? `${100 - fedShare}%` : 0 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between gap-3">
                <span className="text-bone/80">{`Puerto Rico · Act 60 (${rate === 0 ? "0%" : "4%"})`}</span>
                <span className="font-semibold text-bone tabular-nums">{money.format(pr)}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-bone/10">
                <div
                  className="h-full rounded-full bg-brass-light transition-[width] duration-[900ms]"
                  style={{ width: seen ? `${Math.max(prShare, prShare > 0 ? 1.5 : 0)}%` : 0 }}
                />
              </div>
            </div>
          </div>

          <dl className="mt-5 grid gap-2 border-t border-bone/15 pt-4 text-[13px]">
            <Row
              label={es ? "Ganancias de capital totales" : "Total capital gains"}
              value={money.format(gain)}
            />
            {ordinary > 0 && (
              <Row
                label={es ? "Ingreso ordinario calificado" : "Qualified ordinary income"}
                value={money.format(ordinary)}
              />
            )}
            <Row
              label={es ? "Impuesto federal estimado" : "Estimated federal tax"}
              value={money.format(federal)}
            />
            {/* Client, 24 Nov: "explain state, city and other taxes": the state, then each local tax on its own line. */}
            <Row
              label={`${es ? "Impuesto estatal estimado" : "Estimated state tax"}${stateName ? ` (${stateName})` : ""}`}
              value={money.format(stateT)}
            />
            {e.locals.map((l) => (
              <Row key={l.name} label={es ? (l.nameEs ?? l.name) : l.name} value={money.format(l.amount)} />
            ))}
            <Row
              label={
                es
                  ? "Impuesto total estimado en su residencia actual"
                  : "Total estimated tax at current residence"
              }
              value={money.format(current)}
              strong
            />
            <Row
              label={es ? "Impuesto estimado en Puerto Rico" : "Estimated Puerto Rico tax"}
              value={money.format(pr)}
            />
          </dl>

          <div className="mt-5 rounded-2xl bg-bone/[0.07] p-4 ring-1 ring-bone/10" data-compound>
            <p className="text-[13px] text-bone/80">
              {es ? "Si invierte el ahorro de cada año" : "If you invest each year's savings"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Choice
                label={es ? "Rendimiento anual" : "Yearly return"}
                options={[0.1, 0.15, 0.2] as const}
                value={growth}
                onChange={setGrowth}
                text={(v) => `${v * 100}%`}
              />
              <Choice
                label={es ? "Años" : "Years"}
                options={[10, 20, 30] as const}
                value={years}
                onChange={setYears}
                text={(v) => (es ? `${v} años` : `${v} years`)}
              />
            </div>
            <p className="mt-4 text-[13px] text-bone/80">
              {es ? `Valor hipotético después de ${years} años` : `Hypothetical value after ${years} years`}
            </p>
            <p
              className="mt-1 font-[family-name:var(--font-display)] text-[34px] leading-none text-[#7fd6a4] tabular-nums md:text-[40px]"
              aria-live="polite"
            >
              {money.format(grown)}
            </p>
            <p className="mt-2 text-[10.5px] leading-snug text-bone/60">
              {es
                ? `Hipotético: ${money.format(e.savings)} de ahorro al año durante ${years} años, invertidos al final de cada año con un rendimiento constante de ${growth * 100}%. No es una proyección; los rendimientos no están garantizados y pueden ser menores o negativos.`
                : `Hypothetical: ${money.format(e.savings)} of savings a year for ${years} years, invested at the end of each year at a constant ${growth * 100}% return. Not a projection; returns are not guaranteed and can be lower or negative.`}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[10.5px] leading-snug text-bone/60 lg:mt-8">
        {es
          ? `Estimaciones para 2026: ${status === "mfj" ? "matrimonio con declaración conjunta" : "contribuyente soltero"}, las ganancias y el ingreso ordinario indicados como único ingreso del año, intereses y dividendos gravados como ingreso ordinario, tasas federales a largo plazo de 0%, 15% y 20% más el impuesto de 3.8% sobre ingresos netos de inversión, y los tramos, deducciones y reglas de ganancias de capital publicados por cada estado.`
          : `2026 estimates: ${status === "mfj" ? "a married couple filing jointly" : "a single filer"}, the gains and ordinary income above as the only income for the year, interest and dividends taxed as ordinary income, federal long-term rates of 0%, 15% and 20% plus the 3.8% net investment income tax, and each state's published brackets, deductions and capital gains rules.`}
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

function Slider({
  label,
  value,
  min,
  max,
  hardMax,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  /** Typed amounts can go above the slider's range, up to this. */
  hardMax: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft == null) return;
    const n = Number(draft.replace(/[^\d.]/g, ""));
    if (Number.isFinite(n) && draft.trim() !== "") onChange(Math.min(hardMax, Math.max(0, Math.round(n))));
    setDraft(null);
  };
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[13px] text-bone/80">
          {label}
        </label>
        <input
          id={id}
          inputMode="numeric"
          value={draft ?? format(value)}
          onFocus={(ev) => ev.target.select()}
          onChange={(ev) => setDraft(ev.target.value)}
          onBlur={commit}
          onKeyDown={(ev) => ev.key === "Enter" && (ev.currentTarget as HTMLInputElement).blur()}
          className="w-[14ch] shrink-0 rounded-lg bg-transparent px-2 py-1 text-right font-[family-name:var(--font-display)] text-[20px] text-bone tabular-nums ring-1 ring-bone/15 outline-none hover:ring-bone/30 focus-visible:ring-2 focus-visible:ring-brass-light md:text-[22px]"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(ev) => onChange(Number(ev.target.value))}
        aria-label={label}
        className="mt-2 w-full accent-[var(--color-brass)]"
        aria-valuetext={format(value)}
      />
    </div>
  );
}

function Choice<T extends number>({
  label,
  options,
  value,
  onChange,
  text,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  text: (v: T) => string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-full bg-bone/10 p-0.5 text-[11px] ring-1 ring-bone/15"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "min-h-8 rounded-full px-3 font-semibold transition-colors",
            value === o ? "bg-bone text-basalt" : "text-bone/80 hover:text-bone",
          )}
        >
          {text(o)}
        </button>
      ))}
    </div>
  );
}

/** A numbered step: the number in a brass circle, the title and a one-line hint (client, 27 Nov). */
function StepHead({
  n,
  title,
  hint,
  htmlFor,
  id,
}: {
  n: number;
  title: string;
  hint?: string;
  htmlFor?: string;
  id?: string;
}) {
  const Title = htmlFor ? "label" : "p";
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brass-light text-[13px] font-semibold text-basalt"
      >
        {n}
      </span>
      <div>
        <Title id={id} htmlFor={htmlFor} className="block text-[16px] font-semibold text-bone md:text-[17px]">
          <span className="sr-only">{`${n}. `}</span>
          {title}
        </Title>
        {hint && <p className="mt-0.5 text-[13px] leading-snug text-bone/75">{hint}</p>}
      </div>
    </div>
  );
}
