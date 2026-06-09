"use client";

import { useState, useMemo, useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUsers } from "@/hooks/useUsers";
import AddUserDialog from "@/components/admin/users/AddUserDialog";
import EditUserDialog from "@/components/admin/users/EditUserDialog";
import BlockUserDialog from "@/components/admin/users/BlockUserDialog";
import DeleteUserDialog from "@/components/admin/users/DeleteUserDialog";
import type { User, UserStatus } from "@/types/user.types";

/* ── Status config ───────────────────────────────────────────── */
const STATUS_CFG: Record<UserStatus, { label: string; dot: string; text: string; bg: string }> = {
  active:    { label: "Active",    dot: "bg-[#386b00]", text: "text-[#386b00]", bg: "bg-[#d4f4a0]"    },
  blocked:   { label: "Blocked",   dot: "bg-[#b45309]", text: "text-[#b45309]", bg: "bg-[#fff3cd]"    },
  deleted:   { label: "Deleted",   dot: "bg-[#ba1a1a]", text: "text-[#ba1a1a]", bg: "bg-[#ffdad6]"    },
  suspended: { label: "Suspended", dot: "bg-[#727973]", text: "text-[#727973]", bg: "bg-[#e3e3dd]"    },
};

/* ── Helpers ─────────────────────────────────────────────────── */
function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_PALETTE = [
  { bg: "#386b00", text: "#ffffff" },
  { bg: "#1b3c2a", text: "#aacfb6" },
  { bg: "#a5f95b", text: "#3b7100" },
  { bg: "#e1e4da", text: "#444841" },
  { bg: "#c6ecd1", text: "#032616" },
  { bg: "#ffdad6", text: "#ba1a1a" },
];

