import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** The floating dev badge sits on top of the UI and pollutes design screenshots. */
  devIndicators: false,
};

export default nextConfig;
