/**
 * Illustrative long-term capital gains tax for the Act 60 calculator (client, 24 Nov): federal, state and local tax at
 * the visitor's current residence against Puerto Rico's Act 60 rate.
 *
 * Model (stated on the page): tax year 2026, a single filer or a married couple filing jointly (client, 27 Nov), the
 * long-term gain and any qualified ordinary income (interest and dividends) are the only income for the year, a full year
 * of residence, the gain is not from real estate. Progressive brackets, standard deductions, exclusions and surtaxes
 * are applied as published; phase-outs, itemized deductions, credits other than the personal credit, the AMT and
 * holding-period rules are not. The figures are estimates for illustration, not a tax obligation.
 */
import { FEDERAL, JURISDICTIONS, type Bracket, type Jurisdiction, type LocalTax } from "@/content/capitalGainsRates";

export type { Jurisdiction, LocalTax };
export { JURISDICTIONS };

/** Tax on `amount` through ascending [lower bound, rate] brackets. */
export function bracketTax(amount: number, brackets: Bracket[]): number {
  if (amount <= 0) return 0;
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const [lo, rate] = brackets[i];
    const hi = i + 1 < brackets.length ? brackets[i + 1][0] : Infinity;
    if (amount <= lo) break;
    tax += (Math.min(amount, hi) - lo) * rate;
  }
  return tax;
}

/** Income for the year: long-term capital gains and qualified ordinary income (interest and dividends). */
export type Income = { gain: number; ordinary: number };
/** Filing status: single, or married filing jointly. */
export type Status = "single" | "mfj";

/** The federal figures for the filing status. */
const fed = (status: Status) => (status === "mfj" ? { ...FEDERAL, ...FEDERAL.mfj } : FEDERAL);

/** A jurisdiction's rules for the filing status: the married-filing-jointly values replace the single ones. */
export function forStatus(j: Jurisdiction, status: Status): Jurisdiction {
  return status === "mfj" && j.mfj ? { ...j, ...j.mfj } : j;
}

/**
 * Federal income tax: ordinary income through the ordinary brackets after the standard deduction, long-term gains
 * stacked on top through the 0/15/20% thresholds (qualified dividends are treated as ordinary income here).
 */
function federalIncomeTax({ gain, ordinary }: Income, status: Status = "single"): number {
  const F = fed(status);
  const taxable = Math.max(0, gain + ordinary - F.standardDeduction);
  const ordTaxable = Math.max(0, ordinary - F.standardDeduction);
  const gainTaxable = taxable - ordTaxable;
  return bracketTax(ordTaxable, F.ordinaryBrackets) + bracketTax(ordTaxable + gainTaxable, F.ltcgBrackets) - bracketTax(ordTaxable, F.ltcgBrackets);
}

/** Federal income tax plus the 3.8% net investment income tax (interest, dividends and gains are all investment income). */
export function federalTax(income: Income, status: Status = "single"): number {
  const F = fed(status);
  const agi = income.gain + income.ordinary;
  return federalIncomeTax(income, status) + F.niit.rate * Math.max(0, agi - F.niit.threshold);
}

/** New York's supplemental tax ("tax benefit recapture"), from the statutory table in the rate data. */
function nyTax(ti: number, agi: number, brackets: Bracket[], r: NonNullable<Jurisdiction["recapture"]>): number {
  if (agi > r.flatAbove) return ti * r.flatRate;
  const regular = bracketTax(ti, brackets);
  const band = [...r.bands].reverse().find((b) => ti > b.over);
  if (!band || agi <= band.start) return regular;
  return regular + band.base + band.inc * Math.min(1, (agi - band.start) / r.span);
}

/** Each local tax on its own line (client, 24 Nov: "explain state, city and other taxes"). */
export type LocalLine = { name: string; nameEs?: string; amount: number };
export type StateResult = { state: number; local: number; locals: LocalLine[] };

