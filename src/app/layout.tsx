import type { Metadata, Viewport } from "next";
import { ICON_FONT_HREF } from "@/components/ui/icon";
import { Toaster } from "@/components/ui/toaster";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: { default: "Relicto — Steam Intel Exchange", template: "%s | Relicto" },
  description: "Discover, trade and track Dota 2 and CS2 items with instant bot escrow.",
};

export const viewport: Viewport = {
  themeColor: "#10131a",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn(fontVariables, "font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={ICON_FONT_HREF} />
      </head>
      <body className="min-h-screen bg-canvas-base antialiased">
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
