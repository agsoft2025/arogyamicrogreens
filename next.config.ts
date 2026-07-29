import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — generates a pure HTML/CSS/JS site with ZERO serverless functions.
  // Next.js 16 emits a .nft.json bundle for every route (including static ones), and
  // Vercel's @vercel/next adapter converts each bundle into a separate Lambda.
  // With 27 routes this easily exceeds Hobby plan's 12-function limit.
  // `output: 'export'` bypasses the Lambda model entirely: all pages become flat files
  // served from Vercel's CDN. Dynamic [slug]/[id] routes are handled via vercel.json rewrites
  // (see below) so the pre-rendered shell is served for any slug, and useParams() on the
  // client reads the real URL params to fetch the correct data.
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
