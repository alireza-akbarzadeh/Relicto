import type { MetadataRoute } from "next";

/**
 * Installable web app. Besides the home-screen icon, iOS only delivers Web
 * Push to an installed app, so trade notifications on iPhone depend on this.
 * Colours are the canvas and primary-container tokens (manifests can't read CSS).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Relicto — Steam Skin Exchange",
    short_name: "Relicto",
    description: "Buy, sell and trade CS2, Dota 2 and TF2 items with escrow protection.",
    start_url: "/marketplace",
    display: "standalone",
    background_color: "#0a0d14",
    theme_color: "#0a0d14",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
