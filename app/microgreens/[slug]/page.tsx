import MicrogreenDetailClient from './MicrogreenDetailClient';
import type { Product } from '@/types/product.types';

export async function generateStaticParams() {
  try {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1')
      .replace(/\/$/, '');

    const res = await fetch(
      `${base}/products?category=microgreen&status=active&limit=1000`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [{ slug: 'placeholder' }];

    const json = await res.json() as {
      data?: { items?: Pick<Product, 'slug'>[] };
    };

    const slugs = json.data?.items?.map((m) => m.slug) ?? [];

    return [
      ...slugs.map((slug) => ({ slug })),
      { slug: 'placeholder' }, // fallback shell for slugs added after the build
    ];
  } catch {
    // API unavailable at build time — Vercel rewrite handles all real slugs
    return [{ slug: 'placeholder' }];
  }
}

export default function MicrogreenDetailPage() {
  return <MicrogreenDetailClient />;
}
