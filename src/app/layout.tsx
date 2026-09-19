import type { Metadata, Viewport } from "next";
import { ICON_FONT_HREF } from "@/components/ui/icon";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Valve Arena", template: "%s | Valve Esports Arena" },
  description: "Competitive Dota 2 and CS2 tournaments.",
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
      <body className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container md:bg-canvas-base">
        {children}
      </body>
    </html>
  );
}
