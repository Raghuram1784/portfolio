import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // lets a production build run in its own folder without breaking a running `next dev`
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // hide the floating Next.js "N" development badge
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname),
  // Every image in /public is pre-optimized WebP (see README). Serving them
  // directly avoids the runtime optimizer, which stalled under many
  // concurrent exhibition requests during testing.
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
};

export default nextConfig;
