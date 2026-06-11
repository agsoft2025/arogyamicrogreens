/**
 * api/admin.order.api.ts
 *
 * HTTP calls for Admin Order Management endpoints.
 * All methods delegate to the shared apiClient (axios.ts).
 *
 * Endpoints (admin routes are nested inside the /orders router):
 *   GET  /orders/admin/orders
 *   GET  /orders/admin/orders/:id
 *   PUT  /orders/admin/orders/status/:id
 *   POST /orders/admin/orders/refund/:id
 */

import apiClient from "./axios";
import type {
  AdminOrderListParams,
  AdminOrderListResponse,
  AdminOrderDetailResponse,
  UpdateOrderStatusPayload,
  RefundOrderPayload,
  AdminOrderMutationResponse,
} from "@/types/admin.order.types";

/**
 * GET /orders/admin/orders
 * Paginated, filterable admin order list.
 */
export async function getAdminOrders(
  params: AdminOrderListParams = {}
): Promise<AdminOrderListResponse> {
  const query: Record<string, string | number> = {};
  if (params.page  !== undefined) query.page  = params.page;
  if (params.limit !== undefined) query.limit = params.limit;
  if (params.status && params.status !== "ALL") query.status = params.status;

  const res = await apiClient.get<AdminOrderListResponse>(
    "/orders/admin/orders",
    { params: query }
  );
  return res.data;
}

/**
 * GET /orders/admin/orders/:id
 * Full order detail for a single order.
 */
export async function getAdminOrderById(
  id: string
): Promise<AdminOrderDetailResponse> {
  const res = await apiClient.get<AdminOrderDetailResponse>(
    `/orders/admin/orders/${id}`
  );
  return res.data;
}

/**
 * PUT /orders/admin/orders/status/:id
 * Update the status of an order.
 */
export async function updateOrderStatus(
  id: string,
  payload: UpdateOrderStatusPayload
): Promise<AdminOrderMutationResponse> {
  const res = await apiClient.put<AdminOrderMutationResponse>(
    `/orders/admin/orders/status/${id}`,
    payload
  );
  return res.data;
}

/**
 * POST /orders/admin/orders/refund/:id
 * Process a refund for a delivered order.
 */
export async function refundOrder(
  id: string,
  payload: RefundOrderPayload
): Promise<AdminOrderMutationResponse> {
  const res = await apiClient.post<AdminOrderMutationResponse>(
    `/orders/admin/orders/refund/${id}`,
    payload
  );
  return res.data;
}
