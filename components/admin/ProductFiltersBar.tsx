"use client";

import { motion } from "framer-motion";

interface ProductFiltersBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  stockStatus: string;
  onStockStatusChange: (v: string) => void;
  onReset: () => void;
}

export default function ProductFiltersBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  stockStatus,
  onStockStatusChange,
  onReset,
}: ProductFiltersBarProps) {
  const hasActiveFilters = search || category || stockStatus;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
      className="bg-white rounded-xl p-5 shadow-sm border border-[#e3e3dd] flex flex-wrap gap-4 items-end"
      aria-label="Product filters"
    >
      {/* Search */}
      <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
        <label className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)]">
          Search Products
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca8a3] shrink-0 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Product name or SKU..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#e3e3dd] rounded-lg text-sm text-[#1a1c19] placeholder:text-[#b0b8b0] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5 min-w-[160px]">
        <label className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)]">
          Category
        </label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none border border-[#e3e3dd] rounded-lg px-3 py-2.5 pr-8 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Fresh Greens">Fresh Greens</option>
            <option value="Seeds">Seeds</option>
            <option value="Kits">Kits</option>
            <option value="Herbs">Herbs</option>
          </select>
          <ChevronIcon />
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex flex-col gap-1.5 min-w-[160px]">
        <label className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)]">
          Stock Status
        </label>
        <div className="relative">
          <select
            value={stockStatus}
            onChange={(e) => onStockStatusChange(e.target.value)}
            className="w-full appearance-none border border-[#e3e3dd] rounded-lg px-3 py-2.5 pr-8 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          <ChevronIcon />
        </div>
      </div>

      {/* Reset */}
      <motion.button
        onClick={onReset}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold font-[var(--font-work-sans)] transition-colors ${
          hasActiveFilters
            ? "text-[#032616] bg-[#f4f4ee] hover:bg-[#e8e8e3]"
            : "text-[#727973] hover:text-[#424843] hover:bg-[#f4f4ee]"
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" />
          <line x1="4" y1="18" x2="8" y2="18" />
        </svg>
        Reset Filters
      </motion.button>
    </motion.section>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973] pointer-events-none shrink-0"
      fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
