"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/animations/FadeIn";
import { formatCurrency } from "@/lib/currency";
import { useAuth } from "@/store/authStore";
import { useCart } from "@/store/cartStore";
import Link from "next/link";

type PromoState = "idle" | "loading" | "applied" | "invalid";

export default function OrderSummary() {
  const { subtotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoState, setPromoState] = useState<PromoState>("idle");
  const [discount, setDiscount] = useState(0);
  const [paying, setPaying] = useState(false);
  const { isAuthenticated, openLoginModal } = useAuth();
  const router = useRouter();

  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const shipping = 0; // FREE
  const total = subtotal - discount + tax;

  const handlePromo = () => {
    if (!promoCode.trim()) return;
    setPromoState("loading");
    setTimeout(() => {
      if (promoCode.toUpperCase() === "HARVEST15") {
        setDiscount(subtotal * 0.15);
        setPromoState("applied");
      } else {
        setPromoState("invalid");
        setTimeout(() => setPromoState("idle"), 2500);
      }
    }, 900);
  };

  const handlePay = () => {
    if (!isAuthenticated) {
      openLoginModal("/checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <FadeIn direction="right" delay={0.15}>
      <div
        className="bg-[#e8e8e3] rounded-xl p-8 border border-[#c1c8c1]/30"
        style={{ boxShadow: "0 4px 16px rgba(3,38,22,0.08)" }}
      >
        {/* Heading */}
        <h2 className="font-[var(--font-libre-caslon)] text-[28px] font-bold text-[#032616] mb-6">
          Order Summary
        </h2>

        {/* Line items */}
        <div className="space-y-4 mb-6">
          <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />

          {discount > 0 && (
            <SummaryRow
              label="Promo (HARVEST15)"
              value={"-" + formatCurrency(discount)}
              valueClass="text-[#386b00] font-bold"
            />
          )}

          <SummaryRow
            label="Est. Shipping"
            value="FREE"
            valueClass="text-[#386b00] font-medium"
          />

          <SummaryRow label="Tax" value={formatCurrency(tax)} />

          <div className="border-t border-[#c1c8c1] pt-4 flex justify-between items-end">
            <span className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
              Total
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={total}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
                className="font-[var(--font-libre-caslon)] text-[32px] font-bold text-[#032616]"
              >
                {formatCurrency(total)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Promo code */}
        <div className="mb-8">
          <label className="block font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#032616] mb-2">
            Promo Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePromo()}
              placeholder="Enter code"
              disabled={promoState === "applied"}
              className={`flex-grow bg-white border rounded-lg px-4 py-2.5 text-sm font-[var(--font-work-sans)] text-[#1a1c19] placeholder:text-[#727973] outline-none transition-colors ${
                promoState === "invalid"
                  ? "border-[#ba1a1a] focus:border-[#ba1a1a]"
                  : promoState === "applied"
                  ? "border-[#386b00]"
                  : "border-[#c1c8c1] focus:border-[#386b00]"
              } disabled:opacity-60`}
            />
            <motion.button
              whileHover={{ scale: promoState !== "applied" ? 1.04 : 1 }}
              whileTap={{ scale: promoState !== "applied" ? 0.97 : 1 }}
              onClick={handlePromo}
              disabled={promoState === "applied" || promoState === "loading"}
              className="bg-[#032616] text-white font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] px-4 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {promoState === "loading" ? (
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </motion.svg>
              ) : promoState === "applied" ? (
                "Applied ✓"
              ) : (
                "Apply"
              )}
            </motion.button>
          </div>
          <AnimatePresence>
            {promoState === "invalid" && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[#ba1a1a] text-xs font-[var(--font-work-sans)] mt-1.5"
              >
                Invalid promo code. Try HARVEST15.
              </motion.p>
            )}
            {promoState === "applied" && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[#386b00] text-xs font-[var(--font-work-sans)] mt-1.5 font-bold"
              >
                15% discount applied!
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePay}
            disabled={paying}
            className="w-full bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-4 rounded-lg shadow-lg hover:bg-[#032616] transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {paying ? (
              <>
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </motion.svg>
                Processing...
              </>
            ) : (
              <span className="flex items-center gap-2">
                Proceed to Payment
                <PaymentIcon />
              </span>
            )}
          </motion.button>

          {/* Secure badge */}
          <div className="flex items-center justify-center gap-2 text-[#424843]">
            <LockIcon />
            <span className="text-xs font-[var(--font-work-sans)]">
              Secure checkout powered by AgriNest
            </span>
          </div>
        </div>

        {/* Subscription upsell */}
        <div className="mt-8 p-4 bg-[#c6ecd1] rounded-lg border border-[#1b3c2a]/10">
          <div className="flex gap-3 items-start">
            <div className="shrink-0 text-[#2d4e3a] mt-0.5">
              <LeafIcon />
            </div>
            <p className="text-sm font-[var(--font-work-sans)] text-[#1a1c19] leading-relaxed">
              <strong className="text-[#032616]">Save 15% today!</strong>{" "}
              Switch these to a subscription and never run out of fresh greens.
            </p>
          </div>
          <Link href="/subscription">
            <motion.span
              whileHover={{ x: 2 }}
              className="block mt-3 font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#032616] underline decoration-2 underline-offset-4 decoration-[#8adb41] hover:decoration-[#032616] transition-all cursor-pointer"
            >
              Convert items to Subscription
            </motion.span>
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = "font-bold text-[#1a1c19]",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center text-sm font-[var(--font-work-sans)]">
      <span className="text-[#424843]">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-1 3-1c0 0-1-1-3-1s-3 2-3 2 1 0 2 .5C10 6 17 8 17 8z" />
    </svg>
  );
}
