"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CartItemData {
  id: string;
  name: string;
  description: string;
  price: number;        // unit price in dollars
  quantity: number;
  badge?: string;
  badgeVariant?: "bestseller" | "subscription" | "new" | "organic";
  image: string;
}

interface CartItemProps {
  item: CartItemData;
  index: number;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
}

const badgeStyles: Record<string, string> = {
  bestseller: "bg-[#a5f95b] text-[#3b7100]",
  subscription: "bg-[#c6ecd1] text-[#2d4e3a]",
  new: "bg-[#032616] text-white",
  organic: "bg-[#386b00] text-white",
};

export default function CartItem({
  item,
  index,
  onRemove,
  onQuantityChange,
}: CartItemProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  const decrement = () => {
    if (item.quantity > 1) onQuantityChange(item.id, item.quantity - 1);
  };

  const increment = () => onQuantityChange(item.id, item.quantity + 1);

  const lineTotal = (item.price * item.quantity).toFixed(2);
  const variant = item.badgeVariant ?? "organic";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        duration: 0.55,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      exit={{ opacity: 0, x: 30, transition: { duration: 0.25 } }}
      animate={removing ? { opacity: 0, x: 30 } : { opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-6 flex flex-col sm:flex-row gap-6 group transition-shadow"
      style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.10)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 20px rgba(3,38,22,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(3,38,22,0.10)";
      }}
    >
      {/* Product image */}
      <div className="w-full sm:w-40 h-40 rounded-lg overflow-hidden bg-[#eeeee9] shrink-0">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Details */}
      <div className="flex-grow flex flex-col justify-between min-w-0">
        {/* Top row: badge + name + delete */}
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            {item.badge && (
              <span
                className={`inline-block px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest font-[var(--font-work-sans)] mb-2 ${badgeStyles[variant]}`}
              >
                {item.badge}
              </span>
            )}
            <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] leading-tight">
              {item.name}
            </h3>
            <p className="text-sm text-[#424843] font-[var(--font-work-sans)] italic mt-0.5">
              {item.description}
            </p>
          </div>

          {/* Delete */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 text-[#727973] hover:text-[#ba1a1a] transition-colors p-1"
          >
            <TrashIcon />
          </motion.button>
        </div>

        {/* Bottom row: quantity stepper + price */}
        <div className="flex justify-between items-end mt-4 gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center border border-[#c1c8c1] rounded-lg overflow-hidden bg-[#fafaf4]">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={decrement}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="px-3 py-2 hover:bg-[#e8e8e3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MinusIcon />
            </motion.button>

            <span className="w-10 text-center font-bold text-[15px] font-[var(--font-work-sans)] text-[#1a1c19] select-none">
              {item.quantity}
            </span>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={increment}
              aria-label="Increase quantity"
              className="px-3 py-2 hover:bg-[#e8e8e3] transition-colors"
            >
              <PlusIcon />
            </motion.button>
          </div>

          {/* Line total */}
          <AnimatePresence mode="wait">
            <motion.span
              key={lineTotal}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#386b00]"
            >
              ${lineTotal}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function TrashIcon() {
  return (
    <svg
      className="w-5 h-5"
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

function MinusIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
