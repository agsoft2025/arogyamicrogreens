/**
 * types/wishlist.types.ts
 * Wishlist domain types — covers both guest (localStorage) and
 * authenticated (API) wishlist flows.
 */

/* ── Unified UI item ────────────────────────────────────────── */

/** Single wishlist item used throughout the UI regardless of source. */
export interface WishlistItem {
  productId: string;
  name: string;
  /** Effective unit price in INR */
  price: number;
  image: string;
  slug?: string;
  description?: string;
  badge?: string;
  badgeVariant?: "organic" | "popular" | "kit" | "new" | "sale";
}

/* ── Params for adding an item ──────────────────────────────── */

export interface AddWishlistItemParams {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug?: string;
  description?: string;
  badge?: string;
  badgeVariant?: WishlistItem["badgeVariant"];
}

/* ── Backend API shapes ─────────────────────────────────────── */

/** Populated product inside a wishlist item (backend .populate()) */
export interface WishlistPopulatedProduct {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  featuredImage?: string;
  slug?: string;
  shortDescription?: string;
}

/** A single wishlist item as returned by GET /wishlist */
export interface ApiWishlistItem {
  /** Always a populated Product object from the backend */
  productId: WishlistPopulatedProduct | string;
  /** Stored price at time of adding */
  price?: number;
}

/** The wishlist object returned by the API */
export interface ApiWishlist {
  _id?: string;
  userId?: string;
  items: ApiWishlistItem[];
}

/** Generic wishlist API response envelope */
export interface WishlistApiResponse {
  success: boolean;
  message: string;
  data?: ApiWishlist;
}
