import { Urbanist } from "next/font/google";

/**
 * Urbanist for everything (client feedback: use the typeface and sizes of idealdentalsolutions.com). One variable
 * file with italics; headings at 600, body at 400. `display` and `sans` stay two exports so the layout and CSS keep
 * their two variables, but both point at the same face (CSS maps --font-display to --font-sans).
 */
export const sans = Urbanist({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "variable",
  display: "swap",
  variable: "--font-sans",
});

export const display = sans;
