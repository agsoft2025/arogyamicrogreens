"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ShopProductCard from "@/components/ui/ShopProductCard";
import { useProducts } from "@/hooks/useProducts";
import { getProductThumbnailUrl } from "@/lib/imageUtils";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/types/product.types";


function resolveBadge(
  product: Product
): { badge?: string; badgeVariant?: "popular" | "sale" | "new" } {
  if (product.salePrice) return { badge: "Sale", badgeVariant: "sale" };
  if (product.isFeatured) return { badge: "Featured", badgeVariant: "popular" };
  if (product.createdAt) {
    const days =
      (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (days < 30) return { badge: "New", badgeVariant: "new" };
  }
  return {};
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#e3e3dd] overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-[#e3e3dd]" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-[#e3e3dd] rounded w-3/4" />
        <div className="h-4 bg-[#e3e3dd] rounded w-full" />
        <div className="h-4 bg-[#e3e3dd] rounded w-2/3" />
        <div className="h-10 bg-[#e3e3dd] rounded mt-4" />
      </div>
    </div>
  );
}

export default function MicroCollection() {
  const { products, loading, error } = useProducts({
    status: "active",
    limit: 50,
    category: "microgreen",
  });

  return (
    <section className="px-5 md:px-16 py-24 max-w-[1280px] mx-auto">
      {/* Header */}
      <FadeIn>
        <div className="mb-12">
          <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616] mb-1">
            The Micro Collection
          </h2>
          <p className="text-[#424843] font-[var(--font-work-sans)]">
            Freshly harvested every Tuesday and Friday morning.
          </p>
        </div>
      </FadeIn>

      {/* Error state */}
      {error && !loading && (
        <FadeIn>
          <div className="text-center py-20 text-[#424843] font-[var(--font-work-sans)]">
            <p className="text-lg mb-1">Unable to load products.</p>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        </FadeIn>
      )}

      {/* Loading — skeleton grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <FadeIn>
          <div className="text-center py-20 text-[#424843] font-[var(--font-work-sans)]">
            <p className="text-lg">No products available right now.</p>
            <p className="text-sm mt-1">Check back soon for fresh arrivals.</p>
          </div>
        </FadeIn>
      )}

      {/* Product grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const effectivePrice = product.salePrice ?? product.price;
            const { badge, badgeVariant } = resolveBadge(product);
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: (index % 3) * 0.1,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
              >
                <ShopProductCard
                  name={product.name}
                  description={product.shortDescription ?? product.description ?? ""}
                  price={formatCurrency(effectivePrice)}
                  originalPrice={
                    product.salePrice ? formatCurrency(product.price) : undefined
                  }
                  rating="4.5"
                  badge={badge}
                  badgeVariant={badgeVariant}
                  image={getProductThumbnailUrl(product)}
                  index={index}
                  productId={product._id}
                  numericPrice={effectivePrice}
                  slug={product.slug}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
