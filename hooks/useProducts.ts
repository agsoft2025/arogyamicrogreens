/**
 * hooks/useProducts.ts
 * React hooks for fetching product data from the real API.
 *
 * useProducts  — paginated product list with filters, loading, error, retry
 * useProduct   — single product by ID or slug
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getProducts, getProductById, getProductBySlug } from "@/api/product.api";
import type {
  Product,
  ProductListParams,
  Pagination,
  UseProductsState,
  UseProductState,
} from "@/types/product.types";
import type { ApiError } from "@/api/axios";

/* ── useProducts ─────────────────────────────────────────────── */

interface UseProductsOptions extends ProductListParams {
  /** Skip the fetch entirely (useful for SSR or conditional fetching) */
  skip?: boolean;
}

interface UseProductsReturn extends UseProductsState {
  /** Re-run the fetch with current params */
  refetch: () => void;
  /** Update filter params and re-fetch */
  setParams: (next: Partial<ProductListParams>) => void;
  /** Current active params */
  params: ProductListParams;
}

const DEFAULT_PARAMS: ProductListParams = {
  page: 1,
  limit: 12,
};

export function useProducts(
  initialParams: UseProductsOptions = {}
): UseProductsReturn {
  const { skip = false, ...restInitial } = initialParams;
  const [params, setParamsState] = useState<ProductListParams>({
    ...DEFAULT_PARAMS,
    ...restInitial,
  });
  const [state, setState] = useState<UseProductsState>({
    products: [],
    pagination: null,
    loading: !skip,
    error: null,
  });

  // Track whether the component is still mounted to prevent state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchProducts = useCallback(
    async (currentParams: ProductListParams) => {
      if (skip) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const res = await getProducts(currentParams);

        if (!mountedRef.current) return;

        if (res.success && res.data) {
          setState({
            products: res.data.items,
            pagination: res.data.pagination,
            loading: false,
            error: null,
          });
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: res.message ?? "Failed to load products.",
          }));
        }
      } catch (err) {
        if (!mountedRef.current) return;
        const apiErr = err as ApiError;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: apiErr?.message ?? "Failed to load products.",
        }));
      }
    },
    [skip]
  );

  // Fetch on mount and whenever params change
  useEffect(() => {
    fetchProducts(params);
  }, [params, fetchProducts]);

  const refetch = useCallback(() => {
    fetchProducts(params);
  }, [params, fetchProducts]);

  const setParams = useCallback((next: Partial<ProductListParams>) => {
    setParamsState((prev) => ({ ...prev, ...next }));
  }, []);

  return { ...state, refetch, setParams, params };
}

/* ── useProduct (single) ─────────────────────────────────────── */

interface UseProductOptions {
  id?: string;
  slug?: string;
  skip?: boolean;
}

interface UseProductReturn extends UseProductState {
  refetch: () => void;
}

export function useProduct({
  id,
  slug,
  skip = false,
}: UseProductOptions = {}): UseProductReturn {
  const [state, setState] = useState<UseProductState>({
    product: null,
    loading: !skip && !!(id || slug),
    error: null,
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchProduct = useCallback(async () => {
    if (skip || (!id && !slug)) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = id
        ? await getProductById(id)
        : await getProductBySlug(slug!);

      if (!mountedRef.current) return;

      if (res.success && res.data) {
        setState({ product: res.data, loading: false, error: null });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: res.message ?? "Product not found.",
        }));
      }
    } catch (err) {
      if (!mountedRef.current) return;
      const apiErr = err as ApiError;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: apiErr?.message ?? "Failed to load product.",
      }));
    }
  }, [id, slug, skip]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const refetch = useCallback(() => fetchProduct(), [fetchProduct]);

  return { ...state, refetch };
}

/* ── Utility: derive display price ──────────────────────────── */

/**
 * Returns the effective selling price for a product.
 * Uses salePrice if set and lower than price.
 */
export function getEffectivePrice(product: Product): number {
  if (product.salePrice !== undefined && product.salePrice < product.price) {
    return product.salePrice;
  }
  return product.price;
}
