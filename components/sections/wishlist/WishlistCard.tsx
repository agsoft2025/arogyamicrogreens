"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WishlistItem } from "@/types/wishlist.types";

interface WishlistCardProps {
  item: WishlistItem;
  index: number;
  onRemove: (productId: string) => void;
  onMoveToCart: (productId: string) => void;
}

const badgeStyles: Record<string, string> = {
  organic: "bg-[#386b00] text-white",
  popular: "bg-[#032616] text-white",
  kit: "bg-[#a5f95b] text-[#3b7100]",
  new: "bg-[#032616] text-white",
  sale: "bg-[#ba1a1a] text-white",
};

type CartState = "idle" | "loading" | "added";

export default function WishlistCard({
  item,
  index,
  onRemove,
  onMoveToCart,
}: WishlistCardProps) {
  const [cartState, setCartState] = useState<CartState>("idle");

  const handleMoveToCart = () => {
    if (cartState !== "idle") return;
    setCartState("loading");
    onMoveToCart(item.productId);
    setTimeout(() => {
      setCartState("added");
      setTimeout(() => setCartState("idle"), 2000);
    }, 1200);
  };

  const handleRemove = () => {
    onRemove(item.productId);
  };

  const variant = item.badgeVariant ?? "organic";

  // Format numeric INR price → ₹1,049
  const priceDisplay = `₹${item.price.toLocaleString("en-IN")}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        duration: 0.55,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      layout
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl overflow-hidden flex flex-col group cursor-pointer"
      style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.10)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 24px rgba(3,38,22,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(3,38,22,0.10)";
      }}
    >
      {/* Image */}
      <div className="relative h-64 bg-[#eeeee9] overflow-hidden shrink-0">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.5 }}
        />
        {item.badge && (
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest font-[var(--font-work-sans)] ${badgeStyles[variant]}`}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Name + Description */}
        <div className="mb-4">
          <h3 className="font-[var(--font-libre-caslon)] text-[22px] font-bold text-[#032616] leading-tight mb-1">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-[#424843] font-[var(--font-work-sans)] leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto mb-4">
          <span className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#386b00]">
            {priceDisplay}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Move to Cart */}
          <motion.button
            whileHover={{ scale: cartState === "idle" ? 1.02 : 1 }}
            whileTap={{ scale: cartState === "idle" ? 0.97 : 1 }}
            onClick={handleMoveToCart}
            disabled={cartState !== "idle"}
            aria-label={`Move ${item.name} to cart`}
            className={`w-full py-3 rounded-lg font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] flex items-center justify-center gap-2 transition-colors ${
              cartState === "added"
                ? "bg-[#032616] text-white"
                : "bg-[#386b00] text-white hover:bg-[#032616]"
            } disabled:opacity-80`}
          >
            <AnimatePresence mode="wait">
              {cartState === "idle" && (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CartIcon />
                  Move to Cart
                </motion.span>
              )}
              {cartState === "loading" && (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <SpinnerIcon />
                  Adding...
                </motion.span>
              )}
              {cartState === "added" && (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckIcon />
                  Added!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Remove */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRemove}
            aria-label={`Remove ${item.name} from wishlist`}
            className="w-full py-2.5 rounded-lg font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] flex items-center justify-center gap-2 border border-[#727973] text-[#424843] hover:bg-[#ffdad6] hover:text-[#ba1a1a] hover:border-[#ba1a1a] transition-colors"
          >
            <TrashIcon />
            Remove
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

function CartIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <motion.svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </motion.svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
