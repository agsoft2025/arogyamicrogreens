"use client";

/**
 * components/admin/orders/RefundDialog.tsx
 *
 * Modal for issuing a full or partial refund for a DELIVERED order.
 *
 * Flow:
 *   1. Admin enters refund amount (defaults to full order total).
 *   2. On confirm → POST /admin/orders/refund/:id { refundAmount }.
 *   3. Success state shows Refund ID + refunded amount before dismiss.
 *   4. onSuccess callback fired so parent can refresh + show toast.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { refundOrder } from "@/api/admin.order.api";
import type { RefundResult } from "@/types/admin.order.types";
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
  const [amountError, setAmountError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  /** After a successful refund, show the confirmation state. */
  const [refundResult, setRefundResult] = useState<RefundResult | null>(null);

  function validate(): boolean {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setAmountError("Enter a valid refund amount.");
      return false;
    }
    if (parsed > totalAmount) {
      setAmountError(`Cannot exceed order total (${formatCurrency(totalAmount)}).`);
      return false;
    }
    setAmountError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await refundOrder(orderId, { refundAmount: parseFloat(amount) });
      if (res.success) {
        const result: RefundResult = res.refund ?? {
          refundId: undefined,
          refundedAmount: parseFloat(amount),
        };
        setRefundResult(result);
        onSuccess(res.message || "Refund processed successfully.");
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
    // Reset all state for next open
    setAmount(String(totalAmount));
    setAmountError("");
    setSubmitError("");
    setRefundResult(null);
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
                  {refundResult ? "Refund Processed" : "Process Refund"}
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

            {/* ── Success state ── */}
            {refundResult ? (
              <>
                <div className="px-6 py-6 space-y-5">
                  {/* Success icon */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#d4f4a0] flex items-center justify-center">
                      <svg className="w-7 h-7 text-[#3b7100]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
                      The refund has been submitted successfully.
                    </p>
                  </div>

                  {/* Refund details */}
                  <div className="bg-[#f4f4ee] rounded-xl divide-y divide-[#e3e3dd]">
                    {refundResult.refundId && (
                      <div className="flex items-center justify-between px-4 py-3 text-[12px] font-[var(--font-work-sans)]">
                        <span className="text-[#727973]">Refund ID</span>
                        <span className="font-bold text-[#032616] font-mono text-[11px] break-all text-right max-w-[180px]">
                          {refundResult.refundId}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-4 py-3 text-[12px] font-[var(--font-work-sans)]">
                      <span className="text-[#727973]">Refunded Amount</span>
                      <span className="font-bold text-[#386b00]">
                        {formatCurrency(refundResult.refundedAmount ?? parseFloat(amount))}
                      </span>
                    </div>
                    {refundResult.refundStatus && (
                      <div className="flex items-center justify-between px-4 py-3 text-[12px] font-[var(--font-work-sans)]">
                        <span className="text-[#727973]">Status</span>
                        <span className="font-bold text-[#424843]">
                          {refundResult.refundStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#e3e3dd]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClose}
                    className="w-full py-2.5 bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#386b00] transition-colors"
                  >
                    Done
                  </motion.button>
                </div>
              </>
            ) : (
              /* ── Input state ── */
              <>
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
                          if (amountError) setAmountError("");
                        }}
                        className={`w-full border rounded-lg pl-7 pr-3 py-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white outline-none transition-colors ${
                          amountError
                            ? "border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30"
                            : "border-[#e3e3dd] focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30"
                        }`}
                      />
                    </div>
                    {amountError && (
                      <p className="mt-1 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)]">
                        {amountError}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => { setAmount(String(totalAmount)); setAmountError(""); }}
                      className="mt-1.5 text-[11px] text-[#386b00] font-bold font-[var(--font-work-sans)] hover:underline"
                    >
                      Use full amount ({formatCurrency(totalAmount)})
                    </button>
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
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
