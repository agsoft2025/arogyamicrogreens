"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import ShopProductCard from "@/components/ui/ShopProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { getProductThumbnailUrl } from "@/lib/imageUtils";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/types/product.types";

/* ── Badge resolver (same logic as MicroCollection) ─────────── */

function resolveBadge(
  product: Product
): { badge?: string; badgeVariant?: "popular" | "sale" | "new" } {
  if (product.salePrice && product.salePrice < product.price)
    return { badge: "Sale", badgeVariant: "sale" };
  if (product.isFeatured)
    return { badge: "Featured", badgeVariant: "popular" };
  if (product.createdAt) {
    const ageDays =
      (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
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

/* ── Category chip ───────────────────────────────────────────── */

type Filter = "all" | "microgreen" | "product";

const chips: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Microgreens", value: "microgreen" },
  { label: "Products", value: "product" },
];

/* ── Main component ──────────────────────────────────────────── */

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawQ = searchParams.get("q")?.trim() ?? "";

  // Debounce the query so rapid URL changes (browser back/forward) don't
  // hammer the API unnecessarily.
  const q = useDebounce(rawQ, 300);

  const [categoryFilter, setCategoryFilter] = useState<Filter>("all");

  // Reset category filter when query changes
  useEffect(() => {
    setCategoryFilter("all");
  }, [q]);

  const { products, loading, error, setParams } = useProducts({
    status: "active",
    limit: 100,
    search: q || undefined,
  });

  // Re-fetch when debounced query changes
  useEffect(() => {
    setParams({ search: q || undefined, page: 1 });
  }, [q, setParams]);

  // Apply category filter client-side (no extra API call needed)
  const filtered =
    categoryFilter === "all"
      ? products
      : products.filter((p) => p.category === categoryFilter);

  const microgreensCount = products.filter((p) => p.category === "microgreen").length;
  const productsCount = products.filter((p) => p.category === "product").length;

  return (
    <section className="px-5 md:px-16 py-16 max-w-[1280px] mx-auto min-h-[60vh]">

      {/* Page header */}
      <FadeIn>
        <div className="mb-8">
          {q ? (
            <>
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#386b00] mb-2 font-[var(--font-work-sans)]">
                Search Results
              </p>
              <h1 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
                Results for{" "}
                <span className="italic">&ldquo;{rawQ}&rdquo;</span>
              </h1>
              {!loading && (
                <p className="mt-2 text-[#424843] font-[var(--font-work-sans)] text-sm">
                  {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                  {categoryFilter !== "all" && ` in ${categoryFilter === "microgreen" ? "Microgreens" : "Products"}`}
                </p>
              )}
            </>
          ) : (
            <>
              <h1 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
                All Products
              </h1>
              <p className="mt-2 text-[#424843] font-[var(--font-work-sans)] text-sm">
                Browse our full collection of microgreens and products.
              </p>
            </>
          )}
        </div>
      </FadeIn>

      {/* Category chips */}
      <AnimatePresence>
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex gap-2 flex-wrap mb-8"
          >
            {chips.map((chip) => {
              const count =
                chip.value === "all"
                  ? products.length
                  : chip.value === "microgreen"
                  ? microgreensCount
                  : productsCount;
              if (chip.value !== "all" && count === 0) return null;
              return (
                <motion.button
                  key={chip.value}
                  onClick={() => setCategoryFilter(chip.value)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] border transition-colors ${
                    categoryFilter === chip.value
                      ? "bg-[#032616] text-white border-[#032616]"
                      : "bg-white text-[#424843] border-[#c1c8c1] hover:border-[#032616] hover:text-[#032616]"
                  }`}
                >
                  {chip.label}
                  <span className={`ml-1.5 ${categoryFilter === chip.value ? "text-[#a5f95b]" : "text-[#9ca8a3]"}`}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {!loading && error && (
        <FadeIn>
          <div className="text-center py-20 text-[#424843] font-[var(--font-work-sans)]">
            <p className="text-lg mb-1">Unable to load products.</p>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        </FadeIn>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <FadeIn>
          <div className="text-center py-24 text-[#424843] font-[var(--font-work-sans)]">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#eeeee9] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#9ca8a3]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            {q ? (
              <>
                <p className="text-xl font-bold text-[#032616] font-[var(--font-libre-caslon)] mb-2">
                  No microgreens found for &ldquo;{rawQ}&rdquo;
                </p>
                <p className="text-sm text-[#727973] mb-6">
                  Try a different keyword or browse our full collection.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/microgreens")}
                    className="bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-6 py-3 rounded-xl hover:bg-[#386b00] transition-colors"
                  >
                    Browse Microgreens
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/products")}
                    className="border border-[#032616] text-[#032616] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-6 py-3 rounded-xl hover:bg-[#032616] hover:text-white transition-colors"
                  >
                    Browse All Products
                  </motion.button>
                </div>
              </>
            ) : (
              <p className="text-lg">No products available right now. Check back soon.</p>
            )}
          </div>
        </FadeIn>
      )}

      {/* Results grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, index) => {
            const effectivePrice = product.salePrice ?? product.price;
            const { badge, badgeVariant } = resolveBadge(product);
            // Route microgreens to /microgreens/slug, everything else to /products/slug
            const basePath =
              product.category === "microgreen" ? "/microgreens" : "/products";
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: (index % 3) * 0.08,
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
                  basePath={basePath}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Back to browsing link */}
      {!loading && filtered.length > 0 && (
        <FadeIn>
          <div className="mt-16 pt-8 border-t border-[#e3e3dd] flex flex-wrap gap-4">
            <Link
              href="/microgreens"
              className="text-sm font-bold text-[#386b00] hover:text-[#032616] transition-colors font-[var(--font-work-sans)] flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Microgreens Collection
            </Link>
            <Link
              href="/products"
              className="text-sm font-bold text-[#386b00] hover:text-[#032616] transition-colors font-[var(--font-work-sans)] flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              All Products
            </Link>
          </div>
        </FadeIn>
      )}
    </section>
  );
}
