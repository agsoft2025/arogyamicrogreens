import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeedSinglePageView } from "@/app/_components/seeds/seed-single-page-view";
import {
  formatSeedPrice,
  getSeedProduct,
  seedProducts,
} from "@/app/_data/seeds-products";

type SeedProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return seedProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: SeedProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getSeedProduct(slug);

  if (!product) {
    return {
      title: "Seed Product",
    };
  }

  return {
    title: `${product.name} | Microgreen Seeds`,
    description: `${product.description[0]} ${formatSeedPrice(product.price)}.`,
  };
}

export default async function SeedProductPage({
  params,
}: SeedProductPageProps) {
  const { slug } = await params;
  const product = getSeedProduct(slug);

  if (!product) {
    notFound();
  }

  return <SeedSinglePageView product={product} />;
}
