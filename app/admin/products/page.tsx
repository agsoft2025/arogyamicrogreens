"use client";

import { formatCurrency } from "@/lib/currency";
import { useState, useMemo, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FeaturedToggle from "@/components/admin/FeaturedToggle";
import ProductFiltersBar from "@/components/admin/ProductFiltersBar";

/* ─── Types ─────────────────────────────────────────── */
type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
type Category = "Fresh Greens" | "Seeds" | "Kits" | "Herbs";

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: Category;
  price: number;
  stockStatus: StockStatus;
  stockCount?: number;
  featured: boolean;
  image: string;
}

/* ─── Mock Data ──────────────────────────────────────── */
const IMG = {
  broccoli:
    "https://lh3.googleusercontent.com/aida/AP1WRLtEukCwKJQpnTCBmrmH5qZgoMIs2PhBA_CPFbBUjRRYyjAuX25uSuoIrTp2XMD3EkB7hRzPpWojwndpb9T6UyYOMqcOi_ulO4mJCpcIrgEELPE1wQnvIgtJzMzgQ7PcKPJMLbyJG2lleMwlUMeI2o-8fihKGUKGjWVWUf_QH9AH1hck3kT1rAdB1wiscXJTxrpGT-RIrHh0P5KjZwc6_ZYvfC_qwlKsZigY2FQyT8POOUIjGIgFIR9Tr6c",
  kale: "https://lh3.googleusercontent.com/aida/AP1WRLs4WbQAcI8dhqB_-xyb1J0CzujXCucOboTYUPnEwUPdzI0OmhbVrkxo8q5QgG_4bgBPVp8uA3djdJ1b-OanyUXGYYl9_YHYRy7hFwB-1YYEP3dlOU63PAcCGx1k0wUMr7xIOJSDvRNSRNX_o_UVl_YWnq-PaxQhLNefFsos0Wo9ayXks9F3TCS-AP9v_mN351xqYhAlIWyeUJPHWqc_vzFuhIADWF5FWHJttqgNxO65iXCqW8Vqsm3u0Q",
  kit: "https://lh3.googleusercontent.com/aida/AP1WRLsRqGJbHRKj_9kC5uxSJnkFc1JdXKnBgt0BqlmjsHNFrAoRK-omyQbFobbxYRZLEP62RBGwr4Xej6lWfMO5cn2_JqmYwIjTKL4-MNAJFz-McZykH-ad2ybr_-eZLkPbdxXrd8A7PC7rLuVMz0vINiIPcGdn5YwrIO76rV7j23fs40X0DEwHAcSeF8ucgxp2VTTW7mI3-zrFbyF-hEbGR0p6RDN4Mvgjyf-h-jGuPYVr0W7tRYHxmkThrA",
  radish:
    "https://lh3.googleusercontent.com/aida/AP1WRLt5_eT7G-myuHtQv_D8uKJf0eqVqRYUTeUuIvP0WqrrhX70xN6Z6sVbX2wkehLPwru5t5AQDPZooP_efzj58CvSRwH9C2pQ6uxT0RnW8xvEoRUhkjtyYAhQa4V9531elo0FiQ7R8ffzLoaP3HOriR8XYItwMB2qKi9ZEDE1Q1ckXGdgcG-s5RbwOopZ7vP4Q7rT4bPMrKUj2OjFZ1esiLFWcazUVIK_eaKLn0F6A7gIi8SI2f9lV7tbZeY",
  admin:
    "https://lh3.googleusercontent.com/aida/AP1WRLtzMUGsKqS72MVxBBvmffxdhrWDhg7GqEELXCG7XyMSzVpjdts4vu4LzoLCYznxXvu4T5KP2hFSd7yFiJh_je2KeyKD8_srDGMveI8Id3kw2vc2a1NaKafWOseNhpzs5XtnZNYozQO5nGJ885v6IPQdK-I7yWx491PbaOIDmGlqIZ8vk6zO2vhAuNEU2LPZzPWlZWzHIMlFF_O-wNEiZmeVQrwwB39A729fc14wdVZJFyeivkrbrtnf9b8",
};

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Broccoli Microgreens", description: "Tray Size: 10x20", sku: "MG-BR-001", category: "Fresh Greens", price: 1549, stockStatus: "in_stock", featured: true, image: IMG.broccoli },
  { id: "2", name: "Red Russian Kale Seeds", description: "Organic Certified", sku: "SD-KL-042", category: "Seeds", price: 999, stockStatus: "low_stock", stockCount: 14, featured: false, image: IMG.kale },
  { id: "3", name: "Chef's Starter Kit", description: "Includes 3 Varieties", sku: "KT-CS-005", category: "Kits", price: 3749, stockStatus: "out_of_stock", featured: true, image: IMG.kit },
  { id: "4", name: "Purple Radish Greens", description: "Bulk Option Available", sku: "MG-PR-022", category: "Fresh Greens", price: 1399, stockStatus: "in_stock", featured: false, image: IMG.radish },
  { id: "5", name: "Sunflower Microgreens", description: "Extra Crunchy & Nutty", sku: "MG-SF-011", category: "Fresh Greens", price: 1849, stockStatus: "in_stock", featured: true, image: IMG.broccoli },
  { id: "6", name: "Pea Shoot Seeds", description: "Non-GMO Certified", sku: "SD-PS-019", category: "Seeds", price: 799, stockStatus: "in_stock", stockCount: 45, featured: false, image: IMG.kale },
  { id: "7", name: "Harvest Essentials Kit", description: "5 Variety Bundle", sku: "KT-HE-003", category: "Kits", price: 5699, stockStatus: "in_stock", featured: true, image: IMG.kit },
  { id: "8", name: "Amaranth Microgreens", description: "Rich in Protein", sku: "MG-AM-033", category: "Fresh Greens", price: 1999, stockStatus: "low_stock", stockCount: 8, featured: false, image: IMG.radish },
  { id: "9", name: "Basil Herb Blend", description: "Italian & Thai Mix", sku: "HB-BL-007", category: "Herbs", price: 1629, stockStatus: "in_stock", featured: false, image: IMG.broccoli },
  { id: "10", name: "Arugula Microgreens", description: "Peppery & Vibrant", sku: "MG-AR-028", category: "Fresh Greens", price: 1449, stockStatus: "in_stock", featured: false, image: IMG.radish },
  { id: "11", name: "Wheatgrass Seeds", description: "Cold-Pressed Grade", sku: "SD-WG-055", category: "Seeds", price: 1249, stockStatus: "out_of_stock", featured: false, image: IMG.kale },
  { id: "12", name: "Beginner Grow Kit", description: "Perfect Starter Set", sku: "KT-BG-001", category: "Kits", price: 2449, stockStatus: "in_stock", featured: true, image: IMG.kit },
  { id: "13", name: "Cilantro Microgreens", description: "Zesty & Aromatic", sku: "MG-CL-015", category: "Herbs", price: 1349, stockStatus: "in_stock", featured: false, image: IMG.broccoli },
  { id: "14", name: "Flax Seeds Organic", description: "Cold-Pressed Ready", sku: "SD-FL-039", category: "Seeds", price: 949, stockStatus: "low_stock", stockCount: 21, featured: false, image: IMG.kale },
  { id: "15", name: "Watercress Greens", description: "Hydroponic Grown", sku: "MG-WC-044", category: "Fresh Greens", price: 1719, stockStatus: "in_stock", featured: false, image: IMG.radish },
  { id: "16", name: "Farm Bundle Pro", description: "10 Tray Set + Soil", sku: "KT-FB-009", category: "Kits", price: 7449, stockStatus: "in_stock", featured: true, image: IMG.kit },
  { id: "17", name: "Pea Shoots Fresh", description: "Sweet & Tender", sku: "MG-PS-020", category: "Fresh Greens", price: 1299, stockStatus: "in_stock", featured: false, image: IMG.broccoli },
  { id: "18", name: "Chia Seeds Raw", description: "Superfood Grade", sku: "SD-CH-061", category: "Seeds", price: 1099, stockStatus: "in_stock", stockCount: 88, featured: false, image: IMG.kale },
  { id: "19", name: "Dill Herb Microgreens", description: "Fresh Picked Daily", sku: "HB-DL-012", category: "Herbs", price: 1499, stockStatus: "low_stock", stockCount: 6, featured: false, image: IMG.broccoli },
  { id: "20", name: "Kohlrabi Microgreens", description: "Mild & Crunchy", sku: "MG-KH-037", category: "Fresh Greens", price: 1749, stockStatus: "in_stock", featured: false, image: IMG.radish },
  { id: "21", name: "Sunflower Seeds Raw", description: "Hulled & Ready", sku: "SD-SN-047", category: "Seeds", price: 729, stockStatus: "in_stock", stockCount: 120, featured: false, image: IMG.kale },
  { id: "22", name: "Chef's Harvest Kit", description: "Restaurant Grade", sku: "KT-CH-015", category: "Kits", price: 4599, stockStatus: "out_of_stock", featured: false, image: IMG.kit },
  { id: "23", name: "Mustard Microgreens", description: "Spicy & Nutritious", sku: "MG-MS-031", category: "Fresh Greens", price: 1199, stockStatus: "in_stock", featured: false, image: IMG.broccoli },
  { id: "24", name: "Fennel Herb Blend", description: "Anise-Flavored Fresh", sku: "HB-FN-018", category: "Herbs", price: 1889, stockStatus: "in_stock", featured: false, image: IMG.radish },
  { id: "25", name: "Buckwheat Microgreens", description: "Earthy & Nutritious", sku: "MG-BW-049", category: "Fresh Greens", price: 1599, stockStatus: "low_stock", stockCount: 11, featured: false, image: IMG.broccoli },
  { id: "26", name: "Hemp Seeds Hulled", description: "High Protein Grade", sku: "SD-HM-072", category: "Seeds", price: 1379, stockStatus: "in_stock", stockCount: 34, featured: false, image: IMG.kale },
  { id: "27", name: "Micro Garden Starter", description: "All-in-One Solution", sku: "KT-MG-021", category: "Kits", price: 3199, stockStatus: "in_stock", featured: false, image: IMG.kit },
  { id: "28", name: "Cabbage Microgreens", description: "Sweet & Delicate", sku: "MG-CB-026", category: "Fresh Greens", price: 1149, stockStatus: "in_stock", featured: false, image: IMG.radish },
  { id: "29", name: "Parsley Herb Tray", description: "Flat Leaf Variety", sku: "HB-PR-024", category: "Herbs", price: 1469, stockStatus: "out_of_stock", featured: false, image: IMG.broccoli },
  { id: "30", name: "Quinoa Seeds Organic", description: "Pre-Rinsed & Ready", sku: "SD-QN-083", category: "Seeds", price: 1529, stockStatus: "in_stock", stockCount: 52, featured: false, image: IMG.kale },
  { id: "31", name: "Deluxe Grower's Kit", description: "Pro Tier Bundle", sku: "KT-DX-031", category: "Kits", price: 9199, stockStatus: "in_stock", featured: true, image: IMG.kit },
  { id: "32", name: "Beet Microgreens", description: "Ruby Red Stems", sku: "MG-BT-058", category: "Fresh Greens", price: 1929, stockStatus: "in_stock", featured: false, image: IMG.radish },
];

