import type { NextConfig } from "next";

// `output: 'export'` is only applied in production builds (next build).
// During local development (next dev), it is disabled so the dev server
// handles dynamic routes normally — without requiring generateStaticParams
// to cover every slug you visit.
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isProduction ? "export" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
