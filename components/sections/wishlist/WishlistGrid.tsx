"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import WishlistCard from "./WishlistCard";
import { useWishlist } from "@/store/wishlistStore";
import { useCart } from "@/store/cartStore";

const CATEGORIES = [
  { label: "All Items" },
  { label: "Microgreens" },
  { label: "Growing Kits" },
  { label: "Subscriptions" },
];

export default function WishlistGrid() {
  const [activeCategory, setActiveCategory] = useState(0);
  const { items, removeItem, loading, error } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  const handleMoveToCart = (productId: string) => {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  const isEmpty = items.length === 0 && !loading;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Sidebar */}
      <aside className="hidden md:block col-span-3 space-y-6">
        {/* Category Filter */}
        <FadeIn direction="left">
          <div className="bg-[#f4f4ee] rounded-xl p-6">
            <h3 className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#032616] mb-4">
              Categories
            </h3>
            <ul className="space-y-3" role="list">
              {CATEGORIES.map((cat, i) => (
                <li key={cat.label}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={i === activeCategory}
                      onChange={() => setActiveCategory(i)}
                      className="rounded border-[#727973] accent-[#386b00] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-[var(--font-work-sans)] text-sm text-[#1a1c19] group-hover:text-[#386b00] transition-colors">
                      {cat.label}
                      {i === 0 && items.length > 0 && (
                        <span className="text-[#727973] ml-1">({items.length})</span>
                      )}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        {/* Promo Card */}
        <FadeIn direction="left" delay={0.1}>
          <div className="bg-[#032616] rounded-xl p-6 relative overflow-hidden">
            {/* Decorative watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-[0.07] pointer-events-none">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-1 3-1c0 0-1-1-3-1s-3 2-3 2 1 0 2 .5C10 6 17 8 17 8z" />
              </svg>
            </div>
            <h4 className="font-[var(--font-libre-caslon)] text-xl font-bold text-white mb-2 relative z-10">
              Harvest Promo
            </h4>
            <p className="text-sm text-white/75 font-[var(--font-work-sans)] mb-4 leading-relaxed relative z-10">
              Add 3 items from your wishlist to cart and get 15% off your first
              subscription.
            </p>
            <Link href="/subscription">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="block w-full bg-[#a5f95b] text-[#3b7100] font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] py-3 rounded-lg text-center transition-colors hover:bg-[#8adb41] relative z-10 cursor-pointer"
              >
                View Subscription Plans
              </motion.span>
            </Link>
          </div>
        </FadeIn>
      </aside>

      {/* Product Cards Grid */}
      <div className="col-span-1 md:col-span-9">
        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-3 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-sm font-[var(--font-work-sans)] font-bold"
          >
            {error}
          </motion.div>
        )}

        {/* Loading skeleton */}
        {loading && items.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="h-64 bg-[#eeeee9]" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-[#eeeee9] rounded w-3/4" />
                  <div className="h-4 bg-[#eeeee9] rounded w-full" />
                  <div className="h-4 bg-[#eeeee9] rounded w-2/3" />
                  <div className="h-10 bg-[#eeeee9] rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {!loading && isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#eeeee9] flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#727973]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-[#424843] font-[var(--font-work-sans)] text-sm mb-6 max-w-xs">
                Browse our microgreens and save your favorites to come back to
                later.
              </p>
              <Link href="/products">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-8 py-4 rounded-lg cursor-pointer hover:bg-[#386b00] transition-colors"
                >
                  Explore Products
                </motion.span>
              </Link>
            </motion.div>
          ) : (
            !loading && (
              <motion.div
                key="grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => (
                    <WishlistCard
                      key={item.productId}
                      item={item}
                      index={i}
                      onRemove={handleRemove}
                      onMoveToCart={handleMoveToCart}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
