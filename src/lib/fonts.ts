import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const fontVariables = [geist.variable, spaceGrotesk.variable, jetbrainsMono.variable].join(" ");
