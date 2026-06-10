/**
 * types/admin.order.types.ts
 *
 * TypeScript types for the Admin Order Management module.
 * Covers the three admin endpoints:
 *   GET  /orders/admin/orders
 *   GET  /orders/admin/orders/:id
 *   PUT  /orders/admin/orders/status/:id
 *   POST /orders/admin/orders/refund/:id
 */

/* ── Status enum ─────────────────────────────────────────────── */

export type AdminOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type AdminPaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "COD_PENDING";

export type AdminPaymentMethod = "RAZORPAY" | "COD";

/* ── Status workflow ─────────────────────────────────────────── */

/**
 * Valid next statuses for each current status.
 * Used to show/hide options in the UpdateStatusDialog.
 */
export const ORDER_STATUS_TRANSITIONS: Record<AdminOrderStatus, AdminOrderStatus[]> = {
  PENDING:    ["CONFIRMED", "CANCELLED"],
  CONFIRMED:  ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED:    ["DELIVERED"],
  DELIVERED:  [],
  CANCELLED:  [],
  REFUNDED:   [],
};

/** Statuses from which cancellation is allowed */
export const CANCELLABLE_STATUSES: AdminOrderStatus[] = [
  "PENDING", "CONFIRMED", "PROCESSING",
];

/** Status is a terminal state — no further updates possible */
export const TERMINAL_STATUSES: AdminOrderStatus[] = [
  "DELIVERED", "CANCELLED", "REFUNDED",
];

/** Refund is allowed when order is DELIVERED or already REFUNDED-eligible */
export function isRefundEligible(status: AdminOrderStatus): boolean {
  return status === "DELIVERED";
}

/* ── Display config ──────────────────────────────────────────── */

export const ORDER_STATUS_CFG: Record<
  AdminOrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING:    { label: "Pending",    bg: "bg-[#e3e3dd]",  text: "text-[#424843]",  dot: "bg-[#9ca8a3]"  },
  CONFIRMED:  { label: "Confirmed",  bg: "bg-[#dbeafe]",  text: "text-[#1d4ed8]",  dot: "bg-[#3b82f6]"  },
  PROCESSING: { label: "Processing", bg: "bg-[#fff3cd]",  text: "text-[#7a4b00]",  dot: "bg-[#f59e0b]"  },
  SHIPPED:    { label: "Shipped",    bg: "bg-[#1b3c2a]",  text: "text-[#aacfb6]",  dot: "bg-[#aacfb6]"  },
  DELIVERED:  { label: "Delivered",  bg: "bg-[#d4f4a0]",  text: "text-[#3b7100]",  dot: "bg-[#386b00]"  },
  CANCELLED:  { label: "Cancelled",  bg: "bg-[#ffdad6]",  text: "text-[#ba1a1a]",  dot: "bg-[#ba1a1a]"  },
  REFUNDED:   { label: "Refunded",   bg: "bg-[#ede9fe]",  text: "text-[#6d28d9]",  dot: "bg-[#7c3aed]"  },
};

export const PAYMENT_STATUS_CFG: Record<
  AdminPaymentStatus,
  { label: string; bg: string; text: string }
> = {
  PENDING:     { label: "Pending",     bg: "bg-[#fff3cd]", text: "text-[#7a4b00]"  },
  PAID:        { label: "Paid",        bg: "bg-[#d4f4a0]", text: "text-[#3b7100]"  },
  FAILED:      { label: "Failed",      bg: "bg-[#ffdad6]", text: "text-[#ba1a1a]"  },
  REFUNDED:    { label: "Refunded",    bg: "bg-[#ede9fe]", text: "text-[#6d28d9]"  },
  COD_PENDING: { label: "COD Pending", bg: "bg-[#e3e3dd]", text: "text-[#424843]"  },
};

/** Ordered timeline steps (excludes CANCELLED/REFUNDED) */
export const ORDER_TIMELINE_STEPS: AdminOrderStatus[] = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED",
];

/* ── Domain types ────────────────────────────────────────────── */

export interface AdminOrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/** Populated user summary on an admin order */
export interface AdminOrderUser {
  _id: string;
  name: string;
  email?: string;
  mobileNumber?: string;
}

/** Order item as returned by list endpoint */
export interface AdminOrderItem {
  productId: string | { _id: string; name: string; images?: string[]; featuredImage?: string; sku?: string };
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  salePrice?: number;
  image?: string;
}

/** Single order row in the admin list */
export interface AdminOrder {
  _id: string;
  orderNumber: string;
  /** Populated user or bare userId string */
  userId: AdminOrderUser | string;
  items: AdminOrderItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: AdminPaymentMethod;
  paymentStatus: AdminPaymentStatus | string;
  orderStatus: AdminOrderStatus;
  shippingAddress: AdminOrderAddress;
  billingAddress?: AdminOrderAddress;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: AdminStatusHistory[];
}

/** Full order detail (same shape, used for detail page clarity) */
export type AdminOrderDetail = AdminOrder;

export interface AdminStatusHistory {
  status: AdminOrderStatus;
  remarks?: string;
  updatedBy?: string;
  updatedAt: string;
}

/* ── Query params ────────────────────────────────────────────── */

export interface AdminOrderListParams {
  page?: number;
  limit?: number;
  status?: AdminOrderStatus | "ALL" | "";
}

/* ── Pagination ──────────────────────────────────────────────── */

export interface AdminOrderPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ── API response shapes ─────────────────────────────────────── */

export interface AdminOrderListData {
  orders: AdminOrder[];
  pagination: AdminOrderPagination;
}

export interface AdminOrderListResponse {
  success: boolean;
  message: string;
  data: AdminOrderListData;
}

export interface AdminOrderDetailResponse {
  success: boolean;
  message: string;
  data: AdminOrderDetail;
}

/* ── Mutation payloads ───────────────────────────────────────── */

export interface UpdateOrderStatusPayload {
  status: AdminOrderStatus;
  remarks: string;
}

export interface RefundOrderPayload {
  amount: number;
  reason: string;
}

export interface AdminOrderMutationResponse {
  success: boolean;
  message: string;
  data?: AdminOrderDetail;
}

/* ── Hook state ──────────────────────────────────────────────── */

export interface UseAdminOrdersState {
  orders: AdminOrder[];
  pagination: AdminOrderPagination | null;
  loading: boolean;
  error: string | null;
}

export interface UseAdminOrderState {
  order: AdminOrderDetail | null;
  loading: boolean;
  error: string | null;
}

/* ── Helpers ─────────────────────────────────────────────────── */

/** Extract the user object from userId (populated or string) */
export function resolveOrderUser(order: AdminOrder): AdminOrderUser | null {
  if (!order.userId) return null;
  if (typeof order.userId === "object") return order.userId;
  return null;
}

/** Get customer display name */
export function getCustomerName(order: AdminOrder): string {
  const user = resolveOrderUser(order);
  return user?.name ?? order.shippingAddress?.fullName ?? "Unknown";
}

/** Get customer email */
export function getCustomerEmail(order: AdminOrder): string {
  const user = resolveOrderUser(order);
  return user?.email ?? "—";
}
