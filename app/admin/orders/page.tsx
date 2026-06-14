"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import UpdateStatusDialog from "@/components/admin/orders/UpdateStatusDialog";
import RefundDialog from "@/components/admin/orders/RefundDialog";
import { formatCurrency } from "@/lib/currency";
import {
  ORDER_STATUS_CFG,
  TERMINAL_STATUSES,
  isRefundEligible,
  getCustomerName,
  getCustomerEmail,
  type AdminOrder,
  type AdminOrderStatus,
} from "@/types/admin.order.types";

/* ── Filter tabs ──────────────────────────────────────── */
const FILTER_TABS: { label: string; value: "" | AdminOrderStatus }[] = [
  { label: "All", value: "" },
  { label: "Awaiting Payment", value: "PAYMENT_PENDING" },
  { label: "Payment Failed", value: "PAYMENT_FAILED" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Refunded", value: "REFUNDED" },
];

/* ── Avatar helpers ───────────────────────────────────── */
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
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

/* ── Date helper ──────────────────────────────────────── */
function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ═══════════════════════════════════════════════════════ */
export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<"" | AdminOrderStatus>("");
  const [page, setPage] = useState(1);

  const [successMsg, setSuccessMsg] = useState("");
  const showSuccess = useCallback((msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  }, []);

  const [updateTarget, setUpdateTarget] = useState<AdminOrder | null>(null);
  const [refundTarget, setRefundTarget] = useState<AdminOrder | null>(null);

  const [menuState, setMenuState] = useState<{
    id: string;
    top: number;
    right: number;
  } | null>(null);

  const { orders, pagination, loading, error, refetch, setParams } =
    useAdminOrders({ page: 1, limit: 10 });

  const filterMountRef = useRef(true);
  useEffect(() => {
    if (filterMountRef.current) {
      filterMountRef.current = false;
      return;
    }
    setParams({ page: 1, status: statusFilter || undefined });
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    setParams({ page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!menuState) return;
    const close = () => setMenuState(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuState]);

  const openMenu = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuState({
      id,
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  }, []);

  const totalPages = pagination?.totalPages ?? 1;
  const pageNums: number[] = [];
  const start = Math.max(1, Math.min(page - 1, totalPages - 2));
  for (let i = start; i <= Math.min(start + 2, totalPages); i++)
    pageNums.push(i);

  const showingFrom = pagination
    ? (pagination.page - 1) * pagination.limit + 1
    : 0;
  const showingTo = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  return (
    <>
      <div className="space-y-5 pb-20 md:pb-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <h1 className="font-[var(--font-libre-caslon)] text-[28px] md:text-[32px] font-bold text-[#032616] leading-tight">
            Order Management
          </h1>
          <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
            Track, manage, and fulfil organic harvest deliveries.
          </p>
        </motion.div>

        {/* Orders Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm overflow-hidden"
        >
          {/* Status filter tabs */}
          <div className="px-6 pt-5 border-b border-[#f4f4ee]">
            <div className="flex overflow-x-auto gap-1 scrollbar-hide">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`shrink-0 px-4 py-2.5 text-[11px] font-bold tracking-wider uppercase font-[var(--font-work-sans)] border-b-2 transition-colors ${
                    statusFilter === tab.value
                      ? "border-[#386b00] text-[#386b00]"
                      : "border-transparent text-[#9ca8a3] hover:text-[#424843]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : (
              <table
                className="w-full text-left border-collapse min-w-[700px]"
                aria-label="Orders table"
              >
                <thead className="border-b border-[#f4f4ee] bg-[#fafaf4]/60">
                  <tr>
                    {["Order", "Customer", "Date", "Items", "Total", "Status", "Actions"].map((col, i) => (
                      <th
                        key={col}
                        className={`px-6 py-4 text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#727973] whitespace-nowrap ${
                          i === 6 ? "text-right" : ""
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait" initial={false}>
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={`sk-${i}`} className="border-b border-[#f4f4ee]">
                          {Array.from({ length: 7 }).map((__, j) => (
                            <td key={j} className="px-6 py-4">
                              <div
                                className={`h-3.5 rounded-full bg-[#f4f4ee] animate-pulse ${
                                  j === 0 ? "w-20" : j === 1 ? "w-28" : j === 5 ? "w-20 h-6 rounded-full" : "w-16"
                                }`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : orders.length === 0 ? (
                      <tr key="empty">
                        <td colSpan={7}>
                          <EmptyState
                            hasFilters={!!statusFilter}
                            onReset={() => setStatusFilter("")}
                          />
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, i) => {
                        const name = getCustomerName(order);
                        const email = getCustomerEmail(order);
                        const pal = avatarColors(name);
                        const cfg = ORDER_STATUS_CFG[order.orderStatus] ?? {
                          label: order.orderStatus,
                          bg: "bg-[#e3e3dd]",
                          text: "text-[#424843]",
                          dot: "bg-[#9ca8a3]",
                        };
                        const isTerminal = TERMINAL_STATUSES.includes(order.orderStatus);

                        return (
                          <motion.tr
                            key={order._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                            className="border-b border-[#f4f4ee] last:border-0 hover:bg-[#fafaf4] transition-colors"
                          >
                            {/* Order number */}
                            <td className="px-6 py-4">
                              <Link
                                href={`/admin/orders/${order._id}`}
                                className="font-bold text-sm text-[#032616] font-[var(--font-work-sans)] hover:text-[#386b00] transition-colors"
                              >
                                #{order.orderNumber}
                              </Link>
                            </td>

                            {/* Customer */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] font-[var(--font-work-sans)] shrink-0"
                                  style={{ background: pal.bg, color: pal.text }}
                                >
                                  {getInitials(name)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm text-[#1a1c19] font-[var(--font-work-sans)] truncate max-w-[140px]">
                                    {name}
                                  </p>
                                  {email !== "—" && (
                                    <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)] truncate max-w-[140px]">
                                      {email}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4">
                              <span className="text-sm text-[#727973] font-[var(--font-work-sans)] whitespace-nowrap">
                                {formatDate(order.createdAt)}
                              </span>
                            </td>

                            {/* Items */}
                            <td className="px-6 py-4">
                              <span className="text-sm text-[#727973] font-[var(--font-work-sans)] tabular-nums">
                                {order.items.length}
                              </span>
                            </td>

                            {/* Total */}
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-[#1a1c19] font-[var(--font-work-sans)] tabular-nums whitespace-nowrap">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-[var(--font-work-sans)] ${cfg.bg} ${cfg.text}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                                {cfg.label}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <Link
                                  href={`/admin/orders/${order._id}`}
                                  className="text-[12px] font-bold text-[#424843] font-[var(--font-work-sans)] px-3 py-1.5 rounded-lg hover:bg-[#f4f4ee] hover:text-[#032616] transition-colors"
                                >
                                  View
                                </Link>
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => openMenu(e, order._id)}
                                  className="p-1.5 rounded-lg text-[#9ca8a3] hover:text-[#424843] hover:bg-[#f4f4ee] transition-colors"
                                  aria-label="More options"
                                >
                                  <MoreVertIcon />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && pagination && pagination.total > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-[#f4f4ee] bg-[#fafaf4]/60 flex-wrap gap-3">
              <span className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                Showing{" "}
                <span className="font-bold text-[#424843]">{showingFrom}–{showingTo}</span>{" "}
                of{" "}
                <span className="font-bold text-[#424843]">{pagination.total}</span>{" "}
                orders
              </span>
              <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
                <PageBtn
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </PageBtn>
                {pageNums.map((num) => (
                  <PageBtn key={num} onClick={() => setPage(num)} active={page === num} aria-label={`Page ${num}`}>
                    {num}
                  </PageBtn>
                ))}
                <PageBtn
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
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

      {/* Portal: row action menu */}
      {typeof window !== "undefined" &&
        menuState &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[200]" onClick={() => setMenuState(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.13 }}
              style={{ position: "fixed", top: menuState.top, right: menuState.right, zIndex: 201 }}
              className="w-48 bg-white rounded-xl border border-[#e3e3dd] shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const order = orders.find((o) => o._id === menuState.id);
                if (!order) return null;
                const isTerminal = TERMINAL_STATUSES.includes(order.orderStatus);
                return (
                  <>
                    <Link
                      href={`/admin/orders/${order._id}`}
                      onClick={() => setMenuState(null)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#424843] font-[var(--font-work-sans)] hover:bg-[#fafaf4] transition-colors"
                    >
                      <EyeIcon />
                      View Details
                    </Link>
                    {!isTerminal && (
                      <button
                        onClick={() => { setUpdateTarget(order); setMenuState(null); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#424843] font-[var(--font-work-sans)] hover:bg-[#fafaf4] transition-colors text-left"
                      >
                        <RefreshIcon />
                        Update Status
                      </button>
                    )}
                    {isRefundEligible(order.orderStatus) && (
                      <button
                        onClick={() => { setRefundTarget(order); setMenuState(null); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#ba1a1a] font-[var(--font-work-sans)] hover:bg-[#ffdad6]/40 transition-colors text-left border-t border-[#f4f4ee]"
                      >
                        <RefundMenuIcon />
                        Refund
                      </button>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </>,
          document.body
        )}

      {/* UpdateStatusDialog */}
      {updateTarget && (
        <UpdateStatusDialog
          open={!!updateTarget}
          orderId={updateTarget._id}
          orderNumber={updateTarget.orderNumber}
          currentStatus={updateTarget.orderStatus}
          onClose={() => setUpdateTarget(null)}
          onSuccess={(msg) => { showSuccess(msg); setUpdateTarget(null); refetch(); }}
        />
      )}

      {/* RefundDialog */}
      {refundTarget && (
        <RefundDialog
          open={!!refundTarget}
          orderId={refundTarget._id}
          orderNumber={refundTarget.orderNumber}
          totalAmount={refundTarget.totalAmount}
          onClose={() => setRefundTarget(null)}
          onSuccess={(msg) => { showSuccess(msg); setRefundTarget(null); refetch(); }}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 bg-[#032616] text-white text-sm font-[var(--font-work-sans)] font-bold px-5 py-3.5 rounded-xl shadow-2xl max-w-sm"
          >
            <svg className="w-4 h-4 text-[#a5f95b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Sub-components ────────────────────────────────────── */
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
      onClick={disabled ? undefined : onClick}
      whileTap={disabled ? {} : { scale: 0.9 }}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`min-w-[36px] h-9 px-2 rounded-lg text-[12px] font-bold font-[var(--font-work-sans)] flex items-center justify-center transition-colors ${
        active
          ? "bg-[#386b00] text-white shadow-sm"
          : disabled
          ? "border border-[#e3e3dd] text-[#c1c8c1] cursor-not-allowed"
          : "border border-[#e3e3dd] text-[#424843] hover:bg-[#f4f4ee] cursor-pointer"
      }`}
    >
      {children}
    </motion.button>
  );
}

function EmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-[#f4f4ee] flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-[#c1c8c1]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
          <rect width="13" height="8" x="9" y="11" rx="1" />
          <circle cx="12" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
        </svg>
      </div>
      <h3 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#1a1c19] mb-2">
        {hasFilters ? "No orders found" : "No orders yet"}
      </h3>
      <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] max-w-xs mb-5">
        {hasFilters
          ? "Try a different status filter."
          : "Orders will appear here once customers start purchasing."}
      </p>
      {hasFilters && (
        <motion.button
          onClick={onReset}
          whileTap={{ scale: 0.97 }}
          className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
        >
          Show All Orders
        </motion.button>
      )}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-[#ffdad6] flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h3 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#1a1c19] mb-2">
        Failed to load orders
      </h3>
      <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] max-w-xs mb-5">{message}</p>
      <motion.button
        onClick={onRetry}
        whileTap={{ scale: 0.97 }}
        className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#386b00] text-white px-5 py-2.5 rounded-lg hover:bg-[#4a8a00] transition-colors"
      >
        Try Again
      </motion.button>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────── */
function MoreVertIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4" />
    </svg>
  );
}
function RefundMenuIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13 5.35" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
