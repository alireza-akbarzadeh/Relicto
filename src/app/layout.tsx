import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/toaster";
import { fontVariables } from "@/lib/fonts";
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
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

import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

/** Geist + Geist Mono for the whole app (see lib/fonts.ts); `font-sans` makes Geist the default face. */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      data-theme="dark"
      suppressHydrationWarning
      className={cn(fontVariables, "font-sans", locale === "fa" && "font-vazirmatn")}
    >
      <body className="min-h-screen bg-canvas-base antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
