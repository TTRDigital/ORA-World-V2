import { Cormorant_Garamond, Pinyon_Script, Urbanist } from "next/font/google";

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

/** A copperplate script for single accent lines (client, 16 Nov: "Creating luxury living with timeless elegance..."). */
export const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-script",
});
