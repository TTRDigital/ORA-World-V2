import type { L, LP, Locale } from "@/content/types";

export const t = (l: L | null | undefined, locale: Locale): string => (l ? l[locale] || l.en : "");
export const tp = (l: LP | null | undefined, locale: Locale): string[] => (l ? l[locale] || l.en : []);
