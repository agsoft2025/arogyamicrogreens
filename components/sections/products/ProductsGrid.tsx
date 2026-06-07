"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ShopProductCard from "@/components/ui/ShopProductCard";
import { parsePriceString } from "@/lib/currency";

const allProducts = [
  {
    name: "Organic Pea Shoots",
    description: "Sweet, crunchy, and packed with Vitamin C. Perfect for salads and garnishes.",
    price: "₹1,049",
    rating: "4.9",
    badge: "Most Popular",
    badgeVariant: "popular" as const,
    image: "https://lh3.googleusercontent.com/aida/AP1WRLu_8yGVj3EADVzZOWVvB0dkTdhBPzwkerquuTaP_psnbndd4NLh2iwldZ8Nthk-Keen2CGERxdZdCsDp8DIIBYRGFo7S8ogP5xXzDglb_vLYAYQXWq3i5gPGqaksmCARrwZURSrdf-MhJw3vjKZTcOle4LqyRMuEgxu7AgFr4yOHrJVsYnqIlF1npSZaMkOnphUEq9KyWYNSumDnMJMXO-gVvJGB7dRgUwgh68k_fnOmm2VLgYqxlNWeRo",
  },
  {
    name: "Kitchen Starter Kit",
    description: "Everything you need to harvest your first tray in just 7 days.",
    price: "₹2,829",
    rating: "5.0",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLt8nGaFNo818f0KvnBNQbD8d5xNmoJwobxCHBA6V6Jd1FjW_TYZd5kb7U8gaZbyP6leLTSyqwLd5x5WICpD8qHYbA-ma4q32PXtCO1mC7uc6QYkX8yKW2-V9vSBakYaAyMKyywbuOl3ZiYml2KfkVT2fkn-U-MGt1HOovuENDiPv__2Nhes4-TsGstMKv6mWVT7gg7cQf_7evBcGN5lA9ddyYzsh2L6naq-Jd0lwkZ10W3ThE4OFc9-5g",
  },
  {
    name: "Red Rambo Radish",
    description: "Bold, spicy flavor with a striking purple hue to elevate any dish.",
    price: "₹899",
    originalPrice: "₹1,199",
    rating: "4.8",
    badge: "Sale",
    badgeVariant: "sale" as const,
    image: "https://lh3.googleusercontent.com/aida/AP1WRLtN4acDGMhD910J23PGzrRrbBiAMFs2Awre0TIsDjNlJgSGcRTz9Bb6dHkUs1CaOm5YBn0WtqKDtKlZNiYC6z785hJXCOk8F8DXtqUNqQzGTFYq4bqjOEA_HkTqpvUOqvdlZ-C1Ca2VtvMcIHVKbUlpkKHzixYwCypyVK_OgEkyBqVrhFGxtfamoHqJ5GujjlNRMvPB9wBhC6NQdOHVLOP-_IlZ6qpkODsle4N8gkiP8abWMMa4DGysxUM",
  },
  {
    name: "Heirloom Kale Seeds",
    description: "Non-GMO, organic seeds with a 98% germination rate guarantee.",
    price: "₹549",
    rating: "4.7",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLs7sNuLJI585BjSyG9b0cHU7To9eUjxwxrwXFZzHPcJqBj4Mb7fsEJ4JlFpWYwpedSWv2R-LWHCAaC8YjDRwPIiAiXvQAjxzFt-7PM_FgAMxppGfkOCU3VhQd8r-8CQ91_SwUBGspVF_k2vzEP2lsJbwcHhNJxNlRw5WPmwFWJEdZWxUdySLmmR7JcZw2HDItnWNcpyOamerYG3sbe8XQ6q3halwfKd2wY6hF7lO787xio1ZleECFFY2w",
  },
  {
    name: "Smart Grow Hub",
    description: "Automated light and water management for effortless year-round harvest.",
    price: "₹15,699",
    rating: "5.0",
    badge: "New",
    badgeVariant: "new" as const,
    image: "https://lh3.googleusercontent.com/aida/AP1WRLsmZCUVEGDeqV3xbbHSBfVLyPa94R8a6kw1PrBXzFDOzqziRakerprDYqjg2tGtazXCrTOlZgsZhmQcBjzFPwZQ5ek5-PY2kYDd7EHY22DKk8AV4iLz2-X83R3qa0iDkP_zTHSwNXLWdJ1IN-tGO1glIZ-DLYR0YFQ_Gx-wVJhkEMTyqSB0LAtv0pcpFiAZAujvpBkJ8Q-YNP6mHk0VkzTg30lgCDaaPZ43I57Pl7h2vdvoWYCsTzvFy0A",
  },
  {
    name: "Chef's Variety Pack",
    description: "Four different varieties in one tray to diversify your meal prep.",
    price: "₹1,499",
    rating: "4.9",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLtL_QPEWymDIjNfr0d7bg8q9dT-hdJOfv8Nl8kugci9OayVKUhifPI7h8GcYDH1CsZwKKYPN5LeZ3Q5BOhr1D6UacMTPyM_T83DM3GRniAu3vLYAYQXWq3i5gPGqaksmCARrwZURSrdf-MhJw3vjKZTcOle4LqyRMuEgxu7AgFr4yOHrJVsYnqIlF1npSZaMkOnphUEq9KyWYNSumDnMJMXO-gVvJGB7dRgUwgh68k_fnOmm2VLgYqxlNWeRo",
  },
];

const sortOptions = ["Featured", "Newest Arrivals", "Price: Low to High", "Top Rated"];

const pages = [1, 2, 3, "...", 12];

export default function ProductsGrid() {
  const [sort, setSort] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);

  // Sort products client-side
  const sorted = [...allProducts].sort((a, b) => {
    if (sort === "Price: Low to High") {
      return parsePriceString(a.price) - parsePriceString(b.price);
    }
    if (sort === "Top Rated") {
      return parseFloat(b.rating) - parseFloat(a.rating);
    }
    return 0;
  });

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
          Showing <span className="font-bold text-[#1a1c19]">24</span> of 152 products
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#424843] font-[var(--font-work-sans)]">Sort by:</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-transparent border-none font-bold text-[11px] tracking-widest uppercase text-[#032616] font-[var(--font-work-sans)] focus:ring-0 cursor-pointer pr-5 outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#032616] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* 3-col grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((product, i) => (
          <ShopProductCard key={product.name} {...product} index={i} />
        ))}
      </div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-16 flex justify-center items-center gap-2"
      >
        <PaginationBtn
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </PaginationBtn>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className="w-10 h-10 flex items-center justify-center text-[#424843] font-[var(--font-work-sans)]">
              ...
            </span>
          ) : (
            <PaginationBtn
              key={i}
              active={currentPage === p}
              onClick={() => setCurrentPage(Number(p))}
            >
              {p}
            </PaginationBtn>
          )
        )}

        <PaginationBtn
          onClick={() => setCurrentPage(Math.min(12, currentPage + 1))}
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </PaginationBtn>
      </motion.div>
    </section>
  );
}

function PaginationBtn({
  children,
  active,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`w-10 h-10 flex items-center justify-center rounded text-sm font-bold font-[var(--font-work-sans)] transition-colors border ${
        active
          ? "bg-[#032616] text-white border-[#032616]"
          : "border-[#c1c8c1] text-[#424843] hover:border-[#032616] hover:text-[#032616]"
      }`}
    >
      {children}
    </motion.button>
  );
}
