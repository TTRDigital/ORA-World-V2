/**
 * Illustrative long-term capital gains tax for the Act 60 calculator (client, 24 Nov): federal, state and local tax at
 * the visitor's current residence against Puerto Rico's Act 60 rate.
 *
 * Model (stated on the page): tax year 2026, a single filer, the long-term gain is the only income for the year, a full
 * year of residence, the gain is not from real estate. Progressive brackets, standard deductions, exclusions and surtaxes
 * are applied as published; phase-outs, itemized deductions, credits other than the personal credit, the AMT and
 * holding-period rules are not. The figures are estimates for illustration, not a tax obligation.
 */
import { FEDERAL, JURISDICTIONS, type Bracket, type Jurisdiction } from "@/content/capitalGainsRates";

export type { Jurisdiction };
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

/** Federal long-term capital gains tax (0/15/20% after the standard deduction) plus the 3.8% net investment income tax. */
export function federalTax(gain: number): number {
  return federalIncomeTax(gain) + FEDERAL.niit.rate * Math.max(0, gain - FEDERAL.niit.threshold);
}

/** The federal income tax alone (without the net investment income tax), which Alabama lets residents deduct. */
const federalIncomeTax = (gain: number) => bracketTax(Math.max(0, gain - FEDERAL.standardDeduction), FEDERAL.ltcgBrackets);

/** New York's supplemental tax ("tax benefit recapture"), from the statutory table in the rate data. */
function nyTax(ti: number, agi: number, brackets: Bracket[], r: NonNullable<Jurisdiction["recapture"]>): number {
  if (agi > r.flatAbove) return ti * r.flatRate;
  const regular = bracketTax(ti, brackets);
  const band = [...r.bands].reverse().find((b) => ti > b.over);
  if (!band || agi <= band.start) return regular;
  return regular + band.base + band.inc * Math.min(1, (agi - band.start) / r.span);
}

export type StateResult = { state: number; local: number };

export function stateTax(gain: number, j: Jurisdiction | undefined): StateResult {
  if (!j || j.noIncomeTax) return { state: 0, local: 0 };
  const excluded = j.exclusion ? Math.min(gain * j.exclusion.pct, j.exclusion.cap ?? Infinity) : 0;
  const phased = (j.phased ?? []).reduce((sum, d) => {
    const [from, to] = d.phase;
    const keep = d.keep ?? 0;
    const share = gain <= from ? 1 : gain >= to ? keep : 1 - ((gain - from) / (to - from)) * (1 - keep);
    return sum + d.amount * share;
  }, 0);
  const fedDeduction = j.deductsFederalTax ? federalIncomeTax(gain) : 0;
  const taxable = Math.max(0, gain - excluded - j.deduction - phased - fedDeduction);
  let state = j.recapture ? nyTax(taxable, gain, j.brackets, j.recapture) : bracketTax(taxable, j.brackets);
  for (const s of j.surtaxes ?? []) {
    const base = s.base === "gain" ? gain : taxable;
    const test = s.test === "gain" ? gain : base;
    if (s.mode === "all") state += test > s.threshold ? base * s.rate : 0;
    else state += Math.max(0, base - s.threshold) * s.rate;
  }
  state = Math.max(0, state - (j.credit ?? 0));
  let local = 0;
  if (j.local) {
    const base = j.local.base === "gain" ? gain : j.local.base === "stateTax" ? state : taxable;
    local = j.local.flat != null ? base * j.local.flat : bracketTax(base, j.local.brackets ?? []);
  }
  return { state, local };
}

export type Estimate = { gain: number; federal: number; stateLocal: number; current: number; pr: number; savings: number; reduction: number };

export function estimate(gain: number, code: string, prRate: number): Estimate {
  const j = JURISDICTIONS.find((x) => x.code === code);
  const federal = federalTax(gain);
  const { state, local } = stateTax(gain, j);
  const stateLocal = state + local;
  const current = federal + stateLocal;
  const pr = gain * prRate;
  const savings = Math.max(0, current - pr);
  return { gain, federal, stateLocal, current, pr, savings, reduction: current > 0 ? savings / current : 0 };
}
