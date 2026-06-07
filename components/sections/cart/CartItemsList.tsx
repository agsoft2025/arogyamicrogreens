"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CartItem, { CartItemData } from "./CartItem";
import OrderSummary from "./OrderSummary";

const INITIAL_CART: CartItemData[] = [
  {
    id: "sunflower-large",
    name: "Sunflower Shoots - Large",
    description: "Freshly harvested, nutty flavor profile",
    price: 9.0,
    quantity: 2,
    badge: "Bestseller",
    badgeVariant: "bestseller",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLt3oyHfJg21JkD78uRoIPGiU4tf2pQmbj_uYvn54Pp6ZQBItJteJ3R-Ow8kufCR4MMH5CMWuDFYSz4z_WxX0g4Kk1npkU1gBEhyKcJ0jMPKiy4C69LGSkyxeJCZPKut29DtG95GS9eeCDWqVIfvHro4ftrI8hbtz8QGoEP7sGwOPgMg6VoiOCxBdxA0o3MAqAUP2gA6GnVsuF5R0Qap1Tcjk-YKoDQrAA9EwCSkgdAkS3qvQUaAXafdPRw",
  },
  {
    id: "purple-radish",
    name: "Purple Radish Zest",
    description: "Weekly delivery, peppery spice",
    price: 12.5,
    quantity: 1,
    badge: "Subscription Only",
    badgeVariant: "subscription",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLs0IOolfe1srTnxiX2guoxJ6BWGJ64JG8ZhGV8-daV979LzVwcqwx5CpBOZQqCKZxmAiFm7Ueib-esNnF6deET9TnnIP6H_Es5M8rEbhjNbRt5Br00CulmXzEdh8fuN53i5stbxfuRfODOAuXwmaBwAkQd8nM2J4ub3s5Ei9RgqkFaNxjn-HKP_yWiRUTt4GGpnMnztB_2WWYOrdv7HGG-Knbv8lb6cW_amt1aw2oazWuwXeC66KOV1InU",
  },
];

export default function CartItemsList() {
  const [items, setItems] = useState<CartItemData[]>(INITIAL_CART);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQtyChange = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const isEmpty = items.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Cart Items — 8 cols */}
      <div className="lg:col-span-8 space-y-6">
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
                key={item.id}
                item={item}
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
        <OrderSummary subtotal={subtotal} tax={tax} />
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
