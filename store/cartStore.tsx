"use client";

/**
 * store/cartStore.tsx
 *
 * Unified cart state for both guest and authenticated users.
 *
 * Guest  → localStorage (key: "agrinest_cart")
 * Auth   → Cart API  (GET / POST / PUT / DELETE /api/v1/cart)
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
import { getProductImageUrl } from "@/lib/imageUtils";

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
    /* localStorage unavailable */
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

function normalizeApiItems(apiItems: ApiCartItem[]): CartItem[] {
  return mergeCartItems(
    apiItems
      .map((item): CartItem | null => {
        if (typeof item.productId !== "object" || item.productId === null) {
          return null;
        }
        const p = item.productId as PopulatedProduct;
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
          quantity: Number(item.quantity),
          image: getProductImageUrl(p.featuredImage ?? p.images?.[0]),
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
  syncing: boolean;
  syncError: string | null;
  error: string | null;
}

type CartAction =
  | { type: "SET_ITEMS"; items: CartItem[] }
  | { type: "UPDATE_ITEM_QTY"; productId: string; quantity: number }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_SYNCING"; syncing: boolean }
  | { type: "SET_SYNC_ERROR"; error: string | null }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: mergeCartItems(action.items), loading: false, error: null };
    case "UPDATE_ITEM_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_SYNCING":
      return { ...state, syncing: action.syncing };
    case "SET_SYNC_ERROR":
      return { ...state, syncError: action.error };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "RESET":
      return { items: [], loading: false, syncing: false, syncError: null, error: null };
    default:
      return state;
  }
}

