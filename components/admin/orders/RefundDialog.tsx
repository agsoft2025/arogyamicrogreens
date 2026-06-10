"use client";

/**
 * components/admin/orders/RefundDialog.tsx
 *
 * Modal for issuing a refund for a DELIVERED order.
 * Validates amount (≤ totalAmount) and requires a reason.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { refundOrder } from "@/api/admin.order.api";
import type { RefundOrderPayload } from "@/types/admin.order.types";
import { formatCurrency } from "@/lib/currency";

interface RefundDialogProps {
  open: boolean;
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function RefundDialog({
  open,
  orderId,
  orderNumber,
  totalAmount,
  onClose,
  onSuccess,
}: RefundDialogProps) {
  const [amount, setAmount] = useState<string>(String(totalAmount));
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; reason?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(): boolean {
    const e: { amount?: string; reason?: string } = {};
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      e.amount = "Enter a valid refund amount.";
    } else if (parsed > totalAmount) {
      e.amount = `Cannot exceed order total (${formatCurrency(totalAmount)}).`;
    }
    if (!reason.trim()) e.reason = "Reason is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: RefundOrderPayload = {
        amount: parseFloat(amount),
        reason: reason.trim(),
      };
      const res = await refundOrder(orderId, payload);
      if (res.success) {
        onSuccess(res.message || "Refund processed successfully.");
        handleClose();
      } else {
        setSubmitError(res.message || "Failed to process refund.");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to process refund. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (submitting) return;
    setAmount(String(totalAmount));
    setReason("");
    setErrors({});
    setSubmitError("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="refund-dialog-title"
            className="fixed z-[301] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e3dd]">
              <div>
                <h2
                  id="refund-dialog-title"
                  className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]"
                >
                  Process Refund
                </h2>
                <p className="text-[12px] text-[#727973] font-[var(--font-work-sans)] mt-0.5">
                  #{orderNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="p-2 rounded-lg text-[#727973] hover:bg-[#f4f4ee] transition-colors disabled:opacity-40"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Warning banner */}
            <div className="mx-6 mt-5 flex items-start gap-3 bg-[#fff3cd] rounded-xl px-4 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#7a4b00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              <p className="text-[12px] text-[#7a4b00] font-[var(--font-work-sans)] leading-relaxed">
                This action cannot be undone. The refund will be processed to the
                customer&apos;s original payment method.
              </p>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Order total context */}
              <div className="flex items-center justify-between bg-[#f4f4ee] rounded-xl px-4 py-3">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#9ca8a3] font-[var(--font-work-sans)]">
                  Order Total
                </span>
                <span className="text-sm font-bold text-[#032616] font-[var(--font-work-sans)]">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              {/* Refund amount */}
              <div>
                <label
                  htmlFor="refund-amount"
                  className="block text-[11px] font-bold tracking-widest uppercase text-[#424843] mb-1.5 font-[var(--font-work-sans)]"
                >
                  Refund Amount (₹) <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9ca8a3] font-[var(--font-work-sans)] select-none">
                    ₹
                  </span>
                  <input
                    id="refund-amount"
                    type="number"
                    min={0.01}
                    max={totalAmount}
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) setErrors((p) => ({ ...p, amount: undefined }));
                    }}
                    className={`w-full border rounded-lg pl-7 pr-3 py-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white outline-none transition-colors ${
                      errors.amount
                        ? "border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30"
                        : "border-[#e3e3dd] focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30"
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)]">
                    {errors.amount}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setAmount(String(totalAmount))}
                  className="mt-1.5 text-[11px] text-[#386b00] font-bold font-[var(--font-work-sans)] hover:underline"
                >
                  Use full amount ({formatCurrency(totalAmount)})
                </button>
              </div>

              {/* Reason */}
              <div>
                <label
                  htmlFor="refund-reason"
                  className="block text-[11px] font-bold tracking-widest uppercase text-[#424843] mb-1.5 font-[var(--font-work-sans)]"
                >
                  Reason <span className="text-[#ba1a1a]">*</span>
                </label>
                <textarea
                  id="refund-reason"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (errors.reason) setErrors((p) => ({ ...p, reason: undefined }));
                  }}
                  rows={3}
                  placeholder="e.g. Customer returned damaged goods"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white placeholder:text-[#b0b8b0] outline-none transition-colors resize-none ${
                    errors.reason
                      ? "border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30"
                      : "border-[#e3e3dd] focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30"
                  }`}
                />
                {errors.reason && (
                  <p className="mt-1 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)]">
                    {errors.reason}
                  </p>
                )}
              </div>

              {/* Submit error */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-[#ffdad6] text-[#ba1a1a] text-sm font-[var(--font-work-sans)] rounded-lg px-4 py-3"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                    {submitError}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e3e3dd] flex items-center justify-end gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleClose}
                disabled={submitting}
                className="px-5 py-2.5 border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#f4f4ee] transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.97 } : {}}
                disabled={submitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#ba1a1a] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#9a1515] transition-colors disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <motion.svg
                      className="w-4 h-4"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </motion.svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6 6-6" />
                    </svg>
                    Process Refund
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
