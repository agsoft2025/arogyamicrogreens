import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Partial Pre-Rendering (PPR), which is on by default in Next.js 16.
  // PPR generates per-segment RSC streaming endpoints that Vercel counts as
  // individual Serverless Functions — quickly exceeding the Hobby plan's 12-function limit.
  // Since every page in this project fetches data client-side, PPR provides no benefit.
  experimental: {
    ppr: false,
  },
};

export default nextConfig;
