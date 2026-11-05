import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Display: Fraunces variable. opsz 72–144 and weight 300–400 are set in CSS; the SOFT axis (50) gives
 * the warm "wonk" italics used on accent words. UI and body: Plus Jakarta Sans 400/500/600.
 */
export const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  weight: "variable",
  display: "swap",
  variable: "--font-display",
  adjustFontFallback: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});
