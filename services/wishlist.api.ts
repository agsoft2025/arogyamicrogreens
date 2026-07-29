/**
 * api/wishlist.api.ts
 * Raw HTTP calls for wishlist endpoints.
 *
 * Endpoints (mirrors cart pattern):
 *   GET    /wishlist
 *   POST   /wishlist              { productId }
 *   DELETE /wishlist/items/:productId
 *   DELETE /wishlist
 */

import apiClient from "./axios";
import type { WishlistApiResponse } from "@/types/wishlist.types";

/** GET /wishlist — fetch the current user's wishlist */
export async function getWishlist(): Promise<WishlistApiResponse> {
  const res = await apiClient.get<WishlistApiResponse>("/wishlist");
  return res.data;
}

/** POST /wishlist — add a product to the wishlist */
export async function addToWishlist(
  productId: string
): Promise<WishlistApiResponse> {
  const res = await apiClient.post<WishlistApiResponse>("/wishlist", {
    productId,
  });
  return res.data;
}

/** DELETE /wishlist/items/:productId — remove a single item */
export async function removeFromWishlist(
  productId: string
): Promise<WishlistApiResponse> {
  const res = await apiClient.delete<WishlistApiResponse>(
    `/wishlist/items/${productId}`
  );
  return res.data;
}

/** DELETE /wishlist — clear the entire wishlist */
export async function clearApiWishlist(): Promise<WishlistApiResponse> {
  const res = await apiClient.delete<WishlistApiResponse>("/wishlist");
  return res.data;
}
