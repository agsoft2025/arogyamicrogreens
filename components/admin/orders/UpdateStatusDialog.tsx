"use client";

/**
 * components/admin/orders/UpdateStatusDialog.tsx
 *
 * Modal for updating an order's status.
 * Enforces valid status transitions and requires a remark.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateOrderStatus } from "@/api/admin.order.api";
import type {
  AdminOrderStatus,
  UpdateOrderStatusPayload,
} from "@/types/admin.order.types";
import {
  ORDER_STATUS_TRANSITIONS,
  ORDER_STATUS_CFG,
} from "@/types/admin.order.types";

interface UpdateStatusDialogProps {
  open: boolean;
  orderId: string;
  orderNumber: string;
  currentStatus: AdminOrderStatus;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function UpdateStatusDialog({
  open,
  orderId,
  orderNumber,
  currentStatus,
  onClose,
  onSuccess,
}: UpdateStatusDialogProps) {
  const allowedNext = ORDER_STATUS_TRANSITIONS[currentStatus] ?? [];

  const [selectedStatus, setSelectedStatus] = useState<AdminOrderStatus | "">(
    allowedNext[0] ?? ""
  );
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<{ status?: string; remarks?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(): boolean {
    const e: { status?: string; remarks?: string } = {};
    if (!selectedStatus) e.status = "Please select a status.";
    if (!remarks.trim()) e.remarks = "Remarks are required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: UpdateOrderStatusPayload = {
        status: selectedStatus as AdminOrderStatus,
        remarks: remarks.trim(),
      };
      const res = await updateOrderStatus(orderId, payload);
      if (res.success) {
        onSuccess(res.message || `Order updated to ${selectedStatus}`);
        handleClose();
      } else {
        setSubmitError(res.message || "Failed to update order status.");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to update order status. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (submitting) return;
    setSelectedStatus(allowedNext[0] ?? "");
    setRemarks("");
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
            aria-labelledby="update-status-title"
            className="fixed z-[301] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e3dd]">
              <div>
                <h2
                  id="update-status-title"
                  className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]"
                >
                  Update Order Status
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

            {/* Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Current status */}
              <div className="flex items-center gap-2 text-sm text-[#424843] font-[var(--font-work-sans)]">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#9ca8a3]">
                  Current:
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${ORDER_STATUS_CFG[currentStatus].bg} ${ORDER_STATUS_CFG[currentStatus].text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${ORDER_STATUS_CFG[currentStatus].dot}`} />
                  {ORDER_STATUS_CFG[currentStatus].label}
                </span>
              </div>

              {allowedNext.length === 0 ? (
                <div className="bg-[#f4f4ee] rounded-xl px-4 py-4 text-sm text-[#727973] font-[var(--font-work-sans)] text-center">
                  This order is in a terminal state and cannot be updated further.
                </div>
              ) : (
                <>
                  {/* New status selector */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-[#424843] mb-2 font-[var(--font-work-sans)]">
                      New Status <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allowedNext.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(s);
                            if (errors.status) setErrors((p) => ({ ...p, status: undefined }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold font-[var(--font-work-sans)] border-2 transition-colors ${
                            selectedStatus === s
                              ? `${ORDER_STATUS_CFG[s].bg} ${ORDER_STATUS_CFG[s].text} border-current`
                              : "bg-white text-[#424843] border-[#e3e3dd] hover:border-[#9ca8a3]"
                          }`}
                        >
                          {ORDER_STATUS_CFG[s].label}
                        </button>
                      ))}
                    </div>
                    {errors.status && (
                      <p className="mt-1 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)]">
                        {errors.status}
                      </p>
                    )}
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-[#424843] mb-1.5 font-[var(--font-work-sans)]">
                      Remarks <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => {
                        setRemarks(e.target.value);
                        if (errors.remarks) setErrors((p) => ({ ...p, remarks: undefined }));
                      }}
                      rows={3}
                      placeholder="e.g. Order verified and confirmed"
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white placeholder:text-[#b0b8b0] outline-none transition-colors resize-none ${
                        errors.remarks
                          ? "border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30"
                          : "border-[#e3e3dd] focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30"
                      }`}
                    />
                    {errors.remarks && (
                      <p className="mt-1 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)]">
                        {errors.remarks}
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
                </>
              )}
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

              {allowedNext.length > 0 && (
                <motion.button
                  type="submit"
                  form=""
                  whileHover={!submitting ? { scale: 1.02 } : {}}
                  whileTap={!submitting ? { scale: 0.97 } : {}}
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#4a8a00] transition-colors disabled:opacity-70"
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
                      Updating…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Update Status
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
