import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** The floating dev badge sits on top of the UI and pollutes design screenshots. */
  devIndicators: false,

  /**
   * Steam serves avatars and item icons from its CDNs. A Steam trader's avatar
   * and every synced inventory icon are remote, and `next/image` refuses hosts
   * that aren't listed here.
   */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.steamstatic.com" },
      { protocol: "https", hostname: "avatars.akamai.steamstatic.com" },
      { protocol: "https", hostname: "avatars.cloudflare.steamstatic.com" },
      { protocol: "https", hostname: "community.akamai.steamstatic.com" },
      { protocol: "https", hostname: "community.cloudflare.steamstatic.com" },
      { protocol: "https", hostname: "steamcommunity-a.akamaihd.net" },
    ],
  },

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
