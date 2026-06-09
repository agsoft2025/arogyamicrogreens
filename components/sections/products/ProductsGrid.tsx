"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ShopProductCard from "@/components/ui/ShopProductCard";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/currency";
import type { Product, ProductListParams } from "@/types/product.types";

/* ── Helpers — map backend Product to ShopProductCard props ──── */

function resolveBadge(
  product: Product
): { badge?: string; badgeVariant?: "popular" | "sale" | "new" } {
  if (product.salePrice && product.salePrice < product.price) {
    return { badge: "Sale", badgeVariant: "sale" };
  }
  if (product.isFeatured) {
    return { badge: "Featured", badgeVariant: "popular" };
  }
  // Treat recently added (within 30 days) as "New"
  if (product.createdAt) {
    const ageDays =
      (Date.now() - new Date(product.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    if (ageDays < 30) return { badge: "New", badgeVariant: "new" };
  }
  return {};
}

function getImageUrl(product: Product): string {
  // Use featuredImage if available, else first image, else placeholder
  const src = product.featuredImage ?? product.images?.[0];
  if (!src) return "/images/placeholder-product.jpg";
  // If it's already a full URL, return as-is; otherwise prepend uploads URL
  if (src.startsWith("http")) return src;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";
  const uploadsBase = base.replace("/api/v1", "");
  return `${uploadsBase}/uploads/${src}`;
}

const SORT_OPTIONS = [
  "All Products",
  "Featured",
  "Newest Arrivals",
  "Price: Low to High",
  "Top Rated",
];

export default function ProductsGrid() {
  const [sort, setSort] = useState("All Products");

  const { products, pagination, loading, error, refetch, setParams, params } =
    useProducts({ limit: 12, status: "active" });

  const currentPage = params.page ?? 1;

  // Client-side sort for options that don't map to an API param
  const sorted = [...products].sort((a, b) => {
    if (sort === "Price: Low to High") {
      return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
    }
    if (sort === "Newest Arrivals" && a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? products.length;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setParams({
      page: 1,
      isFeatured: newSort === "Featured" ? true : undefined,
    });
  };

  return (
    <section className="flex-grow min-w-0">
      {/* Sort header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-8 gap-4"
      >
        <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
          {loading ? (
            <span className="inline-block w-32 h-4 bg-[#e3e3dd] rounded animate-pulse" />
          ) : (
            <>
              Showing{" "}
              <span className="font-bold text-[#1a1c19]">{sorted.length}</span>{" "}
              of {total} products
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#424843] font-[var(--font-work-sans)]">
            Sort by:
          </span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-transparent border-none font-bold text-[11px] tracking-widest uppercase text-[#032616] font-[var(--font-work-sans)] focus:ring-0 cursor-pointer pr-5 outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <svg
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#032616] pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ── Loading state ── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden animate-pulse"
              style={{ boxShadow: "0 4px 12px rgba(27,60,42,0.10)" }}
            >
              <div className="aspect-square bg-[#e3e3dd]" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-[#e3e3dd] rounded w-3/4" />
                <div className="h-4 bg-[#e3e3dd] rounded w-full" />
                <div className="h-4 bg-[#e3e3dd] rounded w-2/3" />
                <div className="h-7 bg-[#e3e3dd] rounded w-1/3 mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#ba1a1a]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div>
            <p className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616] mb-1">
              Unable to load products
            </p>
            <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
              {error}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={refetch}
            className="bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-6 py-3 rounded-lg hover:bg-[#386b00] transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[#eeeee9] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#727973]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <p className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
            No products found
          </p>
          <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* ── Product grid ── */}
      {!loading && !error && sorted.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((product, i) => {
            const { badge, badgeVariant } = resolveBadge(product);
            const effectivePrice = product.salePrice ?? product.price;
            return (
              <ShopProductCard
                key={product._id}
                name={product.name}
                description={product.shortDescription ?? product.name}
                price={formatCurrency(effectivePrice)}
                originalPrice={
                  product.salePrice ? formatCurrency(product.price) : undefined
                }
                rating="4.8"
                badge={badge}
                badgeVariant={badgeVariant}
                image={getImageUrl(product)}
                index={i}
                productId={product._id}
                numericPrice={effectivePrice}
              />
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && !error && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex justify-center items-center gap-2 flex-wrap"
        >
          <PaginationBtn
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Previous page"
            disabled={currentPage <= 1}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </PaginationBtn>

          {buildPageNumbers(currentPage, totalPages).map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="w-10 h-10 flex items-center justify-center text-[#424843] font-[var(--font-work-sans)]"
              >
                ...
              </span>
            ) : (
              <PaginationBtn
                key={p}
                active={currentPage === p}
                onClick={() => handlePageChange(Number(p))}
              >
                {p}
              </PaginationBtn>
            )
          )}

          <PaginationBtn
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Next page"
            disabled={currentPage >= totalPages}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </PaginationBtn>
        </motion.div>
      )}
    </section>
  );
}

/* ── Pagination helpers ──────────────────────────────────────── */

function buildPageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function PaginationBtn({
  children,
  active,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.08 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`w-10 h-10 flex items-center justify-center rounded text-sm font-bold font-[var(--font-work-sans)] transition-colors border ${
        active
          ? "bg-[#032616] text-white border-[#032616]"
          : disabled
          ? "border-[#e3e3dd] text-[#b0b5b0] cursor-not-allowed"
          : "border-[#c1c8c1] text-[#424843] hover:border-[#032616] hover:text-[#032616]"
      }`}
    >
      {children}
    </motion.button>
  );
}
