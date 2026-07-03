"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  getAllPlans,
  deletePlan,
  updatePlanStatus,
  SubscriptionPlan,
} from "@/api/subscription-plan.api";

const ITEMS_PER_PAGE = 10;

const STATUS_STYLES: Record<"active" | "inactive", { bg: string; text: string; dot: string; label: string }> = {
  active:   { bg: "bg-[#d4f4a0]", text: "text-[#386b00]", dot: "bg-[#386b00]", label: "Active" },
  inactive: { bg: "bg-[#e1e4da]", text: "text-[#444841]", dot: "bg-[#9ca8a3]", label: "Inactive" },
};

export default function AdminSubscriptionPlansPage() {
  const [plans, setPlans]             = useState<SubscriptionPlan[]>([]);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">("");
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [successMsg, setSuccessMsg]   = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlan | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<Set<string>>(new Set());

  const searchMountRef = useRef(true);

  const fetchPlans = useCallback(async (page = currentPage, q = search, s = statusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllPlans({
        page,
        limit: ITEMS_PER_PAGE,
        ...(q ? { search: q } : {}),
        ...(s ? { status: s } : {}),
      });
      setPlans(result.plans);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message ?? "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    fetchPlans(currentPage, search, statusFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    if (searchMountRef.current) { searchMountRef.current = false; return; }
    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchPlans(1, search, statusFilter);
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Immediate status filter
  useEffect(() => {
    setCurrentPage(1);
    fetchPlans(1, search, statusFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleToggleStatus = useCallback(async (plan: SubscriptionPlan) => {
    if (statusUpdating.has(plan._id)) return;
    const next = plan.status === "active" ? "inactive" : "active";
    setStatusUpdating((prev) => new Set(prev).add(plan._id));
    setPlans((prev) =>
      prev.map((p) => (p._id === plan._id ? { ...p, status: next } : p))
    );
    try {
      await updatePlanStatus(plan._id, next);
    } catch {
      // Revert on failure
      setPlans((prev) =>
        prev.map((p) => (p._id === plan._id ? { ...p, status: plan.status } : p))
      );
    } finally {
      setStatusUpdating((prev) => {
        const s = new Set(prev);
        s.delete(plan._id);
        return s;
      });
    }
  }, [statusUpdating]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deletePlan(deleteTarget._id);
      setDeleteTarget(null);
      setSuccessMsg("Plan deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchPlans(currentPage, search, statusFilter);
    } catch (err: unknown) {
      const e = err as { message?: string };
      alert(e?.message ?? "Failed to delete plan");
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, currentPage, search, statusFilter, fetchPlans]);

  const pageNums: (number | null)[] = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, null, totalPages];
    if (currentPage >= totalPages - 2) return [1, null, totalPages - 2, totalPages - 1, totalPages];
    return [1, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages];
  })();

  const showingFrom = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo   = Math.min(currentPage * ITEMS_PER_PAGE, total);

  return (
    <div className="space-y-5 pb-20 md:pb-6">

      {/* Success Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 right-6 z-[500] flex items-center gap-3 bg-[#032616] text-white text-sm font-[var(--font-work-sans)] rounded-xl px-5 py-3.5 shadow-2xl"
          >
            <svg className="w-4 h-4 shrink-0 text-[#a5f95b]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m5 13 4 4L19 7" />
            </svg>
            {successMsg}
            <button onClick={() => setSuccessMsg("")} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <nav className="flex items-center gap-1.5 text-[12px] font-[var(--font-work-sans)] text-[#727973] mb-4" aria-label="Breadcrumb">
          <Link href="/admin/dashboard" className="hover:text-[#032616] transition-colors">Dashboard</Link>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
          <span className="text-[#1a1c19] font-bold">Subscription Plans</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-libre-caslon)] text-[28px] md:text-[32px] font-bold text-[#032616] leading-tight">
              Subscription Plans
            </h1>
            <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
              Manage subscription tiers shown on the pricing page.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => fetchPlans(currentPage, search, statusFilter)}
              title="Refresh"
              className="p-2.5 border border-[#e3e3dd] text-[#727973] rounded-lg hover:bg-[#f4f4ee] hover:text-[#032616] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              </svg>
            </motion.button>
            <Link href="/admin/subscription-plans/create">
              <motion.span
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-5 py-3 rounded-lg shadow-md hover:bg-[#4a8a00] transition-colors shrink-0 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
                </svg>
                Add New Plan
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca8a3] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans…"
            className="w-full pl-10 pr-4 py-3 border border-[#e3e3dd] bg-white rounded-xl text-sm font-[var(--font-work-sans)] text-[#1a1c19] placeholder:text-[#9ca8a3] outline-none focus:border-[#386b00] focus:ring-2 focus:ring-[#386b00]/10 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "" | "active" | "inactive")}
          className="border border-[#e3e3dd] bg-white rounded-xl px-4 py-3 text-sm font-[var(--font-work-sans)] text-[#1a1c19] outline-none focus:border-[#386b00] focus:ring-2 focus:ring-[#386b00]/10 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(search || statusFilter) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setSearch(""); setStatusFilter(""); }}
            className="px-4 py-3 border border-[#e3e3dd] rounded-xl text-sm font-bold font-[var(--font-work-sans)] text-[#727973] hover:bg-[#f4f4ee] hover:text-[#032616] transition-colors whitespace-nowrap"
          >
            Clear
          </motion.button>
        )}
      </motion.div>

      {/* Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        className="bg-white rounded-xl shadow-sm border border-[#e3e3dd] overflow-hidden"
      >
        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#ffdad6] flex items-center justify-center">
              <svg className="w-7 h-7 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <div>
              <p className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616] mb-1">Failed to load plans</p>
              <p className="text-sm text-[#727973] font-[var(--font-work-sans)]">{error}</p>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => fetchPlans(currentPage, search, statusFilter)}
              className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
            >
              Try Again
            </motion.button>
          </div>
        )}

        {!error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]" aria-label="Subscription plans table">
              <thead className="bg-[#f4f4ee] border-b border-[#e3e3dd]">
                <tr>
                  {["Plan", "Price", "Features", "Featured", "Status", "Order", "Actions"].map((col, i) => (
                    <th
                      key={col}
                      className={`px-6 py-4 font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#1a1c19] whitespace-nowrap ${
                        i === 3 ? "text-center" : i === 6 ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout" initial={false}>
                  {/* Skeleton rows */}
                  {loading && Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skel-${i}`} className="border-b border-[#f4f4ee] last:border-0">
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="h-3 w-16 bg-[#f0f4f0] rounded animate-pulse" />
                          <div className="h-4 w-28 bg-[#f0f4f0] rounded animate-pulse" />
                        </div>
                      </td>
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-3.5 w-14 bg-[#f0f4f0] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Empty state */}
                  {!loading && plans.length === 0 && (
                    <tr key="empty">
                      <td colSpan={7}>
                        <EmptyState hasFilters={!!(search || statusFilter)} onReset={() => { setSearch(""); setStatusFilter(""); }} />
                      </td>
                    </tr>
                  )}

                  {/* Plan rows */}
                  {!loading && plans.map((plan, i) => {
                    const statusCfg = STATUS_STYLES[plan.status];
                    return (
                      <motion.tr
                        key={plan._id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
                        transition={{ delay: i * 0.03, duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                        className="border-b border-[#f4f4ee] last:border-0 transition-colors hover:bg-[#fafaf4]"
                      >
                        {/* Plan name */}
                        <td className="px-6 py-4">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#9ca8a3] font-[var(--font-work-sans)]">
                              {plan.tier}
                            </p>
                            <p className="font-bold text-sm text-[#032616] font-[var(--font-work-sans)] mt-0.5">
                              {plan.name}
                            </p>
                            <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] truncate max-w-[200px]">
                              {plan.tagline}
                            </p>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-sm text-[#1a1c19] font-[var(--font-work-sans)] tabular-nums">
                            {plan.price}
                          </span>
                          <span className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] ml-1">
                            {plan.period}
                          </span>
                        </td>

                        {/* Features count */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#424843] font-[var(--font-work-sans)]">
                            {plan.features.length} feature{plan.features.length !== 1 ? "s" : ""}
                          </span>
                        </td>

                        {/* Featured badge */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {plan.featured ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#d4f4a0] text-[#386b00] px-2.5 py-1 rounded-full">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Yes
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#c1c8c1] font-[var(--font-work-sans)]">—</span>
                            )}
                          </div>
                        </td>

                        {/* Status toggle */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(plan)}
                            disabled={statusUpdating.has(plan._id)}
                            title={`Click to set ${plan.status === "active" ? "inactive" : "active"}`}
                            className={`inline-block text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] px-2.5 py-1 rounded-full transition-opacity ${
                              statusUpdating.has(plan._id) ? "opacity-50 cursor-wait" : "cursor-pointer hover:opacity-80"
                            } ${statusCfg.bg} ${statusCfg.text}`}
                          >
                            {statusCfg.label}
                          </button>
                        </td>

                        {/* Display order */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] tabular-nums">
                            {plan.displayOrder}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/admin/subscription-plans/${plan._id}/edit`}>
                              <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                className="p-2 text-[#9ca8a3] hover:text-[#032616] hover:bg-[#f4f4ee] rounded-lg transition-colors cursor-pointer inline-flex"
                                aria-label={`Edit ${plan.name}`}
                              >
                                <EditIcon />
                              </motion.span>
                            </Link>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteTarget(plan)}
                              aria-label={`Delete ${plan.name}`}
                              className="p-2 text-[#9ca8a3] hover:text-[#ba1a1a] hover:bg-[#ffd9d5]/30 rounded-lg transition-colors"
                            >
                              <TrashIcon />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && total > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-[#f4f4ee] bg-[#fafaf4]/60 flex-wrap gap-3">
            <span className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
              Showing{" "}
              <span className="font-bold text-[#424843]">{showingFrom}–{showingTo}</span>{" "}
              of{" "}
              <span className="font-bold text-[#424843]">{total}</span> plans
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
                <PaginationButton onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Previous page">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
                </PaginationButton>

                {pageNums.map((num, idx) =>
                  num === null ? (
                    <span key={`e-${idx}`} className="px-2 text-[#9ca8a3] text-sm select-none">…</span>
                  ) : (
                    <PaginationButton key={num} onClick={() => setCurrentPage(num)} active={currentPage === num} aria-label={`Page ${num}`}>
                      {num}
                    </PaginationButton>
                  )
                )}

                <PaginationButton onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Next page">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
                </PaginationButton>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[200]"
              onClick={() => !deleteLoading && setDeleteTarget(null)}
            />
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl p-8"
              role="alertdialog" aria-modal="true"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ffdad6]/60 flex items-center justify-center mx-auto mb-5">
                <TrashIcon className="w-7 h-7 text-[#ba1a1a]" />
              </div>
              <h2 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#1a1c19] text-center mb-2">
                Delete Plan?
              </h2>
              <p className="text-sm text-[#727973] font-[var(--font-work-sans)] text-center mb-7 leading-relaxed">
                <strong className="text-[#1a1c19]">{deleteTarget.name}</strong> will be permanently removed. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-xl border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#f4f4ee] transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-xl bg-[#ba1a1a] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#93000a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {deleteLoading ? (
                    <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </motion.svg>
                  ) : null}
                  {deleteLoading ? "Deleting…" : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sub-components ── */

function PaginationButton({
  children, onClick, active = false, disabled = false, "aria-label": ariaLabel,
}: {
  children: ReactNode; onClick: () => void; active?: boolean; disabled?: boolean; "aria-label"?: string;
}) {
  return (
    <motion.button onClick={disabled ? undefined : onClick} whileTap={disabled ? {} : { scale: 0.9 }}
      aria-label={ariaLabel} disabled={disabled}
      className={`min-w-[34px] h-[34px] px-2 rounded-lg text-[12px] font-bold font-[var(--font-work-sans)] flex items-center justify-center transition-colors ${
        active
          ? "bg-[#386b00] text-white shadow-sm"
          : disabled
          ? "border border-[#e3e3dd] text-[#c1c8c1] cursor-not-allowed"
          : "border border-[#e3e3dd] text-[#424843] hover:bg-[#f4f4ee] hover:border-[#c1c8c1] cursor-pointer"
      }`}
    >
      {children}
    </motion.button>
  );
}

function EmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#f4f4ee] flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-[#c1c8c1]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20M8 5v14M16 5v14" />
        </svg>
      </div>
      <h3 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#1a1c19] mb-2">
        {hasFilters ? "No plans found" : "No subscription plans yet"}
      </h3>
      <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] max-w-xs mb-6">
        {hasFilters ? "Try adjusting your search or filter." : "Add your first subscription plan to get started."}
      </p>
      {hasFilters ? (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onReset}
          className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
        >
          Clear Filters
        </motion.button>
      ) : (
        <Link href="/admin/subscription-plans/create">
          <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="inline-block text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#386b00] text-white px-5 py-2.5 rounded-lg hover:bg-[#4a8a00] transition-colors cursor-pointer"
          >
            Add First Plan
          </motion.span>
        </Link>
      )}
    </motion.div>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "w-4 h-4"} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
