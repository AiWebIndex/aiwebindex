import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pure static site; no API routes, no server-side state. Vercel's
  // default Node runtime is overkill for this; the standalone output
  // keeps the build small without forcing a full static export
  // (which would lose dynamic OG image rendering if we add it later).
};

export default nextConfig;
