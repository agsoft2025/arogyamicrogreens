/**
 * types/cart.types.ts
 * Cart domain types — covers both guest (localStorage) and
 * authenticated (API) cart flows.
 */

/* ── Unified UI item ────────────────────────────────────────── */

/** Single cart item used throughout the UI regardless of cart source. */
export interface CartItem {
  productId: string;
  name: string;
  /** Effective unit price in INR (salePrice if available, else price) */
  price: number;
  quantity: number;
  image: string;
  slug?: string;
}

/* ── Backend API shapes ─────────────────────────────────────── */

/** Populated product object returned inside cart items by GET /cart */
export interface PopulatedProduct {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  featuredImage?: string;
  slug?: string;
}

/** A single item as returned by the cart API.
 *  productId is always a populated Product object (backend uses .populate()).
 *  Cart items have no _id (schema uses { _id: false }).
 */
export interface ApiCartItem {
  /** Always a populated Product object — backend populates items.productId on every read */
  productId: PopulatedProduct | string;
  quantity: number;
  /** Stored price at time of adding to cart */
  price?: number;
  /** Stored sale price at time of adding to cart */
  salePrice?: number;
}

/** The cart object returned by GET /api/v1/cart */
export interface ApiCart {
  _id?: string;
  userId?: string;
  items: ApiCartItem[];
  total?: number;
}

/** Generic cart API response envelope */
export interface CartApiResponse {
  success: boolean;
  message: string;
  data?: ApiCart;
}
