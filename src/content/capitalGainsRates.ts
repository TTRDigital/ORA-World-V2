/** Placeholder: filled from the research. */
export type Bracket = [number, number];
export type Jurisdiction = {
  code: string;
  name: string;
  nameEs?: string;
  taxYear: number;
  noIncomeTax?: boolean;
  deduction: number;
  /** Deductions that shrink with income: full up to phase[0], down to `keep` of the amount at phase[1] (straight line). */
  phased?: { amount: number; phase: [number, number]; keep?: number }[];
  credit?: number;
  exclusion?: { pct: number; cap?: number | null };
  brackets: Bracket[];
  surtaxes?: { threshold: number; rate: number; base?: "gain" | "taxable"; test?: "gain"; mode?: "excess" | "all" }[];
  recapture?: { start: number; span: number };
  local?: { name: string; base: "gain" | "taxable" | "stateTax"; flat?: number; brackets?: Bracket[] };
  note: string;
  noteEs?: string;
  sources: string[];
};
export const FEDERAL = { taxYear: 2026, standardDeduction: 16100, ltcgBrackets: [[0, 0], [49450, 0.15], [545500, 0.2]] as Bracket[], niit: { rate: 0.038, threshold: 200000 } };
export const JURISDICTIONS: Jurisdiction[] = [];
