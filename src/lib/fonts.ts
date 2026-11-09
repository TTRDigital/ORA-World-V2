import { Cormorant_Garamond, Urbanist } from "next/font/google";

/**
 * Client direction (Cipriani Residences reference): a classic serif for headings, set in capitals with generous
 * letter-spacing, over a clean sans for everything else. Headings: Cormorant Garamond. Body and UI: Urbanist
 * (the face the client liked on idealdentalsolutions.com).
 */
export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

export const sans = Urbanist({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "variable",
  display: "swap",
  variable: "--font-sans",
});
