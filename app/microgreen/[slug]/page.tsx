import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MicrogreenProductDetailClient } from "@/app/_components/microgreen/microgreen-product-detail-client";
import {
  formatMicrogreenPrice,
  getMicrogreenProduct,
  microgreenProducts,
} from "@/app/_data/microgreen-products";

type MicrogreenProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return microgreenProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: MicrogreenProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getMicrogreenProduct(slug);

  if (!product) {
    return {
      title: "Microgreen Product",
    };
  }

  return {
    title: `${product.name} | Microgreens`,
    description: `${product.description[0]} ${formatMicrogreenPrice(product.price)}.`,
  };
}

export default async function MicrogreenProductPage({
  params,
}: MicrogreenProductPageProps) {
  const { slug } = await params;
  const product = getMicrogreenProduct(slug);

  if (!product) {
    notFound();
  }

  return <MicrogreenProductDetailClient product={product} />;
}
