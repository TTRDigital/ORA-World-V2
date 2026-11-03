import clsx, { type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export function formatNumber(n: number, locale: string) {
  return new Intl.NumberFormat(locale === "es" ? "es-PR" : "en-US").format(n);
}

/** Split "Where the island *breathes* with you" into [text, accent?][] for the italic accent word. */
export function splitAccent(s: string): { text: string; accent: boolean }[] {
  return s
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) => (part.startsWith("*") ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false }));
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const IS_PROD = process.env.NEXT_PUBLIC_SITE_ENV === "production";
