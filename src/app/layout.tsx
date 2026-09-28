import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/toaster";
import { fontVariables } from "@/lib/fonts";
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { THEME_SCRIPT } from "@/lib/theme";
import { cn } from "@/lib/utils";

import "./globals.css";

/**
 * Site-wide defaults. Pages set their own title, description and canonical
 * through `pageMetadata`; there's deliberately no canonical here, or every
 * page would inherit the home page's.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US" },
  twitter: { card: "summary" },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
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
        {/* <Script id="relicto-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} /> */}
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
