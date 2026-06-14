"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { blockUser } from "@/api/user.api";
import type { User } from "@/types/user.types";
import type { ApiError } from "@/api/axios";

interface BlockUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BlockUserDialog({ open, user, onClose, onSuccess }: BlockUserDialogProps) {
  const [blocking, setBlocking] = useState(false);
  const [blockError, setBlockError] = useState("");

  useEffect(() => {
    if (!open) {
      setBlocking(false);
      setBlockError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !blocking) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, blocking, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleBlock() {
    if (!user) return;
    setBlockError("");
    setBlocking(true);
    try {
      const res = await blockUser(user._id);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setBlockError(res.message ?? "Failed to block user.");
      }
    } catch (err) {
      const apiErr = err as ApiError;
      setBlockError(apiErr?.message ?? "Something went wrong. Please try again.");
    } finally {
      setBlocking(false);
    }
  }

  return (
    <AnimatePresence>
      {open && user && (
        <>
          <motion.div
            key="block-user-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm"
            onClick={blocking ? undefined : onClose}
            aria-hidden="true"
          />

          <motion.div
            key="block-user-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            role="alertdialog"
            aria-modal="true"
            aria-label={`Block ${user.name}`}
            className="fixed z-[401] bg-white rounded-2xl shadow-2xl border border-[#e3e3dd] w-full max-w-md mx-auto inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2"
          >
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#fff3cd] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#b45309]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]">
                    Block User?
                  </h2>
                  <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
                    <span className="font-semibold text-[#424843]">{user.name}</span> will be blocked and will not be able to access the platform.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-[var(--font-work-sans)] bg-[#f4f4ee] text-[#727973] px-3 py-1 rounded-full">
                  {user.mobileNumber}
                </span>
                {user.email && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-[var(--font-work-sans)] bg-[#f4f4ee] text-[#727973] px-3 py-1 rounded-full truncate max-w-[200px]">
                    {user.email}
                  </span>
                )}
              </div>
            </div>

            <AnimatePresence>
              {blockError && (
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
                    {blockError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="px-6 pb-6 flex items-center justify-end gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={blocking ? undefined : onClose}
                disabled={blocking}
                className="px-5 py-2.5 border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#f4f4ee] transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>

              <motion.button
                type="button"
                whileHover={!blocking ? { scale: 1.02 } : {}}
                whileTap={!blocking ? { scale: 0.97 } : {}}
                onClick={handleBlock}
                disabled={blocking}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#b45309] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#92400e] transition-colors disabled:opacity-70 shadow-sm"
              >
                {blocking ? (
                  <>
                    <motion.svg
                      className="w-4 h-4"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </motion.svg>
                    Blocking…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
                    </svg>
                    Block User
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
