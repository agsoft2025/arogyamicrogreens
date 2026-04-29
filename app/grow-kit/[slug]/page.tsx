import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { GrowKitProductDetailClient } from "@/app/_components/grow-kit/grow-kit-product-detail-client";
import {
  formatInrPrice,
  getGrowKitProduct,
  growKitProducts,
} from "@/app/_data/grow-kit-products";

type GrowKitProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return growKitProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: GrowKitProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getGrowKitProduct(slug);

  if (!product) {
    return {
      title: "Grow Kit Product",
    };
  }

  return {
    title: `${product.name} | Grow Kit`,
    description: `${product.shortDescription} ${formatInrPrice(product.price)}.`,
  };
}

export default async function GrowKitProductPage({
  params,
}: GrowKitProductPageProps) {
  const { slug } = await params;
  const product = getGrowKitProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="bg-[#31552b]/70 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          <FadeIn className="max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#bfd99f]">
              Grow Kit Product
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
              {product.name}
            </h1>
          </FadeIn>

          <Link
            href="/grow-kit"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Grow Kit</span>
          </Link>
        </div>
      </section>

      <GrowKitProductDetailClient product={product} />
    </>
  );
}
