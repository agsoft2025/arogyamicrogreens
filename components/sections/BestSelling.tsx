"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/currency";
import { getProductThumbnailUrl } from "@/lib/imageUtils";

/* ── Component ───────────────────────────────────────────────── */

export default function BestSelling() {
  const { products, loading, error } = useProducts({
    isBestSeller: true,
    category: "microgreen",
    status: "active",
    limit: 10,
  });

  // Don't render the section at all when not loading and nothing to show
  if (!loading && !error && products.length === 0) return null;

  return (
    <section id="best-selling" className="py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn className="text-center mb-12">
          <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
            Best Selling Microgreens
          </h2>
          <p className="text-[#424843] mt-2 font-[var(--font-work-sans)]">
            Top picks loved by our customers
          </p>
        </FadeIn>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#e8ede8] rounded-xl mb-3" />
                <div className="h-3 bg-[#e8ede8] rounded w-2/3 mb-2" />
                <div className="h-6 bg-[#e8ede8] rounded w-1/2 mb-3" />
                <div className="h-8 bg-[#e8ede8] rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="flex items-center justify-center gap-3 text-sm text-[#424843] font-[var(--font-work-sans)] py-12">
            <svg
              className="w-5 h-5 text-[#ba1a1a] shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            Unable to load best selling microgreens.
          </div>
        )}

        {/* ── Product grid ── */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {products.map((product, i) => {
              const effectivePrice = product.salePrice ?? product.price;
              const thumbnailUrl = getProductThumbnailUrl(product);

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group"
                >
                  {/* Image */}
                  <div className="aspect-square bg-[#eeeee9] rounded-xl mb-3 overflow-hidden relative">
                    {thumbnailUrl ? (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        src={thumbnailUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* Placeholder when no image */
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-[#b0b8b0]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                      </div>
                    )}

                    {/* Quick-view overlay button */}
                    <Link href={`/microgreens/${product.slug}`}>
                      <motion.span
                        initial={{ opacity: 0 }}
                        className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer inline-flex"
                        aria-label={`View ${product.name}`}
                      >
                        <svg
                          className="w-4 h-4 text-[#032616]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </motion.span>
                    </Link>

                    {/* Sale badge */}
                    {product.salePrice && product.salePrice < product.price && (
                      <span className="absolute top-2 left-2 bg-[#386b00] text-white text-[9px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] px-2 py-0.5 rounded">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Short description */}
                  {product.shortDescription && (
                    <p className="text-[10px] text-[#727973] font-[var(--font-work-sans)] truncate mb-0.5">
                      {product.shortDescription}
                    </p>
                  )}

                  {/* Name */}
                  <h3 className="font-bold text-xs tracking-wide text-[#032616] truncate font-[var(--font-work-sans)]">
                    {product.name}
                  </h3>

                  {/* Price + CTA */}
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
                        {formatCurrency(effectivePrice)}
                      </p>
                      {product.salePrice && product.salePrice < product.price && (
                        <p className="text-[10px] text-[#9ca8a3] line-through font-[var(--font-work-sans)]">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </div>
                    <Link href={`/microgreens/${product.slug}`}>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#386b00] text-white px-3 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-[#032616] transition-colors font-[var(--font-work-sans)] cursor-pointer inline-block"
                      >
                        Shop Now
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
