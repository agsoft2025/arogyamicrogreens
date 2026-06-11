"use client";

/**
 * components/admin/orders/UpdateStatusDialog.tsx
 *
 * Modal for updating an order's status via a dropdown.
 * All non-pending statuses are selectable; current status
 * is pre-selected. Remarks are optional.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateOrderStatus } from "@/api/admin.order.api";
import type {
  AdminOrderStatus,
  UpdateOrderStatusPayload,
} from "@/types/admin.order.types";
import { ORDER_STATUS_CFG } from "@/types/admin.order.types";

/* All statuses the admin can set from the dropdown */
const SELECTABLE_STATUSES: AdminOrderStatus[] = [
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

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
  const [selectedStatus, setSelectedStatus] = useState<AdminOrderStatus>(
    currentStatus
  );
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isDirty = selectedStatus !== currentStatus;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    if (!isDirty) {
      setSubmitError("Please select a different status.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: UpdateOrderStatusPayload = {
        status: selectedStatus,
        remarks: remarks.trim(),
      };
      const res = await updateOrderStatus(orderId, payload);
      if (res.success) {
        onSuccess(res.message || `Order updated to ${ORDER_STATUS_CFG[selectedStatus].label}`);
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
    setSelectedStatus(currentStatus);
    setRemarks("");
    setSubmitError("");
    onClose();
  }

  const selectedCfg = ORDER_STATUS_CFG[selectedStatus];
  const currentCfg  = ORDER_STATUS_CFG[currentStatus];

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

              {/* Status dropdown */}
              <div>
                <label
                  htmlFor="order-status-select"
                  className="block text-[11px] font-bold tracking-widest uppercase text-[#424843] mb-2 font-[var(--font-work-sans)]"
                >
                  Order Status <span className="text-[#ba1a1a]">*</span>
                </label>

                {/* Custom styled select wrapper */}
                <div className="relative">
                  {/* Colour dot reflecting selected status */}
                  <span
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${selectedCfg.dot}`}
                  />
                  <select
                    id="order-status-select"
                    value={selectedStatus}
                    disabled={submitting}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value as AdminOrderStatus);
                      setSubmitError("");
                    }}
                    className="w-full appearance-none pl-8 pr-10 py-2.5 bg-white border border-[#e3e3dd] rounded-lg text-sm font-bold font-[var(--font-work-sans)] text-[#1a1c19] focus:outline-none focus:ring-2 focus:ring-[#386b00]/30 focus:border-[#386b00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {SELECTABLE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_CFG[s].label}
                        {s === currentStatus ? "  (current)" : ""}
                      </option>
                    ))}
                  </select>
                  {/* Chevron */}
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca8a3] pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {/* Current → New arrow */}
                {isDirty && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2.5 text-[11px] font-[var(--font-work-sans)]"
                  >
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${currentCfg.bg} ${currentCfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${currentCfg.dot}`} />
                      {currentCfg.label}
                    </span>
                    <svg className="w-3.5 h-3.5 text-[#9ca8a3] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${selectedCfg.bg} ${selectedCfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedCfg.dot}`} />
                      {selectedCfg.label}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Remarks (optional) */}
              <div>
                <label
                  htmlFor="order-remarks"
                  className="block text-[11px] font-bold tracking-widest uppercase text-[#424843] mb-1.5 font-[var(--font-work-sans)]"
                >
                  Remarks
                  <span className="ml-1 text-[#9ca8a3] normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <textarea
                  id="order-remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={submitting}
                  rows={3}
                  placeholder="e.g. Order shipped via Delhivery — tracking #DL123456"
                  className="w-full border border-[#e3e3dd] rounded-lg px-3 py-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white placeholder:text-[#b0b8b0] outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
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
                type="submit"
                form=""
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.97 } : {}}
                disabled={submitting || !isDirty}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#4a8a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
