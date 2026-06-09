"use client";

/**
 * store/cartStore.tsx
 *
 * Unified cart state for both guest and authenticated users.
 *
 * Guest  → localStorage (key: "agrinest_cart")
 * Auth   → Cart API  (GET / POST / PUT / DELETE /api/v1/cart)
 *
 * Synchronization flow (login event):
 *   1. Auth state changes: isAuthenticated false → true
 *   2. Read guest items from localStorage
 *   3. If items exist: POST each item to /api/v1/cart
 *   4. Clear localStorage cart
 *   5. GET /api/v1/cart → update in-memory state
 *
 * Logout:
 *   - Clear in-memory API cart state
 *   - Load fresh from localStorage (empty for new guest session)
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "@/store/authStore";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearApiCart,
} from "@/api/cart.api";
import type { CartItem, ApiCartItem, PopulatedProduct } from "@/types/cart.types";

/* ── localStorage helpers ────────────────────────────────────── */

const GUEST_CART_KEY = "agrinest_cart";

function mergeCartItems(items: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of items) {
    const existing = merged.get(item.productId);
    if (existing) {
      merged.set(item.productId, {
        ...existing,
        ...item,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      merged.set(item.productId, item);
    }
  }

  return Array.from(merged.values());
}

function readGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    return mergeCartItems(JSON.parse(raw) as CartItem[]);
  } catch {
    return [];
  }
}

function writeGuestCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(mergeCartItems(items)));
  } catch {
    /* localStorage unavailable — ignore */
  }
}

function deleteGuestCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    /* ignore */
  }
}

/* ── API response normalizer ─────────────────────────────────── */

function resolveProductImage(product: PopulatedProduct): string {
  const src = product.featuredImage ?? product.images?.[0];
  if (!src) return "/images/placeholder-product.jpg";
  if (src.startsWith("http")) return src;
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";
  return `${base.replace("/api/v1", "")}/uploads/${src}`;
}

function normalizeApiItems(apiItems: ApiCartItem[]): CartItem[] {
  return mergeCartItems(
    apiItems
      .map((item): CartItem | null => {
        // Backend always populates items.productId — skip if not populated
        if (typeof item.productId !== "object" || item.productId === null) {
          return null;
        }
        const p = item.productId as PopulatedProduct;

        // Use item-level price/salePrice (stored at add-time) when available,
        // otherwise fall back to current product prices
        const basePrice = item.price ?? p.price;
        const salePriceVal = item.salePrice ?? p.salePrice;
        const effectivePrice =
          salePriceVal !== undefined && salePriceVal < basePrice
            ? salePriceVal
            : basePrice;

        return {
          productId: p._id,
          name: p.name,
          price: effectivePrice,
          quantity: item.quantity,
          image: resolveProductImage(p),
          slug: p.slug,
        };
      })
      .filter((x): x is CartItem => x !== null)
  );
}

/* ── State & reducer ─────────────────────────────────────────── */

interface CartState {
  items: CartItem[];
  loading: boolean;
  /** true while syncing guest localStorage cart → backend after login */
  syncing: boolean;
  /** non-null when sync failed — guest items are preserved */
  syncError: string | null;
}

type CartAction =
  | { type: "SET_ITEMS"; items: CartItem[] }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_SYNCING"; syncing: boolean }
  | { type: "SET_SYNC_ERROR"; error: string | null }
  | { type: "RESET" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: mergeCartItems(action.items), loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_SYNCING":
      return { ...state, syncing: action.syncing };
    case "SET_SYNC_ERROR":
      return { ...state, syncError: action.error };
    case "RESET":
      return { items: [], loading: false, syncing: false, syncError: null };
    default:
      return state;
  }
}

const initialCartState: CartState = {
  items: [],
  loading: false,
  syncing: false,
  syncError: null,
};

/* ── Context shape ───────────────────────────────────────────── */

export interface AddItemParams {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug?: string;
}

