import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";

/**
 * Relicto's fonts:
 * - Geist for English text / UI copy
 * - Geist Mono for numbers, codes, prices, floats
 * - Vazirmatn for Persian text (applied dynamically when locale is Persian)
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

export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const fontVariables = [geist, geistMono, vazirmatn].map((f) => f.variable).join(" ");
