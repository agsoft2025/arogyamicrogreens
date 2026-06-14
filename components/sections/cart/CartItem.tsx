"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/currency";

export interface CartItemData {
  productId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  badge?: string;
  badgeVariant?: "bestseller" | "subscription" | "new" | "organic";
  image: string;
}

interface CartItemProps {
  item: CartItemData;
  index: number;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, qty: number) => void;
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

  /**
   * LOCAL QUANTITY STATE — source of truth for the displayed value.
   * item.quantity only updates after a full render cycle. localQty
   * updates synchronously on every click so rapid clicks always see
   * the correct incremented/decremented value.
   */
  const [localQty, setLocalQty] = useState<number>(Number(item.quantity));

  /**
   * DEBOUNCE REF — collapses a burst of rapid clicks into a single
   * API call. Each click resets the timer; the call fires only after
   * a 300ms pause.
   */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * PENDING FLAG — suppresses prop-sync while the user is still clicking.
   * Without this, a store optimistic-update mid-burst resets localQty.
   */
  const isPendingRef = useRef(false);

  /** Sync from prop only when no debounce timer is outstanding. */
  useEffect(() => {
    if (!isPendingRef.current) {
      setLocalQty(Number(item.quantity));
    }
  }, [item.quantity]);

  /** Cleanup: cancel outstanding debounce on unmount. */
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const scheduleUpdate = (productId: string, qty: number) => {
    isPendingRef.current = true;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      isPendingRef.current = false;
      debounceRef.current = null;
      onQuantityChange(productId, qty);
    }, 300);
  };

  const handleRemove = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    isPendingRef.current = false;
    setRemoving(true);
    setTimeout(() => onRemove(item.productId), 300);
  };

  const decrement = () => {
    if (localQty <= 1) return;
    const next = localQty - 1;
    setLocalQty(next);
    scheduleUpdate(item.productId, next);
  };

  const increment = () => {
    const next = localQty + 1;
    setLocalQty(next);
    scheduleUpdate(item.productId, next);
  };

  const lineTotal = item.price * localQty;
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
              disabled={localQty <= 1}
              aria-label="Decrease quantity"
              className="px-3 py-2 hover:bg-[#e8e8e3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MinusIcon />
            </motion.button>

            <span className="w-10 text-center font-bold text-[15px] font-[var(--font-work-sans)] text-[#1a1c19] select-none">
              {localQty}
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
              {formatCurrency(lineTotal)}
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
