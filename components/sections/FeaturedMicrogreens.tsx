"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import FadeIn from "@/components/animations/FadeIn";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/types/product.types";

/* ── Helpers ─────────────────────────────────────────────────── */

function getImageUrl(product: Product): string {
  const src = product.featuredImage ?? product.images?.[0];
  if (!src) return "/images/placeholder-product.jpg";
  if (src.startsWith("http")) return src;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";
  return `${base.replace("/api/v1", "")}/uploads/${src}`;
}

function resolveBadge(product: Product): string | undefined {
  if (product.salePrice && product.salePrice < product.price) {
    const pct = Math.round((1 - product.salePrice / product.price) * 100);
    return `${pct}% OFF`;
  }
  if (product.createdAt) {
    const ageDays = (Date.now() - new Date(product.createdAt).getTime()) / 86_400_000;
    if (ageDays < 30) return "NEW";
  }
  return undefined;
}

/* ── Component ───────────────────────────────────────────────── */

export default function FeaturedMicrogreens() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { products, loading, error } = useProducts({
    isFeatured: true,
    status: "active",
    limit: 20,
  });

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  /* Don't render the section at all if there are no featured products and we're not loading */
  if (!loading && !error && products.length === 0) return null;

  return (
    <section id="featured" className="py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
                Featured Microgreens
              </h2>
              <p className="text-[#424843] mt-1 font-[var(--font-work-sans)]">Selected harvests of the week</p>
            </div>
            {!loading && !error && products.length > 0 && (
              <div className="flex gap-2">
                {(["left", "right"] as const).map((dir) => (
                  <motion.button
                    key={dir}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scroll(dir)}
                    aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
                    className="w-10 h-10 border border-[#727973] rounded-full flex items-center justify-center hover:bg-[#eeeee9] transition-colors text-[#1a1c19]"
                  >
                    {dir === "left" ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="flex gap-6 overflow-x-hidden pb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[260px] md:min-w-[280px] shrink-0 bg-white rounded-xl overflow-hidden animate-pulse"
                style={{ boxShadow: "0 4px 12px rgba(27,60,42,0.1)" }}
              >
                <div className="h-48 bg-[#e8ede8]" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-[#e8ede8] rounded w-2/3" />
                  <div className="h-7 bg-[#e8ede8] rounded w-1/2 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="flex items-center gap-3 text-sm text-[#424843] font-[var(--font-work-sans)] py-4">
            <svg className="w-5 h-5 text-[#ba1a1a] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            Unable to load featured products.
          </div>
        )}

        {/* ── Product carousel ── */}
        {!loading && !error && products.length > 0 && (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 hide-scroll"
          >
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <ProductCard
                  name={product.name}
                  price={formatCurrency(product.salePrice ?? product.price)}
                  originalPrice={
                    product.salePrice && product.salePrice < product.price
                      ? formatCurrency(product.price)
                      : undefined
                  }
                  badge={resolveBadge(product)}
                  image={getImageUrl(product)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
