"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createUser } from "@/api/user.api";
import type { UserRole } from "@/types/user.types";
import type { ApiError } from "@/api/axios";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
}

const EMPTY: FormValues = {
  name: "",
  email: "",
  mobileNumber: "",
  role: "user",
};

export default function AddUserDialog({ open, onClose, onSuccess }: AddUserDialogProps) {
  const [form, setForm]     = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError]     = useState("");

  /* Reset on close */
  useEffect(() => {
    if (!open) {
      setForm(EMPTY);
      setErrors({});
      setApiError("");
      setSubmitting(false);
    }
  }, [open]);

  /* ESC to close */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, submitting, onClose]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const set = useCallback(<K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, [errors]);

  function validate(): boolean {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.mobileNumber.trim()) next.mobileNumber = "Mobile number is required.";
    else if (!/^\d{10}$/.test(form.mobileNumber.trim())) next.mobileNumber = "Enter a valid 10-digit mobile number.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setApiError("");
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        mobileNumber: form.mobileNumber.trim(),
        role: form.role,
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
      };
      const res = await createUser(payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setApiError(res.message ?? "Failed to create user.");
      }
    } catch (err) {
      const apiErr = err as ApiError;
      setApiError(apiErr?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="add-user-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm"
            onClick={submitting ? undefined : onClose}
            aria-hidden="true"
          />

          <motion.div
            key="add-user-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Create User"
            className="fixed z-[401] bg-white rounded-2xl shadow-2xl border border-[#e3e3dd] w-full max-w-md mx-auto inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#f4f4ee] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#a5f95b] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#3b7100]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <h2 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]">
                  Create User
                </h2>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={submitting ? undefined : onClose}
                disabled={submitting}
                className="p-2 rounded-lg text-[#9ca8a3] hover:text-[#032616] hover:bg-[#f4f4ee] transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="px-6 py-5 space-y-4">

                {/* API Error */}
                <AnimatePresence>
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 bg-[#ffdad6] text-[#ba1a1a] text-sm font-[var(--font-work-sans)] rounded-lg px-4 py-3">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                        </svg>
                        {apiError}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name */}
                <FieldGroup label="Name" required error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Full name"
                    className={fieldClass(!!errors.name)}
                  />
                </FieldGroup>

                {/* Mobile */}
                <FieldGroup label="Mobile Number" required error={errors.mobileNumber}>
                  <input
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(e) => set("mobileNumber", e.target.value)}
                    placeholder="10-digit mobile number"
                    className={fieldClass(!!errors.mobileNumber)}
                  />
                </FieldGroup>

                {/* Email */}
                <FieldGroup label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="email@example.com (optional)"
                    className={fieldClass(!!errors.email)}
                  />
                </FieldGroup>

                {/* Role */}
                <FieldGroup label="Role">
                  <div className="relative">
                    <select
                      value={form.role}
                      onChange={(e) => set("role", e.target.value as UserRole)}
                      className={fieldClass(false) + " appearance-none pr-9"}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </FieldGroup>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-[#fafaf4] border-t border-[#f4f4ee] flex items-center justify-end gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={submitting ? undefined : onClose}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#f4f4ee] transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={!submitting ? { scale: 1.02 } : {}}
                  whileTap={!submitting ? { scale: 0.97 } : {}}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#4a8a00] transition-colors disabled:opacity-70 shadow-sm"
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
                      Creating…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Create User
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Helpers ──────────────────────────────────────────────────── */

function fieldClass(hasError: boolean) {
  return `w-full px-4 py-3 border rounded-lg text-sm text-[#1a1c19] placeholder:text-[#b0b8b0] font-[var(--font-work-sans)] bg-white focus:outline-none transition-colors ${
    hasError
      ? "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]/30"
      : "border-[#e3e3dd] focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30"
  }`;
}

function FieldGroup({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-1.5">
        {label}
        {required && <span className="text-[#ba1a1a] ml-0.5">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)] mt-1 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