/* ─── Constants ──────────────────────────────────────── */
const ITEMS_PER_PAGE = 8;

const CATEGORY_STYLES: Record<Category, { bg: string; text: string }> = {
  "Fresh Greens": { bg: "bg-[#1b3c2a]/10", text: "text-[#1b3c2a]" },
  Seeds: { bg: "bg-[#e1e4da]", text: "text-[#444841]" },
  Kits: { bg: "bg-[#a5f95b]", text: "text-[#3b7100]" },
  Herbs: { bg: "bg-[#d4f4a0]", text: "text-[#386b00]" },
};

const STOCK_CONFIG: Record<StockStatus, { dot: string; label: (count?: number) => string }> = {
  in_stock: { dot: "bg-[#386b00]", label: () => "In Stock" },
  low_stock: { dot: "bg-[#f59e0b]", label: (n) => `Low Stock${n ? ` (${n})` : ""}` },
  out_of_stock: { dot: "bg-[#ba1a1a]", label: () => "Out of Stock" },
};

/* ─── Page ───────────────────────────────────────────── */
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  /* Filtering */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchCategory = !category || p.category === category;
      const matchStatus = !stockStatus || p.stockStatus === stockStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, category, stockStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const showingFrom = (safePage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(safePage * ITEMS_PER_PAGE, filtered.length);

  /* Handlers */
  const handleFilterChange = useCallback(
    (setter: (v: string) => void) => (v: string) => {
      setter(v);
      setCurrentPage(1);
    },
    []
  );

  const handleReset = useCallback(() => {
    setSearch("");
    setCategory("");
    setStockStatus("");
    setCurrentPage(1);
  }, []);

  const handleToggleFeatured = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      setConfirmDeleteId(null);
      setDeletingIds((s) => new Set(s).add(id));
      await new Promise((r) => setTimeout(r, 350));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeletingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    },
    []
  );

  /* Pagination pages to show */
  const pageNums = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, null, totalPages];
    if (safePage >= totalPages - 2) return [1, null, totalPages - 2, totalPages - 1, totalPages];
    return [1, null, safePage - 1, safePage, safePage + 1, null, totalPages];
  }, [totalPages, safePage]);

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      {/* ─── Page Header ─────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] font-[var(--font-work-sans)] text-[#727973] mb-4" aria-label="Breadcrumb">
          <Link href="/admin/dashboard" className="hover:text-[#032616] transition-colors">
            Dashboard
          </Link>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span className="text-[#1a1c19] font-bold">Product Catalog</span>
        </nav>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-libre-caslon)] text-[28px] md:text-[32px] font-bold text-[#032616] leading-tight">
              Product Management
            </h1>
            <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
              Manage your harvest inventory and storefront listings.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-5 py-3 rounded-lg shadow-md hover:bg-[#4a8a00] transition-colors shrink-0"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
            </svg>
            Add New Product
          </motion.button>
        </div>
      </motion.header>

      {/* ─── Filters ─────────────────────────────────── */}
      <ProductFiltersBar
        search={search}
        onSearchChange={handleFilterChange(setSearch)}
        category={category}
        onCategoryChange={handleFilterChange(setCategory)}
        stockStatus={stockStatus}
        onStockStatusChange={handleFilterChange(setStockStatus)}
        onReset={handleReset}
      />

      {/* ─── Table ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        className="bg-white rounded-xl shadow-sm border border-[#e3e3dd] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]" aria-label="Products table">
            {/* Head */}
            <thead className="bg-[#f4f4ee] border-b border-[#e3e3dd]">
              <tr>
                {["Product Name", "SKU", "Category", "Price", "Stock Status", "Featured", "Actions"].map(
                  (col, i) => (
                    <th
                      key={col}
                      className={`px-6 py-4 font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#1a1c19] whitespace-nowrap ${
                        i === 5 ? "text-center" : i === 6 ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
                {paginated.length === 0 ? (
                  <tr key="empty">
                    <td colSpan={7}>
                      <EmptyState onReset={handleReset} hasFilters={!!(search || category || stockStatus)} />
                    </td>
                  </tr>
                ) : (
                  paginated.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{
                        opacity: deletingIds.has(product.id) ? 0.4 : 1,
                        y: 0,
                        scale: deletingIds.has(product.id) ? 0.98 : 1,
                      }}
                      exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
                      transition={{ delay: i * 0.04, duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                      className={`border-b border-[#f4f4ee] last:border-0 transition-colors ${
                        deletingIds.has(product.id)
                          ? "bg-[#fff5f5]"
                          : "hover:bg-[#fafaf4]"
                      }`}
                    >
                      {/* Product Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f4f4ee] shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#032616] font-[var(--font-work-sans)] leading-tight">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-6 py-4">
                        <span className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)] font-medium tabular-nums">
                          {product.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] px-2.5 py-1 rounded ${
                            CATEGORY_STYLES[product.category].bg
                          } ${CATEGORY_STYLES[product.category].text}`}
                        >
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-[#1a1c19] font-[var(--font-work-sans)] tabular-nums">
                          {formatCurrency(product.price)}
                        </span>
                      </td>

                      {/* Stock Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${STOCK_CONFIG[product.stockStatus].dot}`}
                          />
                          <span className="text-[12px] text-[#424843] font-[var(--font-work-sans)]">
                            {STOCK_CONFIG[product.stockStatus].label(product.stockCount)}
                          </span>
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <FeaturedToggle
                            enabled={product.featured}
                            onToggle={() => handleToggleFeatured(product.id)}
                            disabled={deletingIds.has(product.id)}
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {confirmDeleteId === product.id ? (
                            /* Inline delete confirmation */
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-1.5"
                            >
                              <span className="text-[11px] text-[#ba1a1a] font-bold font-[var(--font-work-sans)]">
                                Delete?
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteConfirm(product.id)}
                                className="text-[11px] bg-[#ba1a1a] text-white font-bold font-[var(--font-work-sans)] px-2.5 py-1 rounded-md hover:bg-[#93000a] transition-colors"
                              >
                                Yes
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-[11px] border border-[#e3e3dd] text-[#424843] font-bold font-[var(--font-work-sans)] px-2.5 py-1 rounded-md hover:bg-[#f4f4ee] transition-colors"
                              >
                                No
                              </motion.button>
                            </motion.div>
                          ) : (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label={`Edit ${product.name}`}
                                className="p-2 text-[#9ca8a3] hover:text-[#032616] hover:bg-[#f4f4ee] rounded-lg transition-colors"
                              >
                                <EditIcon />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label={`Delete ${product.name}`}
                                onClick={() => setConfirmDeleteId(product.id)}
                                className="p-2 text-[#9ca8a3] hover:text-[#ba1a1a] hover:bg-[#ffd9d5]/30 rounded-lg transition-colors"
                              >
                                <TrashIcon />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ──────────────────────────── */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-[#f4f4ee] bg-[#fafaf4]/60 flex-wrap gap-3">
            <span className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
              Showing{" "}
              <span className="font-bold text-[#424843]">
                {showingFrom}–{showingTo}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#424843]">{filtered.length}</span> products
            </span>

            <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
              {/* Prev */}
              <PaginationButton
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </PaginationButton>

              {/* Pages */}
              {pageNums.map((num, idx) =>
                num === null ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-[#9ca8a3] text-sm select-none">
                    …
                  </span>
                ) : (
                  <PaginationButton
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    active={safePage === num}
                    aria-label={`Page ${num}`}
                    aria-current={safePage === num ? "page" : undefined}
                  >
                    {num}
                  </PaginationButton>
                )
              )}

              {/* Next */}
              <PaginationButton
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                aria-label="Next page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </PaginationButton>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────── */

function PaginationButton({
  children,
  onClick,
  active = false,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
}) {
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileTap={disabled ? {} : { scale: 0.9 }}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      disabled={disabled}
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
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
        {hasFilters
          ? "Try adjusting your search or filter criteria."
          : "Add your first product to get started with your inventory."}
      </p>
      {hasFilters && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
        >
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
