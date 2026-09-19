import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The Arena hub is the only designed page so far.
    return [{ source: "/", destination: "/tournaments", permanent: false }];
  },
};

export default nextConfig;
