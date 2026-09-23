import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** The floating dev badge sits on top of the UI and pollutes design screenshots. */
  devIndicators: false,

  /** The push service worker must never be served stale, or fixes to it never reach devices. */
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
