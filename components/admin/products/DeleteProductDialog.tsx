"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteProduct } from "@/api/product.api";
import type { Product } from "@/types/product.types";
import type { ApiError } from "@/api/axios";

interface DeleteProductDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteProductDialog({
  open,
  product,
  onClose,
  onSuccess,
}: DeleteProductDialogProps) {
  const [deleting, setDeleting]   = useState(false);
  const [deleteError, setDeleteError] = useState("");

  /* Reset state when dialog opens/closes */
  useEffect(() => {
    if (!open) {
      setDeleting(false);
      setDeleteError("");
    }
  }, [open]);

  /* ESC to close */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deleting) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, deleting, onClose]);

  /* Prevent body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleDelete() {
    if (!product) return;
    setDeleteError("");
    setDeleting(true);
    try {
      const res = await deleteProduct(product._id);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setDeleteError(res.message ?? "Failed to delete product.");
      }
    } catch (err) {
      const apiErr = err as ApiError;
      setDeleteError(apiErr?.message ?? "Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="delete-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm"
            onClick={deleting ? undefined : onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="delete-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            role="alertdialog"
            aria-modal="true"
            aria-label={`Delete ${product.name}`}
            className="fixed z-[401] bg-white rounded-2xl shadow-2xl border border-[#e3e3dd] w-full max-w-md mx-auto inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2"
          >
            {/* Warning icon + header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]">
                    Delete Product?
                  </h2>
                  <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
                    <span className="font-semibold text-[#424843]">{product.name}</span> will be permanently removed. This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Product meta pill */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-[var(--font-work-sans)] bg-[#f4f4ee] text-[#727973] px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  SKU: {product.sku}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-[var(--font-work-sans)] bg-[#ffdad6]/60 text-[#ba1a1a] px-3 py-1 rounded-full">
                  Permanent
                </span>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {deleteError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-6 overflow-hidden"
                >
                  <div className="flex items-center gap-2 bg-[#ffdad6] text-[#ba1a1a] text-sm font-[var(--font-work-sans)] rounded-lg px-4 py-3 mb-4">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                    {deleteError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="px-6 pb-6 flex items-center justify-end gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={deleting ? undefined : onClose}
                disabled={deleting}
                className="px-5 py-2.5 border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#f4f4ee] transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>

              <motion.button
                type="button"
                whileHover={!deleting ? { scale: 1.02 } : {}}
                whileTap={!deleting ? { scale: 0.97 } : {}}
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#ba1a1a] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#d32f2f] transition-colors disabled:opacity-70 shadow-sm"
              >
                {deleting ? (
                  <>
                    <motion.svg
                      className="w-4 h-4"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </motion.svg>
                    Deleting…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                    Delete Product
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
