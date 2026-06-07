"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import { formatCurrency } from "@/lib/currency";

export interface SummaryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface CheckoutSummaryProps {
  items: SummaryItem[];
  shippingCost: number;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

type PromoState = "idle" | "loading" | "applied" | "invalid";

const TAX_RATE = 0.05;

export default function CheckoutSummary({
  items,
  shippingCost,
  onPlaceOrder,
  isProcessing,
}: CheckoutSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoState, setPromoState] = useState<PromoState>("idle");
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = parseFloat(((subtotal - discount + shippingCost) * TAX_RATE).toFixed(2));
  const total = subtotal - discount + shippingCost + tax;

  const handlePromo = () => {
    if (!promoCode.trim() || promoState === "applied") return;
    setPromoState("loading");
    setTimeout(() => {
      if (promoCode.toUpperCase() === "HARVEST10") {
        setDiscount(subtotal * 0.1);
        setPromoState("applied");
      } else {
        setPromoState("invalid");
        setTimeout(() => setPromoState("idle"), 2500);
      }
    }, 800);
  };

  return (
    <FadeIn direction="right" delay={0.12}>
      <div
        className="bg-[#e8e8e3] rounded-xl p-6 border border-[#c1c8c1]/30 sticky top-[88px]"
        style={{ boxShadow: "0 4px 16px rgba(3,38,22,0.08)" }}
      >
        {/* Heading */}
        <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] mb-6">
          Order Summary
        </h2>

        {/* Product list */}
        <div className="flex flex-col gap-4 pb-6 mb-6 border-b border-[#c1c8c1]">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#e1e4da] shrink-0">
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <p className="font-bold text-sm font-[var(--font-work-sans)] text-[#1a1c19] leading-tight truncate">
                  {item.name}
                </p>
                <p className="text-xs text-[#424843] font-[var(--font-work-sans)] mt-0.5">
                  Quantity: {item.quantity}
                </p>
                <p className="font-bold text-sm text-[#386b00] font-[var(--font-work-sans)] mt-1">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="flex flex-col gap-3 mb-6">
          <PriceRow label="Subtotal" value={formatCurrency(subtotal)} />

          {discount > 0 && (
            <PriceRow
              label="Promo Discount"
              value={"-" + formatCurrency(discount)}
              valueClass="text-[#386b00] font-bold"
            />
          )}

          <PriceRow
            label="Shipping"
            value={shippingCost === 0 ? "FREE" : formatCurrency(shippingCost)}
            valueClass={shippingCost === 0 ? "text-[#386b00]" : "text-[#1a1c19]"}
          />

          <PriceRow label={`Tax (${TAX_RATE * 100}%)`} value={formatCurrency(tax)} />

          <div className="flex justify-between items-center pt-4 border-t border-[#c1c8c1]">
            <span className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
              Total
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={total}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]"
              >
                {formatCurrency(total)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Promo code */}
        <div className="relative mb-6">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePromo()}
            placeholder="Promo Code"
            disabled={promoState === "applied"}
            className={`w-full border rounded-lg px-4 py-3 pr-24 bg-white text-sm font-[var(--font-work-sans)] text-[#1a1c19] placeholder:text-[#727973] outline-none transition-colors ${
              promoState === "invalid"
                ? "border-[#ba1a1a]"
                : promoState === "applied"
                ? "border-[#386b00]"
                : "border-[#c1c8c1] focus:border-[#032616]"
            } disabled:opacity-60`}
          />
          <motion.button
            whileHover={{ scale: promoState !== "applied" ? 1.03 : 1 }}
            whileTap={{ scale: promoState !== "applied" ? 0.97 : 1 }}
            onClick={handlePromo}
            disabled={promoState === "applied" || promoState === "loading"}
            className="absolute right-2 top-2 bg-[#032616] text-white font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] px-3 py-1.5 rounded-md hover:bg-[#386b00] transition-colors disabled:opacity-60"
          >
            {promoState === "loading" ? (
              <motion.svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </motion.svg>
            ) : promoState === "applied" ? (
              "✓"
            ) : (
              "Apply"
            )}
          </motion.button>
          <AnimatePresence>
            {promoState === "invalid" && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[#ba1a1a] text-xs font-[var(--font-work-sans)] mt-1.5"
              >
                Invalid code. Try HARVEST10.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* CTA button */}
        <motion.button
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.97 }}
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="w-full bg-[#386b00] text-white font-[var(--font-libre-caslon)] text-xl font-bold py-4 rounded-xl shadow-lg hover:bg-[#032616] transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
        >
          {isProcessing ? (
            <>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </motion.svg>
              Processing…
            </>
          ) : (
            <>
              <LockFilledIcon />
              Securely Pay &amp; Place Order
            </>
          )}
        </motion.button>

        {/* SSL badge */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[#424843]">
          <ShieldIcon />
          <p className="text-xs font-[var(--font-work-sans)] text-center">
            SSL Secured Payment. 100% Satisfaction Guarantee.
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

function PriceRow({
  label,
  value,
  valueClass = "font-bold text-[#1a1c19]",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between text-sm font-[var(--font-work-sans)]">
      <span className="text-[#424843]">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

function LockFilledIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
