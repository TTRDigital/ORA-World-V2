import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // The visitor's choice is remembered for a year and honoured on the next visit to "/".
  localeCookie: { name: "ORA2_LOCALE", maxAge: 60 * 60 * 24 * 365 },
});
