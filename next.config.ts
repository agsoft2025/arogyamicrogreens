import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: false,
  },
  // Disable Vercel's built-in image optimization endpoint (_next/image).
  // That endpoint is a serverless function and counts against Hobby plan's 12-function limit.
  // Images are still lazy-loaded and responsive via CSS; only server-side format conversion
  // and resizing is skipped. Use a CDN (Cloudinary, etc.) for production image optimization.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
