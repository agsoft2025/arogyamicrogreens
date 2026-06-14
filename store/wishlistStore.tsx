"use client";

/**
 * store/wishlistStore.tsx
 *
 * Wishlist state — backed entirely by localStorage.
 * Works for both guest and authenticated users.
 *
 * NOTE: There is currently no backend wishlist API. All data is persisted
 * in localStorage under the key "agrinest_wishlist". When a wishlist API
 * is added in the future, the API sync layer can be wired in here without
 * changing any consumer component.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import type {
  WishlistItem,
  AddWishlistItemParams,
} from "@/types/wishlist.types";

/* ── localStorage helpers ────────────────────────────────────── */

const WISHLIST_KEY = "agrinest_wishlist";

function readStorage(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WishlistItem[];
  } catch {
    return [];
  }
}

function writeStorage(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch {
    /* localStorage unavailable */
  }
}

/* ── State & reducer ─────────────────────────────────────────── */

interface WishlistState {
  items: WishlistItem[];
  error: string | null;
}

type WishlistAction =
  | { type: "SET_ITEMS"; items: WishlistItem[] }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

function wishlistReducer(
  state: WishlistState,
  action: WishlistAction
): WishlistState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.items, error: null };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "RESET":
      return { items: [], error: null };
    default:
      return state;
  }
}

const initialState: WishlistState = { items: [], error: null };

/* ── Context shape ───────────────────────────────────────────── */

export interface WishlistContextValue extends WishlistState {
  /** Total number of items in the wishlist — used for the navbar badge. */
  count: number;
  loading: false;
  syncing: false;
  syncError: null;
  isInWishlist: (productId: string) => boolean;
  addItem: (params: AddWishlistItemParams) => void;
  removeItem: (productId: string) => void;
  toggleItem: (params: AddWishlistItemParams) => void;
  clearWishlist: () => void;
  refetch: () => void;
  clearError: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

/* ── Provider ────────────────────────────────────────────────── */

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  /* Load from localStorage on mount (client only) */
  useEffect(() => {
    dispatch({ type: "SET_ITEMS", items: readStorage() });
  }, []);

  /* ── Mutations — synchronous, localStorage-backed ───────────── */

  const addItem = useCallback((params: AddWishlistItemParams) => {
    dispatch({ type: "SET_ERROR", error: null });
    const current = readStorage();
    // Dedup — no-op if already saved
    if (current.some((i) => i.productId === params.productId)) return;
    const updated: WishlistItem[] = [
      ...current,
      {
        productId: params.productId,
        name: params.name,
        price: params.price,
        image: params.image,
        slug: params.slug,
        description: params.description,
        badge: params.badge,
        badgeVariant: params.badgeVariant,
      },
    ];
    writeStorage(updated);
    dispatch({ type: "SET_ITEMS", items: updated });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "SET_ERROR", error: null });
    const updated = readStorage().filter((i) => i.productId !== productId);
    writeStorage(updated);
    dispatch({ type: "SET_ITEMS", items: updated });
  }, []);

  const toggleItem = useCallback(
    (params: AddWishlistItemParams) => {
      const inList = readStorage().some((i) => i.productId === params.productId);
      if (inList) removeItem(params.productId);
      else addItem(params);
    },
    [addItem, removeItem]
  );

  const clearWishlist = useCallback(() => {
    writeStorage([]);
    dispatch({ type: "SET_ITEMS", items: [] });
  }, []);

  const refetch = useCallback(() => {
    dispatch({ type: "SET_ITEMS", items: readStorage() });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", error: null });
  }, []);

  /* ── Derived ─────────────────────────────────────────────────── */

  const isInWishlist = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items]
  );

  const contextValue: WishlistContextValue = {
    ...state,
    count: state.items.length,
    // Keep these in the interface for future API integration
    loading: false,
    syncing: false,
    syncError: null,
    isInWishlist,
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
    refetch,
    clearError,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

/* ── Consumer hook ───────────────────────────────────────────── */

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used inside <WishlistProvider>");
  }
  return ctx;
}
