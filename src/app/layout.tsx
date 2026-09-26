import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/toaster";
import { fontVariables } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Relicto — Steam Intel Exchange",
    template: "%s | Relicto",
  },
  description: "Discover, trade and track Dota 2 and CS2 items with instant bot escrow.",
};

export const viewport: Viewport = {
  themeColor: "#10131a",
  colorScheme: "dark light",
  viewportFit: "cover",
};

/** Geist + Geist Mono for the whole app (see lib/fonts.ts); `font-sans` makes Geist the default face. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={cn(fontVariables, "font-sans")}>
      <body className="min-h-screen bg-canvas-base antialiased">
        {/*
          Applies the saved light/dark choice before first paint (see lib/theme.ts).
          `beforeInteractive` injects it into the server HTML; a raw <script> in
          the tree trips React's "script tag while rendering" error on the client.
        */}
        <Script id="relicto-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
