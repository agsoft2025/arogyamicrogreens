/**
 * api/cart.api.ts
 * Raw HTTP calls for cart endpoints.
 * All functions return the full API response; callers handle errors.
 *
 * Endpoints:
 *   GET    /cart
 *   POST   /cart                  { productId, quantity }
 *   PUT    /cart/items/:productId { quantity }
 *   DELETE /cart/items/:productId
 *   DELETE /cart
 */

import apiClient from "./axios";
import type { CartApiResponse } from "@/types/cart.types";

/** GET /cart — fetch the current user's cart */
export async function getCart(): Promise<CartApiResponse> {
  const res = await apiClient.get<CartApiResponse>("/cart");
  return res.data;
}

/** POST /cart — add (or merge) an item into the cart */
export async function addToCart(
  productId: string,
  quantity: number
): Promise<CartApiResponse> {
  const res = await apiClient.post<CartApiResponse>("/cart", {
    productId,
    quantity,
  });
  return res.data;
}

/** PUT /cart/items/:productId — set the quantity of an existing cart item */
export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<CartApiResponse> {
  const res = await apiClient.put<CartApiResponse>(
    `/cart/items/${productId}`,
    { quantity }
  );
  return res.data;
}

/** DELETE /cart/items/:productId — remove a single item from the cart */
export async function removeFromCart(
  productId: string
): Promise<CartApiResponse> {
  const res = await apiClient.delete<CartApiResponse>(
    `/cart/items/${productId}`
  );
  return res.data;
}

/** DELETE /cart — clear the entire cart */
export async function clearApiCart(): Promise<CartApiResponse> {
  const res = await apiClient.delete<CartApiResponse>("/cart");
  return res.data;
}
