"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminOrder } from "@/hooks/useAdminOrder";
import UpdateStatusDialog from "@/components/admin/orders/UpdateStatusDialog";
import RefundDialog from "@/components/admin/orders/RefundDialog";
import { formatCurrency } from "@/lib/currency";
import { getProductImageUrl } from "@/lib/imageUtils";
import {
  ORDER_STATUS_CFG,
  PAYMENT_STATUS_CFG,
  ORDER_TIMELINE_STEPS,
  TERMINAL_STATUSES,
  isRefundEligible,
  getCustomerName,
  getCustomerEmail,
  type AdminOrder,
  type AdminOrderStatus,
  type AdminPaymentStatus,
} from "@/types/admin.order.types";

/* ── Helpers ───────────────────────────────────────────── */
function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

/* ═══════════════════════════════════════════════════════ */
export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { order, loading, error, refetch } = useAdminOrder(id ?? null);

  const [updateOpen, setUpdateOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const showSuccess = useCallback((msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-5 pb-20 animate-pulse">
        <div className="h-8 w-48 bg-[#f4f4ee] rounded-full" />
        <div className="bg-white rounded-xl border border-[#e3e3dd] p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-[#f4f4ee] rounded-full" style={{ width: `${60 - i * 10}%` }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#1a1c19] mb-2">
          Order not found
        </h2>
        <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] mb-6">
          {error ?? "This order could not be loaded."}
        </p>
        <div className="flex gap-3">
          <motion.button
            onClick={refetch}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 bg-[#386b00] text-white text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#4a8a00] transition-colors"
          >
            Retry
          </motion.button>
          <Link
            href="/admin/orders"
            className="px-5 py-2.5 border border-[#e3e3dd] text-[#424843] text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#f4f4ee] transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const name = getCustomerName(order);
  const email = getCustomerEmail(order);
  const pal = avatarColors(name);
  const statusCfg = ORDER_STATUS_CFG[order.orderStatus];
  const isTerminal = TERMINAL_STATUSES.includes(order.orderStatus);
  const canRefund = isRefundEligible(order.orderStatus);

  /* Timeline index */
  const timelineIdx = ORDER_TIMELINE_STEPS.indexOf(order.orderStatus);
  const isCancelledOrRefunded =
    order.orderStatus === "CANCELLED" || order.orderStatus === "REFUNDED";

  /* Payment status cfg */
  const payStatusKey = order.paymentStatus as AdminPaymentStatus;
  const payCfg =
    PAYMENT_STATUS_CFG[payStatusKey] ??
    PAYMENT_STATUS_CFG["PENDING"];

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-5 pb-24 md:pb-8">
        {/* ── Breadcrumb ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-2 text-[12px] font-[var(--font-work-sans)]"
        >
          <Link
            href="/admin/orders"
            className="text-[#9ca8a3] hover:text-[#424843] transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Orders
          </Link>
          <span className="text-[#c1c8c1]">/</span>
          <span className="text-[#424843] font-bold">#{order.orderNumber}</span>
        </motion.div>

        {/* ── Header card ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
                Order #{order.orderNumber}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-[var(--font-work-sans)] ${statusCfg.bg} ${statusCfg.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold font-[var(--font-work-sans)] ${payCfg.bg} ${payCfg.text}`}
              >
                {payCfg.label}
              </span>
            </div>
            <p className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {!isTerminal && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setUpdateOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#4a8a00] transition-colors"
              >
                <RefreshIcon />
                Update Status
              </motion.button>
            )}
            {canRefund && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRefundOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#ba1a1a] text-[#ba1a1a] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#ffdad6]/40 transition-colors"
              >
                <RefundIcon />
                Refund
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left column (2/3 width) ─────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Status Timeline */}
            {!isCancelledOrRefunded && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm px-6 py-5"
              >
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-5">
                  Order Progress
                </h2>
                <div className="flex items-start gap-0">
                  {ORDER_TIMELINE_STEPS.map((step, idx) => {
                    const done = idx <= timelineIdx;
                    const active = idx === timelineIdx;
                    const cfg = ORDER_STATUS_CFG[step];
                    return (
                      <div key={step} className="flex-1 flex flex-col items-center relative">
                        {/* Connector line */}
                        {idx < ORDER_TIMELINE_STEPS.length - 1 && (
                          <div
                            className={`absolute top-[14px] left-1/2 w-full h-0.5 transition-colors ${
                              idx < timelineIdx ? "bg-[#386b00]" : "bg-[#e3e3dd]"
                            }`}
                            style={{ left: "50%" }}
                          />
                        )}
                        {/* Circle */}
                        <div
                          className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                            done
                              ? "bg-[#386b00] border-[#386b00]"
                              : "bg-white border-[#e3e3dd]"
                          } ${active ? "ring-4 ring-[#386b00]/20" : ""}`}
                        >
                          {done ? (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-[#c1c8c1]" />
                          )}
                        </div>
                        {/* Label */}
                        <p
                          className={`mt-2 text-[10px] font-bold tracking-wider uppercase font-[var(--font-work-sans)] text-center ${
                            done ? "text-[#386b00]" : "text-[#c1c8c1]"
                          }`}
                        >
                          {cfg.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Order Items */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#f4f4ee]">
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)]">
                  Items ({order.items.length})
                </h2>
              </div>
              <div className="divide-y divide-[#f4f4ee]">
                {order.items.map((item, idx) => {
                  const imgSrc =
                    item.image ??
                    (typeof item.productId === "object"
                      ? item.productId.featuredImage ??
                        item.productId.images?.[0]
                      : undefined);
                  const imgUrl = getProductImageUrl(imgSrc);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl bg-[#f4f4ee] shrink-0 overflow-hidden">
                        {imgSrc ? (
                          <img
                            src={imgUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#c1c8c1]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1a1c19] font-[var(--font-work-sans)] truncate">
                          {item.productName}
                        </p>
                        {item.sku && (
                          <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                            SKU: {item.sku}
                          </p>
                        )}
                        <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5">
                          {formatCurrency(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      {/* Total */}
                      <span className="text-sm font-bold text-[#1a1c19] font-[var(--font-work-sans)] tabular-nums shrink-0">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pricing summary */}
              <div className="px-6 py-4 bg-[#fafaf4]/60 border-t border-[#f4f4ee] space-y-2">
                <PriceLine label="Subtotal" value={formatCurrency(order.subtotal)} />
                {order.discount > 0 && (
                  <PriceLine
                    label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
                    value={`−${formatCurrency(order.discount)}`}
                    valueClass="text-[#386b00]"
                  />
                )}
                <PriceLine label="Shipping" value={order.shippingCharge === 0 ? "Free" : formatCurrency(order.shippingCharge)} />
                {order.taxAmount > 0 && (
                  <PriceLine label="Tax" value={formatCurrency(order.taxAmount)} />
                )}
                <div className="border-t border-[#e3e3dd] pt-2">
                  <PriceLine
                    label="Total"
                    value={formatCurrency(order.totalAmount)}
                    bold
                  />
                </div>
              </div>
            </motion.section>

            {/* Status history */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-[#f4f4ee]">
                  <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)]">
                    Status History
                  </h2>
                </div>
                <div className="divide-y divide-[#f4f4ee]">
                  {[...order.statusHistory].reverse().map((h, idx) => {
                    const cfg =
                      ORDER_STATUS_CFG[h.status] ??
                      ORDER_STATUS_CFG["PENDING"];
                    return (
                      <div key={idx} className="px-6 py-3.5 flex items-start gap-3">
                        <span
                          className={`mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-[var(--font-work-sans)] shrink-0 ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.label}
                        </span>
                        <div className="min-w-0">
                          {h.remarks && (
                            <p className="text-[12px] text-[#424843] font-[var(--font-work-sans)]">
                              {h.remarks}
                            </p>
                          )}
                          <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5">
                            {formatDate(h.updatedAt)}
                            {h.updatedBy && ` · by ${h.updatedBy}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </div>

          {/* ── Right column (1/3 width) ─────────────── */}
          <div className="space-y-5">
            {/* Customer */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm px-5 py-5"
            >
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-4">
                Customer
              </h2>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm font-[var(--font-work-sans)] shrink-0"
                  style={{ background: pal.bg, color: pal.text }}
                >
                  {getInitials(name)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#1a1c19] font-[var(--font-work-sans)] truncate">
                    {name}
                  </p>
                  {email !== "—" && (
                    <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] truncate">
                      {email}
                    </p>
                  )}
                  {typeof order.userId === "object" &&
                    order.userId.mobileNumber && (
                      <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                        {order.userId.mobileNumber}
                      </p>
                    )}
                </div>
              </div>
            </motion.section>

            {/* Shipping address */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm px-5 py-5"
            >
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-3">
                Shipping Address
              </h2>
              <address className="not-italic text-[12px] text-[#424843] font-[var(--font-work-sans)] space-y-0.5 leading-relaxed">
                <p className="font-bold">{order.shippingAddress.fullName}</p>
                {order.shippingAddress.phone && (
                  <p className="text-[#9ca8a3]">{order.shippingAddress.phone}</p>
                )}
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} –{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </motion.section>

            {/* Payment */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm px-5 py-5"
            >
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-3">
                Payment
              </h2>
              <div className="space-y-2.5">
                <div className="flex justify-between text-[12px] font-[var(--font-work-sans)]">
                  <span className="text-[#9ca8a3]">Method</span>
                  <span className="font-bold text-[#424843]">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Razorpay"}
                  </span>
                </div>
                <div className="flex justify-between text-[12px] font-[var(--font-work-sans)]">
                  <span className="text-[#9ca8a3]">Status</span>
                  <span
                    className={`font-bold text-[11px] px-2 py-0.5 rounded-full ${payCfg.bg} ${payCfg.text}`}
                  >
                    {payCfg.label}
                  </span>
                </div>
                {order.couponCode && (
                  <div className="flex justify-between text-[12px] font-[var(--font-work-sans)]">
                    <span className="text-[#9ca8a3]">Coupon</span>
                    <span className="font-bold text-[#386b00]">
                      {order.couponCode}
                    </span>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Refund Information */}
            {order.refundInfo && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="bg-[#ede9fe] rounded-xl border border-[#c4b5fd] px-5 py-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#6d28d9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6 6-6" />
                  </svg>
                  <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#6d28d9] font-[var(--font-work-sans)]">
                    Refund Information
                  </h2>
                </div>
                <div className="space-y-2">
                  {order.refundInfo.refundId && (
                    <div className="flex justify-between text-[12px] font-[var(--font-work-sans)]">
                      <span className="text-[#6d28d9]/70">Refund ID</span>
                      <span className="font-bold text-[#4c1d95] font-mono text-[10px] break-all text-right max-w-[140px]">
                        {order.refundInfo.refundId}
                      </span>
                    </div>
                  )}
                  {order.refundInfo.refundedAmount !== undefined && (
                    <div className="flex justify-between text-[12px] font-[var(--font-work-sans)]">
                      <span className="text-[#6d28d9]/70">Refunded Amount</span>
                      <span className="font-bold text-[#4c1d95]">
                        {formatCurrency(order.refundInfo.refundedAmount)}
                      </span>
                    </div>
                  )}
                  {order.refundInfo.refundStatus && (
                    <div className="flex justify-between text-[12px] font-[var(--font-work-sans)]">
                      <span className="text-[#6d28d9]/70">Status</span>
                      <span className="font-bold text-[#4c1d95]">
                        {order.refundInfo.refundStatus}
                      </span>
                    </div>
                  )}
                  {order.refundInfo.refundedAt && (
                    <div className="flex justify-between text-[12px] font-[var(--font-work-sans)]">
                      <span className="text-[#6d28d9]/70">Refunded On</span>
                      <span className="font-bold text-[#4c1d95]">
                        {formatDateShort(order.refundInfo.refundedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Notes */}
            {order.notes && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-[#fffbe6] rounded-xl border border-[#f0e0a0] px-5 py-4"
              >
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#9a7b00] font-[var(--font-work-sans)] mb-1.5">
                  Customer Note
                </h2>
                <p className="text-[12px] text-[#7a6000] font-[var(--font-work-sans)] leading-relaxed">
                  {order.notes}
                </p>
              </motion.section>
            )}
          </div>
        </div>
      </div>

      {/* ── UpdateStatusDialog ───────────────────────── */}
      <UpdateStatusDialog
        open={updateOpen}
        orderId={order._id}
        orderNumber={order.orderNumber}
        currentStatus={order.orderStatus}
        onClose={() => setUpdateOpen(false)}
        onSuccess={(msg) => {
          showSuccess(msg);
          setUpdateOpen(false);
          refetch();
        }}
      />

      {/* ── RefundDialog ─────────────────────────────── */}
      <RefundDialog
        open={refundOpen}
        orderId={order._id}
        orderNumber={order.orderNumber}
        totalAmount={order.totalAmount}
        onClose={() => setRefundOpen(false)}
        onSuccess={(msg) => {
          showSuccess(msg);
          setRefundOpen(false);
          refetch();
        }}
      />

      {/* ── Toast ────────────────────────────────────── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 bg-[#032616] text-white text-sm font-[var(--font-work-sans)] font-bold px-5 py-3.5 rounded-xl shadow-2xl max-w-sm"
          >
            <svg
              className="w-4 h-4 text-[#a5f95b] shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Price line ──────────────────────────────────────────── */
function PriceLine({
  label,
  value,
  bold = false,
  valueClass = "",
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between text-[12px] font-[var(--font-work-sans)]">
      <span className={bold ? "font-bold text-[#1a1c19]" : "text-[#727973]"}>
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? "font-bold text-[#1a1c19]" : "text-[#424843]"} ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────── */
function RefreshIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4" />
    </svg>
  );
}
function RefundIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6 6-6" />
    </svg>
  );
}
