"use client";

import { formatCurrency } from "@/lib/currency";
import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FeaturedToggle from "@/components/admin/FeaturedToggle";
import ProductFiltersBar from "@/components/admin/ProductFiltersBar";
import AddProductDialog from "@/components/admin/products/AddProductDialog";
import DeleteProductDialog from "@/components/admin/products/DeleteProductDialog";
import { useProducts } from "@/hooks/useProducts";
import { updateProduct } from "@/api/product.api";
import type { Product, ProductStatus } from "@/types/product.types";

/* ── Status config ───────────────────────────────────────────── */

const STATUS_STYLES: Record<ProductStatus, { bg: string; text: string; dot: string; label: string }> = {
  active:   { bg: "bg-[#d4f4a0]",       text: "text-[#386b00]",  dot: "bg-[#386b00]",  label: "Active" },
  inactive: { bg: "bg-[#e1e4da]",       text: "text-[#444841]",  dot: "bg-[#9ca8a3]",  label: "Inactive" },
  draft:    { bg: "bg-amber-50",        text: "text-amber-700",   dot: "bg-amber-400",  label: "Draft" },
};

function stockLabel(stock: number): { text: string; dot: string } {
  if (stock === 0) return { text: "Out of Stock", dot: "bg-[#ba1a1a]" };
  if (stock <= 10) return { text: `Low (${stock})`,  dot: "bg-amber-400" };
  return { text: `${stock} in stock`, dot: "bg-[#386b00]" };
}

function getImageUrl(product: Product): string {
  const src = product.featuredImage ?? product.images?.[0];
  if (!src) return "";
  if (src.startsWith("http")) return src;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";
  return `${base.replace("/api/v1", "")}/uploads/${src}`;
}

