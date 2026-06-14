/**
 * hooks/useAdminOrders.ts
 * React hook for the paginated admin order list.
 * Follows the same pattern as useUsers.ts.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAdminOrders } from "@/api/admin.order.api";
import type {
  AdminOrderListParams,
  UseAdminOrdersState,
  AdminOrderPagination,
  AdminOrder,
} from "@/types/admin.order.types";
import type { ApiError } from "@/api/axios";

interface UseAdminOrdersOptions extends AdminOrderListParams {
  skip?: boolean;
}

interface UseAdminOrdersReturn extends UseAdminOrdersState {
  refetch: () => void;
  setParams: (next: Partial<AdminOrderListParams>) => void;
  params: AdminOrderListParams;
}

const DEFAULT_PARAMS: AdminOrderListParams = {
  page: 1,
  limit: 10,
};

export function useAdminOrders(
  initialParams: UseAdminOrdersOptions = {}
): UseAdminOrdersReturn {
  const { skip = false, ...restInitial } = initialParams;

  const [params, setParamsState] = useState<AdminOrderListParams>({
    ...DEFAULT_PARAMS,
    ...restInitial,
  });

  const [state, setState] = useState<UseAdminOrdersState>({
    orders: [],
    pagination: null,
    loading: !skip,
    error: null,
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchOrders = useCallback(
    async (currentParams: AdminOrderListParams) => {
      if (skip) return;
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const res = await getAdminOrders(currentParams);
        if (!mountedRef.current) return;
        if (res.success && res.data) {
          setState({
            orders: res.data.orders,
            pagination: res.data.pagination,
            loading: false,
            error: null,
          });
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: res.message ?? "Failed to load orders.",
          }));
        }
      } catch (err) {
        if (!mountedRef.current) return;
        const apiErr = err as ApiError;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: apiErr?.message ?? "Failed to load orders.",
        }));
      }
    },
    [skip]
  );

  useEffect(() => {
    fetchOrders(params);
  }, [params, fetchOrders]);

  const refetch = useCallback(() => {
    fetchOrders(params);
  }, [params, fetchOrders]);

  const setParams = useCallback((next: Partial<AdminOrderListParams>) => {
    setParamsState((prev) => ({ ...prev, ...next }));
  }, []);

  return { ...state, refetch, setParams, params };
}
