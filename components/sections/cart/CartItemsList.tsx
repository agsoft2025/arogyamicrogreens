"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/store/cartStore";

export default function CartItemsList() {
  const { items, loading, syncing, syncError, removeItem, updateQty } =
    useCart();

  const isEmpty = items.length === 0;

  const handleRemove = async (productId: string) => {
    await removeItem(productId);
  };

  const handleQtyChange = async (productId: string, qty: number) => {
    await updateQty(productId, qty);
  };

  /* ── Loading / syncing states ─────────────────────────────── */
  if (loading || syncing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 rounded-full border-4 border-[#e3e3dd] border-t-[#386b00] mb-4"
        />
        <p className="text-sm text-[#727973] font-[var(--font-work-sans)]">
          {syncing ? "Syncing your cart…" : "Loading cart…"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Cart Items — 8 cols */}
      <div className="lg:col-span-8 space-y-6">
        {/* Sync error banner */}
        <AnimatePresence>
          {syncError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 bg-[#ffdad6] text-[#ba1a1a] text-sm font-[var(--font-work-sans)] rounded-lg px-4 py-3"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {syncError}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {isEmpty ? (
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
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-[#424843] font-[var(--font-work-sans)] mb-6 max-w-xs">
                Browse our fresh organic microgreens and add them to your cart.
              </p>
              <Link href="/products">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-8 py-4 rounded-lg cursor-pointer hover:bg-[#386b00] transition-colors"
                >
                  Shop Microgreens
                </motion.span>
              </Link>
            </motion.div>
          ) : (
            items.map((item, i) => (
              <CartItem
                key={item.productId}
                item={{
                  productId: item.productId,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image,
                }}
                index={i}
                onRemove={handleRemove}
                onQuantityChange={handleQtyChange}
              />
            ))
          )}
        </AnimatePresence>

        {/* Continue Shopping */}
        {!isEmpty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="pt-2"
          >
            <Link href="/products">
              <motion.span
                whileHover={{ x: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="inline-flex items-center gap-2 font-[var(--font-work-sans)] text-sm font-bold text-[#032616] group cursor-pointer"
              >
                <ArrowLeftIcon />
                <span className="border-b-2 border-[#aacfb6] hover:border-[#032616] transition-colors pb-0.5">
                  Continue Shopping
                </span>
              </motion.span>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Order Summary — 4 cols, sticky */}
      <div className="lg:col-span-4 lg:sticky lg:top-24">
        <OrderSummary />
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