/* ── Page ────────────────────────────────────────────────────── */

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const [search, setSearch]             = useState("");
  const [status, setStatus]             = useState("");
  const [currentPage, setCurrentPage]   = useState(1);
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editProduct, setEditProduct]   = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [successMsg, setSuccessMsg]     = useState("");
  // Optimistic featured overrides — keyed by product._id, cleared on refetch
  const [featuredOverrides, setFeaturedOverrides] = useState<Record<string, boolean>>({});
  // Tracks which toggle is mid-flight so we can disable it
  const [featuredUpdating, setFeaturedUpdating] = useState<Set<string>>(new Set());

  /* Real API */
  const { products, pagination, loading, error, refetch, setParams } = useProducts({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  /* Skip-first-run guards — reset on cleanup so React Strict Mode remount also skips */
  const searchMountRef  = useRef(true);
  const statusMountRef  = useRef(true);
  const pageMountRef    = useRef(true);

  /* Debounce search 400ms → push to API params */
  useEffect(() => {
    if (searchMountRef.current) {
      searchMountRef.current = false;
      return () => { searchMountRef.current = true; };
    }
    const t = setTimeout(() => {
      setParams({ search: search || undefined, page: 1 });
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Status filter → push to API params */
  useEffect(() => {
    if (statusMountRef.current) {
      statusMountRef.current = false;
      return () => { statusMountRef.current = true; };
    }
    setParams({ status: (status as ProductStatus) || undefined, page: 1 });
    setCurrentPage(1);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Page change → push to API params */
  useEffect(() => {
    if (pageMountRef.current) {
      pageMountRef.current = false;
      return () => { pageMountRef.current = true; };
    }
    setParams({ page: currentPage });
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = pagination?.totalPages ?? 1;
  const total      = pagination?.total ?? products.length;

  /* Handlers */
  const handleReset = useCallback(() => {
    setSearch("");
    setStatus("");
    setCurrentPage(1);
    setParams({ search: undefined, status: undefined, page: 1 });
  }, [setParams]);

  const handleToggleFeatured = useCallback(async (id: string, current: boolean) => {
    // Prevent double-tap while request is in flight
    if (featuredUpdating.has(id)) return;

    const next = !current;

    // Optimistic update — flip immediately in the UI
    setFeaturedOverrides((prev) => ({ ...prev, [id]: next }));
    setFeaturedUpdating((prev) => new Set(prev).add(id));

    try {
      await updateProduct(id, { isFeatured: next });
      // Re-fetch the product list so the table reflects the DB state
      refetch();
      // Clear the optimistic override — the fresh API data is now the source of truth
      setFeaturedOverrides((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    } catch {
      // Revert optimistic update on failure
      setFeaturedOverrides((prev) => ({ ...prev, [id]: current }));
    } finally {
      setFeaturedUpdating((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  }, [featuredUpdating]);

  const handleAddSuccess = useCallback(() => {
    refetch();
    setSuccessMsg("Product created successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  }, [refetch]);

  const handleEditSuccess = useCallback(() => {
    refetch();
    setSuccessMsg("Product updated successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  }, [refetch]);

  const handleDeleteSuccess = useCallback(() => {
    refetch();
    setSuccessMsg("Product deleted successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  }, [refetch]);

  /* Pagination page numbers */
  const pageNums: (number | null)[] = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, null, totalPages];
    if (currentPage >= totalPages - 2) return [1, null, totalPages - 2, totalPages - 1, totalPages];
    return [1, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages];
  })();

  const showingFrom = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo   = Math.min(currentPage * ITEMS_PER_PAGE, total);

  return (
    <div className="space-y-5 pb-20 md:pb-6">

      {/* ── Success Toast ──────────────────────────────────────── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 right-6 z-[500] flex items-center gap-3 bg-[#032616] text-white text-sm font-[var(--font-work-sans)] rounded-xl px-5 py-3.5 shadow-2xl"
          >
            <svg className="w-4 h-4 shrink-0 text-[#a5f95b]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m5 13 4 4L19 7" />
            </svg>
            {successMsg}
            <button onClick={() => setSuccessMsg("")} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Header ────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <nav className="flex items-center gap-1.5 text-[12px] font-[var(--font-work-sans)] text-[#727973] mb-4" aria-label="Breadcrumb">
          <Link href="/admin/dashboard" className="hover:text-[#032616] transition-colors">Dashboard</Link>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
          <span className="text-[#1a1c19] font-bold">Product Catalog</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-libre-caslon)] text-[28px] md:text-[32px] font-bold text-[#032616] leading-tight">
              Product Management
            </h1>
            <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
              Manage your harvest inventory and storefront listings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={refetch}
              title="Refresh"
              className="p-2.5 border border-[#e3e3dd] text-[#727973] rounded-lg hover:bg-[#f4f4ee] hover:text-[#032616] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-5 py-3 rounded-lg shadow-md hover:bg-[#4a8a00] transition-colors shrink-0"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
              </svg>
              Add New Product
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── Filters ────────────────────────────────────────────── */}
      <ProductFiltersBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onReset={handleReset}
      />

      {/* ── Table Card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        className="bg-white rounded-xl shadow-sm border border-[#e3e3dd] overflow-hidden"
      >

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#ffdad6] flex items-center justify-center">
              <svg className="w-7 h-7 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <div>
              <p className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616] mb-1">Failed to load products</p>
              <p className="text-sm text-[#727973] font-[var(--font-work-sans)]">{error}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={refetch}
              className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
            >
              Try Again
            </motion.button>
          </div>
        )}

        {/* ── Table ── */}
        {!error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]" aria-label="Products table">
              <thead className="bg-[#f4f4ee] border-b border-[#e3e3dd]">
                <tr>
                  {["Product", "SKU", "Price", "Stock", "Status", "Featured", "Actions"].map((col, i) => (
                    <th
                      key={col}
                      className={`px-6 py-4 font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#1a1c19] whitespace-nowrap ${
                        i === 5 ? "text-center" : i === 6 ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout" initial={false}>

                  {/* Loading skeleton rows */}
                  {loading && Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <tr key={`skel-${i}`} className="border-b border-[#f4f4ee] last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#f0f4f0] animate-pulse shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-32 bg-[#f0f4f0] rounded animate-pulse" />
                            <div className="h-3 w-20 bg-[#f0f4f0] rounded animate-pulse" />
                          </div>
                        </div>
                      </td>
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-3.5 w-16 bg-[#f0f4f0] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Empty state */}
                  {!loading && products.length === 0 && (
                    <tr key="empty">
                      <td colSpan={7}>
                        <EmptyState onReset={handleReset} hasFilters={!!(search || status)} />
                      </td>
                    </tr>
                  )}

                  {/* Real product rows */}
                  {!loading && products.map((product, i) => {
                    const isFeatured = featuredOverrides[product._id] ?? product.isFeatured;
                    const stockInfo  = stockLabel(product.stock);
                    const statusCfg  = STATUS_STYLES[product.status] ?? STATUS_STYLES.draft;
                    const imageUrl   = getImageUrl(product);

                    return (
                      <motion.tr
                        key={product._id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
                        transition={{ delay: i * 0.03, duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                        className="border-b border-[#f4f4ee] last:border-0 transition-colors hover:bg-[#fafaf4]"
                      >
                        {/* Product */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f4f4ee] shrink-0">
                              {imageUrl ? (
                                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-5 h-5 text-[#c1c8c1]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-[#032616] font-[var(--font-work-sans)] leading-tight truncate max-w-[180px]">
                                {product.name}
                              </p>
                              {product.shortDescription && (
                                <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5 truncate max-w-[180px]">
                                  {product.shortDescription}
                                </p>
                              )}
                              {product.salePrice && product.salePrice < product.price && (
                                <span className="inline-block text-[9px] font-bold tracking-widest uppercase text-[#ba1a1a] bg-[#ffdad6] rounded-full px-1.5 py-0.5 mt-0.5 font-[var(--font-work-sans)]">
                                  SALE
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="px-6 py-4">
                          <span className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)] font-medium tabular-nums">
                            {product.sku}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <div>
                            <span className="text-sm font-bold text-[#1a1c19] font-[var(--font-work-sans)] tabular-nums">
                              {formatCurrency(product.salePrice && product.salePrice < product.price
                                ? product.salePrice
                                : product.price)}
                            </span>
                            {product.salePrice && product.salePrice < product.price && (
                              <span className="block text-[11px] text-[#9ca8a3] line-through font-[var(--font-work-sans)] tabular-nums">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${stockInfo.dot}`} />
                            <span className="text-[12px] text-[#424843] font-[var(--font-work-sans)]">
                              {stockInfo.text}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-block text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <FeaturedToggle
                              enabled={isFeatured}
                              onToggle={() => handleToggleFeatured(product._id, isFeatured)}
                              disabled={featuredUpdating.has(product._id)}
                            />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              aria-label={`Edit ${product.name}`}
                              onClick={() => setEditProduct(product)}
                              className="p-2 text-[#9ca8a3] hover:text-[#032616] hover:bg-[#f4f4ee] rounded-lg transition-colors">
                              <EditIcon />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              aria-label={`Delete ${product.name}`}
                              onClick={() => setDeleteTarget(product)}
                              className="p-2 text-[#9ca8a3] hover:text-[#ba1a1a] hover:bg-[#ffd9d5]/30 rounded-lg transition-colors">
                              <TrashIcon />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────────────── */}
        {!loading && !error && total > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-[#f4f4ee] bg-[#fafaf4]/60 flex-wrap gap-3">
            <span className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
              Showing{" "}
              <span className="font-bold text-[#424843]">{showingFrom}–{showingTo}</span>{" "}
              of{" "}
              <span className="font-bold text-[#424843]">{total}</span> products
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
                <PaginationButton onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Previous page">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
                </PaginationButton>

                {pageNums.map((num, idx) =>
                  num === null ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-[#9ca8a3] text-sm select-none">…</span>
                  ) : (
                    <PaginationButton key={num} onClick={() => setCurrentPage(num)} active={currentPage === num} aria-label={`Page ${num}`}>
                      {num}
                    </PaginationButton>
                  )
                )}

                <PaginationButton onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Next page">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
                </PaginationButton>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Create Product Dialog ──────────────────────────────── */}
      <AddProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleAddSuccess}
        mode="create"
      />

      {/* ── Edit Product Dialog ─────────────────────────────────── */}
      <AddProductDialog
        open={editProduct !== null}
        onClose={() => setEditProduct(null)}
        onSuccess={handleEditSuccess}
        mode="edit"
        initialProduct={editProduct ?? undefined}
      />

      {/* ── Delete Product Dialog ───────────────────────────────── */}
      <DeleteProductDialog
        open={deleteTarget !== null}
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function PaginationButton({ children, onClick, active = false, disabled = false, "aria-label": ariaLabel }: {
  children: ReactNode; onClick: () => void; active?: boolean; disabled?: boolean; "aria-label"?: string;
}) {
  return (
    <motion.button onClick={disabled ? undefined : onClick} whileTap={disabled ? {} : { scale: 0.9 }}
      aria-label={ariaLabel} disabled={disabled}
      className={`min-w-[34px] h-[34px] px-2 rounded-lg text-[12px] font-bold font-[var(--font-work-sans)] flex items-center justify-center transition-colors ${
        active
          ? "bg-[#386b00] text-white shadow-sm"
          : disabled
          ? "border border-[#e3e3dd] text-[#c1c8c1] cursor-not-allowed"
          : "border border-[#e3e3dd] text-[#424843] hover:bg-[#f4f4ee] hover:border-[#c1c8c1] cursor-pointer"
      }`}
    >
      {children}
    </motion.button>
  );
}

function EmptyState({ onReset, hasFilters }: { onReset: () => void; hasFilters: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#f4f4ee] flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-[#c1c8c1]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10" />
          <path d="M9.5 9.4c1.1.8 1.8 2.2 2 3.7-1.2.2-2.5.1-3.5-.6C7 11.7 6.5 10 7 9c1 0 2 .4 2.5 1.4z" />
          <path d="M14.1 6a7 7 0 0 0-1.1 4c1.2-.1 2.4-.5 3.3-1.4.9-.9 1.3-2.2 1.1-3.4-.9 0-2.2.3-3.3.8z" />
        </svg>
      </div>
      <h3 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#1a1c19] mb-2">
        {hasFilters ? "No products found" : "No products yet"}
      </h3>
      <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] max-w-xs mb-6">
        {hasFilters ? "Try adjusting your search or filter criteria." : "Add your first product to get started."}
      </p>
      {hasFilters && (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onReset}
          className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors">
          Clear Filters
        </motion.button>
      )}
    </motion.div>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