/** `locals`, from the address lookup, replace the state's typical local tax (an empty list: no local tax there). */
export function stateTax(income: Income, jIn: Jurisdiction | undefined, locals?: LocalTax[], status: Status = "single"): StateResult {
  if (!jIn || jIn.noIncomeTax) return { state: 0, local: 0, locals: [] };
  const j = forStatus(jIn, status);
  // Washington taxes only capital gains; everywhere else interest and dividends are ordinary income.
  const gain = income.gain;
  const ordinary = j.gainsOnly ? 0 : income.ordinary;
  const agi = gain + ordinary;
  // Arkansas: net capital gains above $10 million are exempt; the exclusion applies to the rest.
  const exempt = j.exclusion?.exemptAbove != null ? Math.max(0, gain - j.exclusion.exemptAbove) : 0;
  const excluded = exempt + (j.exclusion ? Math.min((gain - exempt) * j.exclusion.pct, j.exclusion.cap ?? Infinity) : 0);
  const phased = (j.phased ?? []).reduce((sum, d) => {
    const [from, to] = d.phase;
    const keep = d.keep ?? 0;
    const share = agi <= from ? 1 : agi >= to ? keep : 1 - ((agi - from) / (to - from)) * (1 - keep);
    return sum + d.amount * share;
  }, 0);
  // Alabama's federal tax deduction includes the 3.8% net investment income tax.
  const fedDeduction = j.deductsFederalTax ? federalTax({ gain, ordinary }, status) : 0;
  const deductions = j.deduction + phased + fedDeduction;
  const taxable = Math.max(0, gain - excluded + ordinary - deductions);
  let state: number;
  if (j.ordinaryBrackets) {
    // Montana and Hawaii: ordinary income on the ordinary schedule, long-term gains stacked on top on their own schedule.
    const ordTaxable = Math.max(0, ordinary - deductions);
    state = bracketTax(ordTaxable, j.ordinaryBrackets) + bracketTax(taxable, j.brackets) - bracketTax(ordTaxable, j.brackets);
  } else state = j.recapture ? nyTax(taxable, agi, j.brackets, j.recapture) : bracketTax(taxable, j.brackets);
  for (const s of j.surtaxes ?? []) {
    const base = s.base === "gain" ? gain : s.base === "investment" ? agi : taxable;
    const test = s.test === "agi" ? agi : base;
    if (s.mode === "all") state += test > s.threshold ? base * s.rate : 0;
    else state += Math.max(0, base - s.threshold) * s.rate;
  }
  state = Math.max(0, state - (j.credit ?? 0));
  const lines = (locals ?? (j.local ? [j.local] : [])).map((l0): LocalLine => {
    const l = status === "mfj" && l0.mfj ? { ...l0, ...l0.mfj } : l0;
    const base = Math.max(0, (l.base === "gain" ? agi : l.base === "stateTax" ? state : taxable) - (l.minus ?? 0));
    const brackets = l.brackets ?? [];
    const amount =
      l.flat != null
        ? base * l.flat
        : l.band
          ? base * brackets.reduce((r, [lo, rate]) => (base > lo ? rate : r), 0)
          : bracketTax(base, brackets);
    return { name: l.name, nameEs: l.nameEs, amount };
  });
  return { state, local: lines.reduce((sum, l) => sum + l.amount, 0), locals: lines };
}

export type Estimate = {
  gain: number;
  ordinary: number;
  federal: number;
  state: number;
  locals: LocalLine[];
  stateLocal: number;
  current: number;
  pr: number;
  savings: number;
  reduction: number;
};

export function estimate(income: Income, code: string, prRate: number, locals?: LocalTax[], status: Status = "single"): Estimate {
  const j = JURISDICTIONS.find((x) => x.code === code);
  const federal = federalTax(income, status);
  const { state, local, locals: localLines } = stateTax(income, j, locals, status);
  const stateLocal = state + local;
  const current = federal + stateLocal;
  // Act 60: the same preferential rate on eligible post-residency gains, interest and dividends.
  const pr = (income.gain + income.ordinary) * prRate;
  const savings = Math.max(0, current - pr);
  return { ...income, federal, state, locals: localLines, stateLocal, current, pr, savings, reduction: current > 0 ? savings / current : 0 };
}

/** Hypothetical growth of a yearly amount invested at the end of each year at a constant rate (future value of an annuity). */
export function compound(yearly: number, rate: number, years: number): number {
  return rate === 0 ? yearly * years : yearly * ((Math.pow(1 + rate, years) - 1) / rate);
}
