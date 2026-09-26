import { Geist, Geist_Mono } from "next/font/google";

/**
 * Relicto's two faces. Geist for everything a person reads — headlines,
 * labels, body copy — and Geist Mono for everything a trader reads as a
 * number: prices, deltas, codes, floats. The type roles in
 * `styles/theme/typography.css` map onto these two variables.
 */
export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = [geist, geistMono].map((f) => f.variable).join(" ");
