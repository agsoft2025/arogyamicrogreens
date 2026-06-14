"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserById, updateUser } from "@/api/user.api";
import type { User, UserRole, UserStatus } from "@/types/user.types";
import type { ApiError } from "@/api/axios";

interface EditUserDialogProps {
  open: boolean;
  userId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  status: UserStatus;
  isMobileVerified: boolean;
}

function userToForm(u: User): FormValues {
  return {
    name: u.name,
    email: u.email ?? "",
    mobileNumber: u.mobileNumber,
    role: u.role,
    status: u.status,
    isMobileVerified: u.isMobileVerified,
  };
}

export default function EditUserDialog({ open, userId, onClose, onSuccess }: EditUserDialogProps) {
  const [form, setForm]           = useState<FormValues | null>(null);
  const [errors, setErrors]       = useState<Partial<Record<keyof FormValues, string>>>({});
  const [loading, setLoading]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError]   = useState("");
  const [fetchError, setFetchError] = useState("");

  /* Fetch user when dialog opens */
  useEffect(() => {
    if (!open || !userId) return;

    setForm(null);
    setErrors({});
    setApiError("");
    setFetchError("");
    setLoading(true);

    getUserById(userId)
      .then((res) => {
        if (res.success && res.data) {
          setForm(userToForm(res.data));
        } else {
          setFetchError(res.message ?? "Failed to load user details.");
        }
      })
      .catch((err: ApiError) => {
        setFetchError(err?.message ?? "Failed to load user details.");
      })
      .finally(() => setLoading(false));
  }, [open, userId]);

  /* Reset on close */
  useEffect(() => {
    if (!open) {
      setForm(null);
      setErrors({});
      setApiError("");
      setFetchError("");
      setSubmitting(false);
      setLoading(false);
    }
  }, [open]);

  /* ESC to close */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting && !loading) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, submitting, loading, onClose]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const set = useCallback(<K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setForm((prev) => prev ? { ...prev, [key]: value } : null);
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, [errors]);

  function validate(): boolean {
    if (!form) return false;
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
    if (!form || !userId) return;
    if (!validate()) return;

    setApiError("");
    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        mobileNumber: form.mobileNumber.trim(),
        role: form.role,
        status: form.status,
        isMobileVerified: form.isMobileVerified,
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
      };
      const res = await updateUser(userId, payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setApiError(res.message ?? "Failed to update user.");
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
            key="edit-user-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm"
            onClick={(submitting || loading) ? undefined : onClose}
            aria-hidden="true"
          />

          <motion.div
            key="edit-user-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Edit User"
            className="fixed z-[401] bg-white rounded-2xl shadow-2xl border border-[#e3e3dd] w-full max-w-md mx-auto inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#f4f4ee] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#e1e4da] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#444841]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                  </svg>
                </div>
                <h2 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]">
                  Edit User
                </h2>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={(submitting || loading) ? undefined : onClose}
                disabled={submitting || loading}
                className="p-2 rounded-lg text-[#9ca8a3] hover:text-[#032616] hover:bg-[#f4f4ee] transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Body */}
            {loading ? (
              <div className="px-6 py-12 flex flex-col items-center gap-3">
                <motion.svg
                  className="w-8 h-8 text-[#386b00]"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </motion.svg>
                <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)]">Loading user details…</p>
              </div>
            ) : fetchError ? (
              <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
                <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <p className="text-sm text-[#ba1a1a] font-[var(--font-work-sans)]">{fetchError}</p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843] px-4 py-2 rounded-lg border border-[#e3e3dd] hover:bg-[#f4f4ee] transition-colors"
                >
                  Close
                </motion.button>
              </div>
            ) : form ? (
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

                  {/* Role + Status */}
                  <div className="grid grid-cols-2 gap-3">
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
                        <ChevronDown />
                      </div>
                    </FieldGroup>

                    <FieldGroup label="Status">
                      <div className="relative">
                        <select
                          value={form.status}
                          onChange={(e) => set("status", e.target.value as UserStatus)}
                          className={fieldClass(false) + " appearance-none pr-9"}
                        >
                          <option value="active">Active</option>
                          <option value="blocked">Blocked</option>
                          <option value="suspended">Suspended</option>
                          <option value="deleted">Deleted</option>
                        </select>
                        <ChevronDown />
                      </div>
                    </FieldGroup>
                  </div>

                  {/* Mobile Verified toggle */}
                  <div className="flex items-center justify-between py-2 px-4 rounded-lg border border-[#e3e3dd] bg-[#fafaf4]">
                    <span className="text-[12px] font-bold text-[#424843] font-[var(--font-work-sans)]">
                      Mobile Verified
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.isMobileVerified}
                      onClick={() => set("isMobileVerified", !form.isMobileVerified)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none cursor-pointer ${
                        form.isMobileVerified ? "bg-[#386b00]" : "bg-[#c1c8c1]/60"
                      }`}
                    >
                      <motion.span
                        className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm"
                        animate={{ x: form.isMobileVerified ? 22 : 3 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
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
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#386b00] transition-colors disabled:opacity-70 shadow-sm"
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
                        Saving…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : null}
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

function ChevronDown() {
  return (
    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
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