const initialCartState: CartState = {
  items: [],
  loading: false,
  syncing: false,
  syncError: null,
  error: null,
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
  count: number;
  subtotal: number;
  addItem: (params: AddItemParams, quantity?: number) => Promise<void>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/* ── Provider ────────────────────────────────────────────────── */

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isRestoring } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const prevAuthRef = useRef<boolean | null>(null);
  const fetchingRef = useRef(false);

  /**
   * Per-product sequence counter — discards out-of-order API responses.
   * Before each updateCartItem call we increment and capture seqAtCall.
   * On response, if the stored value no longer matches, a newer call
   * was already sent; we discard this stale response.
   */
  const qtySeqRef = useRef<Map<string, number>>(new Map());

  /* ── Fetch from API ─────────────────────────────────────────── */
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

  /* ── Sync guest cart → API after login ──────────────────────── */
  const syncGuestCartToApi = useCallback(async () => {
    const guestItems = readGuestCart();
    if (guestItems.length === 0) {
      await fetchApiCart();
      return;
    }
    dispatch({ type: "SET_SYNCING", syncing: true });
    dispatch({ type: "SET_SYNC_ERROR", error: null });
    let syncFailed = false;
    try {
      await Promise.all(
        guestItems.map((item) =>
          addToCart(item.productId, item.quantity).catch(() => {})
        )
      );
      deleteGuestCart();
    } catch {
      syncFailed = true;
      dispatch({
        type: "SET_SYNC_ERROR",
        error: "Some cart items could not be synced. Please review your cart.",
      });
    } finally {
      dispatch({ type: "SET_SYNCING", syncing: false });
    }
    await fetchApiCart();
    if (syncFailed) return;
  }, [fetchApiCart]);

  /* ── Watch auth state transitions ───────────────────────────── */
  useEffect(() => {
    if (isRestoring) return;
    const prev = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;
    if (prev === null) {
      if (isAuthenticated) {
        fetchApiCart();
      } else {
        dispatch({ type: "SET_ITEMS", items: readGuestCart() });
      }
    } else if (!prev && isAuthenticated) {
      syncGuestCartToApi();
    } else if (prev && !isAuthenticated) {
      dispatch({ type: "RESET" });
      dispatch({ type: "SET_ITEMS", items: readGuestCart() });
    }
  }, [isAuthenticated, isRestoring, fetchApiCart, syncGuestCartToApi]);

  /* ── Cart mutations ──────────────────────────────────────────── */

  const addItem = useCallback(
    async (params: AddItemParams, quantity = 1) => {
      dispatch({ type: "SET_ERROR", error: null });
      if (!isAuthenticated) {
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
        try {
          const existing = state.items.find(
            (i) => i.productId === params.productId
          );
          const res = existing
            ? await updateCartItem(params.productId, existing.quantity + quantity)
            : await addToCart(params.productId, quantity);
          if (res.success && res.data?.items) {
            dispatch({ type: "SET_ITEMS", items: normalizeApiItems(res.data.items) });
          } else {
            dispatch({ type: "SET_ERROR", error: res.message || "Failed to add item to cart" });
          }
        } catch (err: any) {
          dispatch({ type: "SET_ERROR", error: err?.message || "Failed to add item to cart. Please try again." });
        }
      }
    },
    [isAuthenticated, state.items]
  );

  const updateQty = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) return;
      dispatch({ type: "SET_ERROR", error: null });
      if (!isAuthenticated) {
        const current = readGuestCart();
        const updated = current.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
        writeGuestCart(updated);
        dispatch({ type: "SET_ITEMS", items: updated });
      } else {
        // Optimistic update via reducer — safe from stale closure
        dispatch({ type: "UPDATE_ITEM_QTY", productId, quantity });
        // Sequence guard — discard out-of-order responses
        const seqAtCall = (qtySeqRef.current.get(productId) ?? 0) + 1;
        qtySeqRef.current.set(productId, seqAtCall);
        try {
          const res = await updateCartItem(productId, quantity);
          if (qtySeqRef.current.get(productId) !== seqAtCall) return;
          qtySeqRef.current.delete(productId);
          if (res.success && res.data?.items) {
            dispatch({ type: "SET_ITEMS", items: normalizeApiItems(res.data.items) });
          } else {
            await fetchApiCart();
            dispatch({ type: "SET_ERROR", error: res.message || "Failed to update quantity" });
          }
        } catch (err: any) {
          if (qtySeqRef.current.get(productId) !== seqAtCall) return;
          qtySeqRef.current.delete(productId);
          await fetchApiCart();
          dispatch({ type: "SET_ERROR", error: err?.message || "Failed to update quantity. Please try again." });
        }
      }
    },
    [isAuthenticated, fetchApiCart]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      dispatch({ type: "SET_ERROR", error: null });
      if (!isAuthenticated) {
        const current = readGuestCart();
        const updated = current.filter((i) => i.productId !== productId);
        writeGuestCart(updated);
        dispatch({ type: "SET_ITEMS", items: updated });
      } else {
        const optimistic = state.items.filter((i) => i.productId !== productId);
        dispatch({ type: "SET_ITEMS", items: optimistic });
        try {
          const res = await removeFromCart(productId);
          if (res.success && res.data?.items) {
            dispatch({ type: "SET_ITEMS", items: normalizeApiItems(res.data.items) });
          } else {
            await fetchApiCart();
            dispatch({ type: "SET_ERROR", error: res.message || "Failed to remove item from cart" });
          }
        } catch (err: any) {
          await fetchApiCart();
          dispatch({ type: "SET_ERROR", error: err?.message || "Failed to remove item from cart. Please try again." });
        }
      }
    },
    [isAuthenticated, state.items, fetchApiCart]
  );

  const clearCart = useCallback(async () => {
    dispatch({ type: "SET_ERROR", error: null });
    if (!isAuthenticated) {
      deleteGuestCart();
      dispatch({ type: "SET_ITEMS", items: [] });
    } else {
      const prev = state.items;
      dispatch({ type: "SET_ITEMS", items: [] });
      try {
        const res = await clearApiCart();
        if (!res.success) {
          dispatch({ type: "SET_ITEMS", items: prev });
          dispatch({ type: "SET_ERROR", error: res.message || "Failed to clear cart" });
        }
      } catch (err: any) {
        dispatch({ type: "SET_ITEMS", items: prev });
        dispatch({ type: "SET_ERROR", error: err?.message || "Failed to clear cart. Please try again." });
      }
    }
  }, [isAuthenticated, state.items]);

  const refetch = useCallback(async () => {
    if (isAuthenticated) {
      await fetchApiCart();
    } else {
      dispatch({ type: "SET_ITEMS", items: readGuestCart() });
    }
  }, [isAuthenticated, fetchApiCart]);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", error: null });
  }, []);

  /* ── Derived values ──────────────────────────────────────────── */
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /* ── Context value ───────────────────────────────────────────── */
  const contextValue: CartContextValue = {
    ...state,
    count,
    subtotal,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    refetch,
    clearError,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

/* ── Consumer hook ───────────────────────────────────────────── */

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}
