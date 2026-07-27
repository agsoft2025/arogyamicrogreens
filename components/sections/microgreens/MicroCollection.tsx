"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ShopProductCard from "@/components/ui/ShopProductCard";
import { useProducts } from "@/hooks/useProducts";
import { getProductThumbnailUrl } from "@/lib/imageUtils";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/types/product.types";

/* ── Badge resolver ──────────────────────────────────────────── */

function resolveBadge(
  product: Product
): { badge?: string; badgeVariant?: "popular" | "sale" | "new" } {
  if (product.salePrice && product.salePrice < product.price) {
    return { badge: "Sale", badgeVariant: "sale" };
  }
  if (product.isFeatured) {
    return { badge: "Featured", badgeVariant: "popular" };
  }
  if (product.createdAt) {
    const ageDays =
      (Date.now() - new Date(product.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    if (ageDays < 30) return { badge: "New", badgeVariant: "new" };
  }
  return {};
}

/* ── Skeleton card ───────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#e3e3dd] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#e3e3dd]" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-[#e3e3dd] rounded w-3/4" />
        <div className="h-4 bg-[#e3e3dd] rounded w-full" />
        <div className="h-4 bg-[#e3e3dd] rounded w-2/3" />
        <div className="h-10 bg-[#e3e3dd] rounded mt-4" />
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────── */

export default function MicroCollection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q")?.trim() ?? "";

  const { products, loading, error, setParams } = useProducts({
    status: "active",
    limit: 50,
    category: "microgreen",
    search: q || undefined,
  });

  // Re-fetch whenever the URL search param changes
  useEffect(() => {
    setParams({ search: q || undefined, page: 1 });
  }, [q, setParams]);

  const handleClearSearch = () => {
    router.push("/microgreens");
  };

  return (
    <section className="px-5 md:px-16 py-24 max-w-[1280px] mx-auto">
      {/* Header */}
      <FadeIn>
        <div className="mb-8">
          <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616] mb-1">
            The Micro Collection
          </h2>
          <p className="text-[#424843] font-[var(--font-work-sans)]">
            Freshly harvested every Tuesday and Friday morning.
          </p>
        </div>
      </FadeIn>

      {/* Active search banner */}
      <AnimatePresence>
        {q && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between mb-6 bg-[#f4f4ee] border border-[#c1c8c1] rounded-xl px-5 py-3"
          >
            <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
              Showing results for{" "}
              <span className="font-bold text-[#032616]">"{q}"</span>
              {!loading && (
                <span className="text-[#727973]">
                  {" "}— {products.length} product{products.length !== 1 ? "s" : ""} found
                </span>
              )}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearSearch}
              className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#386b00] hover:text-[#032616] transition-colors shrink-0 ml-4"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              Clear
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {!loading && error && (
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
          <div className="text-center py-24 text-[#424843] font-[var(--font-work-sans)]">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#eeeee9] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#9ca8a3]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            {q ? (
              <>
                <p className="text-xl font-bold text-[#032616] font-[var(--font-libre-caslon)] mb-2">
                  No results for "{q}"
                </p>
                <p className="text-sm text-[#727973] mb-6">
                  Try a different keyword or browse all microgreens.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClearSearch}
                  className="bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-6 py-3 rounded-xl hover:bg-[#386b00] transition-colors"
                >
                  Browse All Microgreens
                </motion.button>
              </>
            ) : (
              <>
                <p className="text-lg">No microgreens available right now.</p>
                <p className="text-sm mt-1">Check back soon for fresh arrivals.</p>
              </>
            )}
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
                    product.salePrice && product.salePrice < product.price
                      ? formatCurrency(product.price)
                      : undefined
                  }
                  rating={product.rating}
                  badge={badge}
                  badgeVariant={badgeVariant}
                  image={getProductThumbnailUrl(product)}
                  index={index}
                  productId={product._id}
                  numericPrice={effectivePrice}
                  slug={product.slug}
                  basePath="/microgreens"
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