export interface CartContextValue extends CartState {
  /** Sum of all item quantities */
  count: number;
  /** Sum of (price × quantity) for all items */
  subtotal: number;
  addItem: (params: AddItemParams, quantity?: number) => Promise<void>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  /** Force refresh (API fetch or localStorage reload) */
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

/* ── Provider ────────────────────────────────────────────────── */

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isRestoring } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  /**
   * Tracks previous isAuthenticated value so we can detect transitions.
   * null = not yet initialized (before first effect run after restore).
   */
  const prevAuthRef = useRef<boolean | null>(null);
  /** Guard against concurrent fetchApiCart() calls */
  const fetchingRef = useRef(false);

  /* ── Fetch from API ────────────────────────────────────────── */
  const fetchApiCart = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const res = await getCart();
      dispatch({
        type: "SET_ITEMS",
        items: res.success && res.data?.items
          ? normalizeApiItems(res.data.items)
          : [],
      });
    } catch {
      dispatch({ type: "SET_ITEMS", items: [] });
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  /* ── Sync guest cart → API after login ─────────────────────── */
  const syncGuestCartToApi = useCallback(async () => {
    const guestItems = readGuestCart();

    if (guestItems.length === 0) {
      // Nothing to sync — just pull fresh API cart
      await fetchApiCart();
      return;
    }

    dispatch({ type: "SET_SYNCING", syncing: true });
    dispatch({ type: "SET_SYNC_ERROR", error: null });

    let syncFailed = false;
    try {
      // Push all guest items in parallel (failures are non-fatal per item)
      await Promise.all(
        guestItems.map((item) =>
          addToCart(item.productId, item.quantity).catch(() => {
            // Duplicate or invalid product — backend decides, we continue
          })
        )
      );
      deleteGuestCart();
    } catch {
      syncFailed = true;
      dispatch({
        type: "SET_SYNC_ERROR",
        error:
          "Some cart items could not be synced. Please review your cart.",
      });
      // Keep localStorage on sync failure so nothing is lost
    } finally {
      dispatch({ type: "SET_SYNCING", syncing: false });
    }

    // Refresh from API regardless of sync outcome
    await fetchApiCart();

    if (syncFailed) return;
  }, [fetchApiCart]);

  /* ── Watch auth state transitions ───────────────────────────── */
  useEffect(() => {
    // Wait until the session restore attempt completes
    if (isRestoring) return;

    const prev = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    if (prev === null) {
      // ── Initial load (after session restore) ──────────────────
      if (isAuthenticated) {
        fetchApiCart();
      } else {
        dispatch({ type: "SET_ITEMS", items: readGuestCart() });
      }
    } else if (!prev && isAuthenticated) {
      // ── Logged in ─────────────────────────────────────────────
      syncGuestCartToApi();
    } else if (prev && !isAuthenticated) {
      // ── Logged out ────────────────────────────────────────────
      dispatch({ type: "RESET" });
      dispatch({ type: "SET_ITEMS", items: readGuestCart() });
    }
  }, [isAuthenticated, isRestoring, fetchApiCart, syncGuestCartToApi]);

  /* ── Cart mutations ──────────────────────────────────────────── */

  const addItem = useCallback(
    async (params: AddItemParams, quantity = 1) => {
      if (!isAuthenticated) {
        // Guest: merge into localStorage
        const current = readGuestCart();
        const idx = current.findIndex((i) => i.productId === params.productId);
        const updated =
          idx >= 0
            ? current.map((i, j) =>
                j === idx ? { ...i, quantity: i.quantity + quantity } : i
              )
            : [...current, { ...params, quantity }];
        writeGuestCart(updated);
        dispatch({ type: "SET_ITEMS", items: updated });
      } else {
        // Auth: API call then sync state from response
        try {
          const res = await addToCart(params.productId, quantity);
          if (res.success && res.data?.items) {
            dispatch({
              type: "SET_ITEMS",
              items: normalizeApiItems(res.data.items),
            });
          }
        } catch {
          /* no-op — add failed silently */
        }
      }
    },
    [isAuthenticated]
  );

  const updateQty = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) return;

      if (!isAuthenticated) {
        const updated = state.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
        writeGuestCart(updated);
        dispatch({ type: "SET_ITEMS", items: updated });
      } else {
        try {
          const res = await updateCartItem(productId, quantity);
          if (res.success && res.data?.items) {
            dispatch({
              type: "SET_ITEMS",
              items: normalizeApiItems(res.data.items),
            });
          }
        } catch {
          /* no-op */
        }
      }
    },
    [isAuthenticated, state.items]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) {
        const updated = state.items.filter((i) => i.productId !== productId);
        writeGuestCart(updated);
        dispatch({ type: "SET_ITEMS", items: updated });
      } else {
        // Optimistic update for snappy UX
        const optimistic = state.items.filter(
          (i) => i.productId !== productId
        );
        dispatch({ type: "SET_ITEMS", items: optimistic });
        try {
          const res = await removeFromCart(productId);
          if (res.success && res.data?.items) {
            dispatch({
              type: "SET_ITEMS",
              items: normalizeApiItems(res.data.items),
            });
          }
        } catch {
          /* keep optimistic state */
        }
      }
    },
    [isAuthenticated, state.items]
  );

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      deleteGuestCart();
      dispatch({ type: "SET_ITEMS", items: [] });
    } else {
      try {
        await clearApiCart();
      } catch {
        /* no-op */
      }
      dispatch({ type: "SET_ITEMS", items: [] });
    }
  }, [isAuthenticated]);

  const refetch = useCallback(async () => {
    if (isAuthenticated) {
      await fetchApiCart();
    } else {
      dispatch({ type: "SET_ITEMS", items: readGuestCart() });
    }
  }, [isAuthenticated, fetchApiCart]);

  /* ── Derived values ──────────────────────────────────────────── */
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const value: CartContextValue = {
    ...state,
    count,
    subtotal,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    refetch,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

/* ── Hook ────────────────────────────────────────────────────── */

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
