/**
 * hooks/useAdminOrder.ts
 * React hook for fetching a single admin order by ID.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAdminOrderById } from "@/api/admin.order.api";
import type { UseAdminOrderState } from "@/types/admin.order.types";
import type { ApiError } from "@/api/axios";

interface UseAdminOrderReturn extends UseAdminOrderState {
  refetch: () => void;
}

export function useAdminOrder(id: string | null): UseAdminOrderReturn {
  const [state, setState] = useState<UseAdminOrderState>({
    order: null,
    loading: !!id,
    error: null,
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchOrder = useCallback(async (orderId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await getAdminOrderById(orderId);
      if (!mountedRef.current) return;
      if (res.success && res.data) {
        setState({ order: res.data, loading: false, error: null });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: res.message ?? "Failed to load order.",
        }));
      }
    } catch (err) {
      if (!mountedRef.current) return;
      const apiErr = err as ApiError;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: apiErr?.message ?? "Failed to load order.",
      }));
    }
  }, []);

  useEffect(() => {
    if (id) fetchOrder(id);
    else setState({ order: null, loading: false, error: null });
  }, [id, fetchOrder]);

  const refetch = useCallback(() => {
    if (id) fetchOrder(id);
  }, [id, fetchOrder]);

  return { ...state, refetch };
}