function avatarColors(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

/* ── Page ────────────────────────────────────────────────────── */
export default function AdminUsersPage() {
  /* Search / filter state (local — debounced into API params) */
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Dialog state */
  const [addOpen, setAddOpen]           = useState(false);
  const [editUserId, setEditUserId]     = useState<string | null>(null);
  const [blockTarget, setBlockTarget]   = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  /* Portal action-menu anchor: tracks which row's menu is open + its screen coords */
  const [menuAnchor, setMenuAnchor] = useState<{
    id: string;
    top: number;
    right: number;
  } | null>(null);

  /* Success toast */
  const [successMsg, setSuccessMsg] = useState("");

  const showSuccess = useCallback((msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  }, []);

  /* API hook */
  const { users, pagination, loading, error, refetch, setParams, params } = useUsers({
    page: 1,
    limit: 10,
  });

  /* Skip-first-run guard — reset on cleanup so React Strict Mode remount also skips */
  const filterMountRef = useRef(true);

  /* Debounce search/filter changes into API params */
  useEffect(() => {
    if (filterMountRef.current) {
      filterMountRef.current = false;
      return () => { filterMountRef.current = true; };
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next: Record<string, string | number | undefined> = { page: 1 };
      if (searchInput.trim()) {
        // Try to detect if search is mobile (all digits) vs name/email
        const trimmed = searchInput.trim();
        if (/^\d+$/.test(trimmed)) {
          next.mobile = trimmed;
        } else if (trimmed.includes("@")) {
          next.email = trimmed;
        } else {
          next.name = trimmed;
        }
      }
      if (statusFilter) next.status = statusFilter;
      setParams({
        page: 1,
        limit: params.limit,
        name: undefined,
        mobile: undefined,
        email: undefined,
        status: undefined,
        ...next,
      } as Parameters<typeof setParams>[0]);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, statusFilter]);

  /* Close portal menu on outside click, scroll, resize, or ESC */
  useEffect(() => {
    if (!menuAnchor) return;
    function close() { setMenuAnchor(null); }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setMenuAnchor(null); }
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll",   close, true);
    window.addEventListener("resize",   close);
    window.addEventListener("keydown",  onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll",  close, true);
      window.removeEventListener("resize",  close);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuAnchor]);

  /* Pagination */
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = params.page ?? 1;

  const pageWindow = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const near = Math.max(1, Math.min(currentPage - 1, totalPages - 3));
    const nums: (number | null)[] = [near, near + 1, near + 2];
    if (near + 2 < totalPages) { nums.push(null); nums.push(totalPages); }
    return nums;
  }, [totalPages, currentPage]);

  const goToPage = useCallback((p: number) => {
    setParams({ page: p });
  }, [setParams]);

  /* Handlers */
  const handleAddSuccess    = useCallback(() => { refetch(); showSuccess("User created successfully!"); }, [refetch, showSuccess]);
  const handleEditSuccess   = useCallback(() => { refetch(); showSuccess("User updated successfully!"); }, [refetch, showSuccess]);
  const handleBlockSuccess  = useCallback(() => { refetch(); showSuccess("User blocked successfully!"); }, [refetch, showSuccess]);
  const handleDeleteSuccess = useCallback(() => { refetch(); showSuccess("User deleted successfully!"); }, [refetch, showSuccess]);

  const resetFilters = useCallback(() => {
    setSearchInput("");
    setStatusFilter("");
    setParams({ page: 1, limit: 10, name: undefined, mobile: undefined, email: undefined, status: undefined });
  }, [setParams]);

  const showFrom = pagination ? (currentPage - 1) * (params.limit ?? 10) + 1 : 0;
  const showTo   = pagination ? Math.min(currentPage * (params.limit ?? 10), pagination.total) : 0;

  return (
    <>
      <div className="space-y-5 pb-20 md:pb-6">

        {/* ── Success Toast ── */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              key="success-toast"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] bg-[#032616] text-white text-sm font-bold font-[var(--font-work-sans)] px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 whitespace-nowrap"
            >
              <svg className="w-4 h-4 text-[#a5f95b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="font-[var(--font-libre-caslon)] text-[28px] md:text-[36px] font-bold text-[#032616] leading-tight">
              User Management
            </h1>
            {pagination && (
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#386b00]">
                    Total Users
                  </span>
                  <span className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
                    {pagination.total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <motion.button
            onClick={() => setAddOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-5 py-3 rounded-lg shadow-sm hover:bg-[#4a8a00] transition-colors shrink-0"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Add User
          </motion.button>
        </motion.div>

        {/* ── Filter Bar ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white rounded-xl p-5 border border-[#e3e3dd] shadow-sm"
          aria-label="User filters"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca8a3] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, or mobile…"
                className="w-full pl-11 pr-4 py-3 border border-[#e3e3dd] rounded-lg text-sm text-[#1a1c19] placeholder:text-[#b0b8b0] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as UserStatus | "")}
                  className="appearance-none bg-white border border-[#e3e3dd] rounded-lg pl-4 pr-9 py-3 text-sm text-[#1a1c19] font-[var(--font-work-sans)] focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors cursor-pointer min-w-[140px]"
                >
                  <option value="">Status: All</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="suspended">Suspended</option>
                  <option value="deleted">Deleted</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {/* Clear */}
              {(searchInput || statusFilter) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={resetFilters}
                  whileTap={{ scale: 0.95 }}
                  className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843] px-4 py-3 rounded-lg border border-[#e3e3dd] hover:bg-[#f4f4ee] transition-colors"
                >
                  Clear
                </motion.button>
              )}
            </div>
          </div>
        </motion.section>

        {/* ── Table Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]" aria-label="Users table">
              <thead className="border-b border-[#f4f4ee] bg-[#fafaf4]/60">
                <tr>
                  {["User", "Mobile", "Role", "Verified", "Status", "Created", "Actions"].map((col, i) => (
                    <th
                      key={col + i}
                      className={`px-6 py-4 text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#727973] ${
                        i === 6 ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Loading skeletons */}
                {loading && (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skel-${i}`} className="border-b border-[#f4f4ee] last:border-0 animate-pulse">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e8ede8] shrink-0" />
                          <div className="space-y-2">
                            <div className="h-3 w-28 bg-[#e8ede8] rounded" />
                            <div className="h-2.5 w-36 bg-[#e8ede8] rounded" />
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-5">
                          <div className="h-3 w-20 bg-[#e8ede8] rounded" />
                        </td>
                      ))}
                      <td className="px-6 py-5">
                        <div className="h-3 w-16 bg-[#e8ede8] rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                )}

                {/* Error state */}
                {!loading && error && (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                          </svg>
                        </div>
                        <p className="text-sm text-[#ba1a1a] font-[var(--font-work-sans)]">{error}</p>
                        <motion.button
                          onClick={refetch}
                          whileTap={{ scale: 0.97 }}
                          className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
                        >
                          Retry
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Empty state */}
                {!loading && !error && users.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#f4f4ee] flex items-center justify-center mb-4">
                          <svg className="w-7 h-7 text-[#c1c8c1]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <h3 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#1a1c19] mb-2">
                          {(searchInput || statusFilter) ? "No users found" : "No users yet"}
                        </h3>
                        <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] max-w-xs mb-5">
                          {(searchInput || statusFilter) ? "Try adjusting your search or filter criteria." : "Users will appear here once they register."}
                        </p>
                        {(searchInput || statusFilter) && (
                          <motion.button
                            onClick={resetFilters}
                            whileTap={{ scale: 0.97 }}
                            className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
                          >
                            Clear Filters
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Rows */}
                {!loading && !error && (
                  <AnimatePresence mode="wait" initial={false}>
                    {users.map((user, i) => {
                      const pal = avatarColors(user.name);
                      const statusCfg = STATUS_CFG[user.status];
                      return (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                          className="border-b border-[#f4f4ee] last:border-0 hover:bg-[#fafaf4] transition-colors"
                        >
                          {/* User */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[11px] font-[var(--font-work-sans)] shrink-0 ring-2 ring-[#e3e3dd]"
                                style={{ background: pal.bg, color: pal.text }}
                              >
                                {getInitials(user.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-[#032616] font-[var(--font-work-sans)] truncate">
                                  {user.name}
                                </p>
                                <p className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)] truncate">
                                  {user.email ?? "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Mobile */}
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#424843] font-[var(--font-work-sans)] whitespace-nowrap tabular-nums">
                              {user.mobileNumber}
                            </span>
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold font-[var(--font-work-sans)] ${
                              user.role === "admin"
                                ? "bg-[#032616] text-white"
                                : "bg-[#e1e4da] text-[#444841]"
                            }`}>
                              {user.role === "admin" ? "Admin" : "User"}
                            </span>
                          </td>

                          {/* Verified */}
                          <td className="px-6 py-4">
                            {user.isMobileVerified ? (
                              <div className="flex items-center gap-1.5 text-[#386b00]">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                                </svg>
                                <span className="text-[12px] font-bold font-[var(--font-work-sans)]">Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[#9ca8a3]">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                                </svg>
                                <span className="text-[12px] font-[var(--font-work-sans)]">Not Verified</span>
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <div className={`flex items-center gap-1.5 ${statusCfg.text}`}>
                              <span className={`w-2 h-2 rounded-full shrink-0 ${statusCfg.dot}`} />
                              <span className="font-bold text-[12px] font-[var(--font-work-sans)]">
                                {statusCfg.label}
                              </span>
                            </div>
                          </td>

                          {/* Created */}
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#727973] font-[var(--font-work-sans)] whitespace-nowrap">
                              {formatDate(user.createdAt)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              {/* Edit */}
                              <motion.button
                                type="button"
                                onClick={() => setEditUserId(user._id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg text-[#424843] hover:bg-[#f4f4ee] hover:text-[#032616] transition-colors"
                                aria-label={`Edit ${user.name}`}
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                                </svg>
                              </motion.button>

                              {/* More options — triggers portal menu */}
                              <motion.button
                                type="button"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (menuAnchor?.id === user._id) {
                                    setMenuAnchor(null);
                                    return;
                                  }
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setMenuAnchor({
                                    id: user._id,
                                    top: rect.bottom + 4,
                                    right: window.innerWidth - rect.right,
                                  });
                                }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg text-[#9ca8a3] hover:text-[#424843] hover:bg-[#f4f4ee] transition-colors"
                                aria-label="More options"
                                aria-haspopup="menu"
                                aria-expanded={menuAnchor?.id === user._id}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                                </svg>
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && !error && pagination && pagination.total > 0 && (
            <div className="px-6 py-4 border-t border-[#f4f4ee] bg-[#fafaf4]/60 flex items-center justify-between flex-wrap gap-3">
              <span className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                Showing{" "}
                <span className="font-bold text-[#424843]">{showFrom} to {showTo}</span>
                {" "}of{" "}
                <span className="font-bold text-[#424843]">{pagination.total}</span> users
              </span>
              <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
                <PageBtn
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </PageBtn>

                {pageWindow.map((num, idx) =>
                  num === null ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-[#9ca8a3] text-sm select-none">…</span>
                  ) : (
                    <PageBtn
                      key={num}
                      onClick={() => goToPage(num)}
                      active={currentPage === num}
                      aria-label={`Page ${num}`}
                    >
                      {num}
                    </PageBtn>
                  )
                )}

                <PageBtn
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </PageBtn>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Portal action menu ── */}
      <PortalActionMenu
        anchor={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        users={users}
        onEdit={(id) => { setEditUserId(id); setMenuAnchor(null); }}
        onBlock={(user) => { setBlockTarget(user); setMenuAnchor(null); }}
        onDelete={(user) => { setDeleteTarget(user); setMenuAnchor(null); }}
      />

      {/* ── Dialogs ── */}
      <AddUserDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditUserDialog
        open={editUserId !== null}
        userId={editUserId}
        onClose={() => setEditUserId(null)}
        onSuccess={handleEditSuccess}
      />

      <BlockUserDialog
        open={blockTarget !== null}
        user={blockTarget}
        onClose={() => setBlockTarget(null)}
        onSuccess={handleBlockSuccess}
      />

      <DeleteUserDialog
        open={deleteTarget !== null}
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}

/* ── PortalActionMenu ────────────────────────────────────────── */
/**
 * Renders the row action dropdown via a React portal directly on document.body.
 * This escapes the table's overflow/scroll context so the menu is never clipped,
 * regardless of which row it belongs to.
 */
function PortalActionMenu({
  anchor,
  onClose,
  users,
  onEdit,
  onBlock,
  onDelete,
}: {
  anchor: { id: string; top: number; right: number } | null;
  onClose: () => void;
  users: User[];
  onEdit: (id: string) => void;
  onBlock: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  const user = anchor ? users.find((u) => u._id === anchor.id) ?? null : null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {anchor && user && (
        <motion.div
          key="portal-action-menu"
          role="menu"
          aria-label={`Actions for ${user.name}`}
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.14, ease: [0.25, 0.4, 0.25, 1] }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: anchor.top,
            right: anchor.right,
            zIndex: 9999,
          }}
          className="w-44 bg-white rounded-xl border border-[#e3e3dd] shadow-xl overflow-hidden"
        >
          {/* Edit */}
          <button
            type="button"
            role="menuitem"
            onClick={() => onEdit(user._id)}
            className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#424843] font-[var(--font-work-sans)] hover:bg-[#fafaf4] transition-colors text-left"
          >
            <svg className="w-3.5 h-3.5 text-[#9ca8a3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
            Edit User
          </button>

          {/* Block — hidden when already blocked */}
          {user.status !== "blocked" && (
            <button
              type="button"
              role="menuitem"
              onClick={() => onBlock(user)}
              className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#b45309] font-bold font-[var(--font-work-sans)] hover:bg-[#fff3cd]/30 transition-colors text-left"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
              </svg>
              Block User
            </button>
          )}

          {/* Delete */}
          <div className="border-t border-[#f4f4ee]">
            <button
              type="button"
              role="menuitem"
              onClick={() => onDelete(user)}
              className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#ba1a1a] font-bold font-[var(--font-work-sans)] hover:bg-[#ffd9d5]/20 transition-colors text-left"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
              Delete User
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── PageBtn ─────────────────────────────────────────────────── */
function PageBtn({
  children,
  onClick,
  active = false,
  disabled = false,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      whileTap={disabled ? {} : { scale: 0.9 }}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`min-w-[36px] h-9 px-2 rounded-lg text-[12px] font-bold font-[var(--font-work-sans)] flex items-center justify-center transition-colors ${
        active
          ? "bg-[#032616] text-white shadow-sm"
          : disabled
          ? "border border-[#e3e3dd] text-[#c1c8c1] cursor-not-allowed"
          : "border border-[#e3e3dd] text-[#424843] hover:bg-[#f4f4ee] cursor-pointer"
      }`}
    >
      {children}
    </motion.button>
  );
}
