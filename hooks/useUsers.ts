/**
 * hooks/useUsers.ts
 * React hook for fetching the paginated user list from the real API.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getUsers } from "@/api/user.api";
import type {
  UserListParams,
  UseUsersState,
} from "@/types/user.types";
import type { ApiError } from "@/api/axios";

/* ── useUsers ────────────────────────────────────────────────── */

interface UseUsersOptions extends UserListParams {
  skip?: boolean;
}

interface UseUsersReturn extends UseUsersState {
  refetch: () => void;
  setParams: (next: Partial<UserListParams>) => void;
  params: UserListParams;
}

const DEFAULT_PARAMS: UserListParams = {
  page: 1,
  limit: 10,
};

export function useUsers(
  initialParams: UseUsersOptions = {}
): UseUsersReturn {
  const { skip = false, ...restInitial } = initialParams;

  const [params, setParamsState] = useState<UserListParams>({
    ...DEFAULT_PARAMS,
    ...restInitial,
  });

  const [state, setState] = useState<UseUsersState>({
    users: [],
    pagination: null,
    loading: !skip,
    error: null,
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchUsers = useCallback(
    async (currentParams: UserListParams) => {
      if (skip) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const res = await getUsers(currentParams);

        if (!mountedRef.current) return;

        if (res.success && res.data) {
          setState({
            users: res.data.items,
            pagination: res.data.pagination,
            loading: false,
            error: null,
          });
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: res.message ?? "Failed to load users.",
          }));
        }
      } catch (err) {
        if (!mountedRef.current) return;
        const apiErr = err as ApiError;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: apiErr?.message ?? "Failed to load users.",
        }));
      }
    },
    [skip]
  );

  useEffect(() => {
    fetchUsers(params);
  }, [params, fetchUsers]);

  const refetch = useCallback(() => {
    fetchUsers(params);
  }, [params, fetchUsers]);

  const setParams = useCallback((next: Partial<UserListParams>) => {
    setParamsState((prev) => ({ ...prev, ...next }));
  }, []);

  return { ...state, refetch, setParams, params };
}
