/**
 * api/product.api.ts
 * Raw HTTP calls for product endpoints.
 * All functions throw ApiError on failure — callers use safeRequest()
 * or catch the error themselves.
 */

import apiClient from "./axios";
import type {
  CreateProductPayload,
  UpdateProductPayload,
  DeleteProductResponse,
  ProductListParams,
  ProductListResponse,
  ProductSingleResponse,
} from "@/types/product.types";

/**
 * GET /products
 * Paginated, filterable product list.
 */
export async function getProducts(
  params: ProductListParams = {}
): Promise<ProductListResponse> {
  // Stringify booleans (backend expects 'true'/'false' strings for isFeatured)
  const query: Record<string, string | number> = {};
  if (params.page !== undefined) query.page = params.page;
  if (params.limit !== undefined) query.limit = params.limit;
  if (params.search) query.search = params.search;
  if (params.status) query.status = params.status;
  if (params.category) query.category = params.category;
  if (params.isFeatured !== undefined)
    query.isFeatured = String(params.isFeatured);
  if (params.isBestSeller !== undefined)
    query.isBestSeller = String(params.isBestSeller);

  const res = await apiClient.get<ProductListResponse>("/products", {
    params: query,
  });
  return res.data;
}

/**
 * POST /products
 * Creates a new product. Returns the created product on success.
 */
export async function createProduct(
  payload: CreateProductPayload
): Promise<ProductSingleResponse> {
  const res = await apiClient.post<ProductSingleResponse>("/products", payload);
  return res.data;
}

/**
 * GET /products/:id
 */
export async function getProductById(id: string): Promise<ProductSingleResponse> {
  const res = await apiClient.get<ProductSingleResponse>(`/products/${id}`);
  return res.data;
}

/**
 * GET /products/slug/:slug
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductSingleResponse> {
  const res = await apiClient.get<ProductSingleResponse>(
    `/products/slug/${slug}`
  );
  return res.data;
}

/**
 * PATCH /products/:id
 * Partial update — only the provided fields are changed.
 */
export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<ProductSingleResponse> {
  const res = await apiClient.patch<ProductSingleResponse>(
    `/products/${id}`,
    payload
  );
  return res.data;
}

/**
 * DELETE /products/:id
 * Permanently deletes a product.
 */
export async function deleteProduct(id: string): Promise<DeleteProductResponse> {
  const res = await apiClient.delete<DeleteProductResponse>(`/products/${id}`);
  return res.data;
}
