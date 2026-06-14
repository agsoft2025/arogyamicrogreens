/**
 * product.types.ts
 * TypeScript types for products — mirrors the backend IProduct model
 * and product API request/response shapes.
 */

/* ── Domain ─────────────────────────────────────────────────── */

export type ProductStatus = "active" | "inactive" | "draft";

export type ProductCategory = "product" | "microgreen";

export interface ProductSeo {
  metaTitle?: string;
  metaDescription?: string;
}

export interface Product {
  /** MongoDB _id as string */
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: ProductCategory;
  price: number;
  salePrice?: number;
  stock: number;
  shortDescription?: string;
  description?: string;
  benefits: string[];
  images: string[];
  featuredImage?: string;
  weight?: number;
  weightUnit?: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  status: ProductStatus;
  tags: string[];
  seo?: ProductSeo;
  createdAt?: string;
  updatedAt?: string;
}

/* ── Query params ────────────────────────────────────────────── */

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus;
  category?: ProductCategory;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

/* ── Pagination ──────────────────────────────────────────────── */

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ── API Response shapes ─────────────────────────────────────── */

export interface ProductListData {
  items: Product[];
  pagination: Pagination;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: ProductListData;
}

export interface ProductSingleResponse {
  success: boolean;
  message: string;
  data: Product;
}

/* ── Create / Update payloads ────────────────────────────────── */

/**
 * Payload sent to POST /products.
 * Mirrors IProduct — all required fields must be present.
 */
export interface CreateProductPayload {
  name: string;
  slug: string;
  sku: string;
  category: ProductCategory;
  price: number;
  salePrice?: number;
  stock: number;
  shortDescription?: string;
  description?: string;
  benefits: string[];
  images: string[];
  featuredImage?: string;
  weight?: number;
  weightUnit?: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  status: ProductStatus;
  tags: string[];
  seo?: ProductSeo;
}

/**
 * Payload sent to PATCH /products/:id.
 * All fields are optional — only the ones that changed need to be sent.
 */
export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

/* ── Hook state ──────────────────────────────────────────────── */

export interface UseProductsState {
  products: Product[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

export interface UseProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
}
