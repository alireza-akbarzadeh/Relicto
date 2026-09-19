import type { Metadata, Viewport } from "next";
import { ICON_FONT_HREF } from "@/components/ui/icon";
import { Toaster } from "@/components/ui/toaster";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Lootora — Steam Intel Exchange", template: "%s | Lootora" },
  description: "Discover, trade and track Dota 2 and CS2 items with instant bot escrow.",
};

export const viewport: Viewport = {
  themeColor: "#10131a",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={ICON_FONT_HREF} />
      </head>
      <body className="min-h-screen bg-canvas-base antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
