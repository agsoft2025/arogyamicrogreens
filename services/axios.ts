/**
 * api/axios.ts
 * Centralized HTTP client for all AgriNest API calls.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

/* -- Unauthorized handler --
 * Registered by AuthProvider on mount.
 * Called when token refresh fails -- triggers logout + redirect.
 * One-shot: cleared after first invocation to prevent duplicate logouts. */
let _onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: () => void): void {
  _onUnauthorized = handler;
}

export function unregisterUnauthorizedHandler(): void {
  _onUnauthorized = null;
}

/* -- Token refresh --
 * _refreshPromise deduplicates concurrent refreshes: if multiple requests
 * detect an expired token simultaneously, only one POST /auth/refresh-token
 * is sent; all callers share the same promise result. */
let _refreshPromise: Promise<string | null> | null = null;

/**
 * Updates the access token in localStorage without touching user data.
 * Called after a successful refresh so subsequent requests use the new token.
 */
export function updateStoredAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("agrinest_session");
    if (!raw) return;
    const session = JSON.parse(raw) as { token?: string };
    session.token = token;
    localStorage.setItem("agrinest_session", JSON.stringify(session));
  } catch {
    // safe to ignore
  }
}

/**
 * Calls POST /auth/refresh-token with the httpOnly refresh-token cookie.
 * On success, updates localStorage and returns the new access token.
 * On failure, returns null.
 *
 * Uses raw fetch (not apiClient) so it never enters the request() interceptor
 * and cannot trigger recursive refresh calls.
 */
async function performTokenRefresh(): Promise<string | null> {
  try {
    const response = await fetch(buildUrl("/auth/refresh-token"), {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) return null;
    const json = (await response.json()) as {
      data?: { accessToken?: string };
    };
    const newToken = json?.data?.accessToken ?? null;
    if (newToken) updateStoredAccessToken(newToken);
    return newToken;
  } catch {
    return null;
  }
}

/**
 * Returns the in-flight refresh promise if one exists, otherwise starts a new
 * one. Ensures concurrent expiry detections only trigger a single HTTP call.
 */
function getOrStartRefresh(): Promise<string | null> {
  if (!_refreshPromise) {
    _refreshPromise = performTokenRefresh().finally(() => {
      _refreshPromise = null;
    });
  }
  return _refreshPromise;
}

/**
 * Exported for use in authStore.restoreSession (cold-start expired-token check).
 */
export async function refreshAccessToken(): Promise<string | null> {
  return getOrStartRefresh();
}

/* -- Types -- */

export interface ApiError {
  success: false;
  message: string;
  /** HTTP status code (0 = network error, -1 = unexpected) */
  statusCode: number;
}

interface ApiResponse<T> {
  data: T;
}

interface RequestConfig {
  params?: Record<string, string | number | boolean | null | undefined>;
}

const HTTP_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input.",
  401: "You are not logged in. Please sign in.",
  403: "You don\'t have permission to perform this action.",
  404: "The requested resource was not found.",
  429: "Too many requests. Please wait a moment.",
  500: "Server error. Please try again later.",
  502: "Service unavailable. Please try again later.",
  503: "Service unavailable. Please try again later.",
};

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("agrinest_session");
    if (!raw) return null;
    const session = JSON.parse(raw) as { token?: string };
    return session.token ?? null;
  } catch {
    return null;
  }
}

/**
 * Returns true when the JWT exp claim is in the past (token is expired).
 * Returns false for malformed tokens — let the server decide.
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

function buildUrl(path: string, params?: RequestConfig["params"]): string {
  const normalizedBase = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(normalizedPath, normalizedBase);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export function buildApiError(err: unknown): ApiError {
  if (isApiError(err)) return err;
  if (process.env.NODE_ENV === "development") {
    console.error("[api] Unexpected error:", err);
  }
  return {
    success: false,
    message: "Something went wrong. Please try again.",
    statusCode: -1,
  };
}

function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as ApiError).success === false &&
    typeof (err as ApiError).message === "string" &&
    typeof (err as ApiError).statusCode === "number"
  );
}

/**
 * Core HTTP request function.
 *
 * Refresh strategy (two layers, never loops):
 *
 * Layer 1 — Pre-flight (this function):
 *   Before sending the request, check the token\'s exp claim.
 *   If already expired, refresh now and use the new token.
 *   After a pre-flight refresh, _isRetry is set to true so layer 2 is skipped.
 *
 * Layer 2 — Reactive 401 (backup):
 *   If the server returns 401 (e.g., clock-skew caused the pre-flight to miss
 *   expiry, or the token was revoked), refresh and retry once.
 *   _isRetry = true on the retry prevents a second refresh attempt.
 *
 * Loop prevention:
 *   - _isRetry is true after either layer fires — no third attempt.
 *   - performTokenRefresh uses raw fetch, so it never enters this function.
 *   - _refreshPromise deduplicates concurrent callers — one HTTP call per burst.
 */
async function request<T>(
  path: string,
  init: RequestInit = {},
  config?: RequestConfig,
  _isRetry = false
): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Local copy of retry flag — may be promoted to true by pre-flight refresh.
  let isRetry = _isRetry;

  // Read current stored token.
  let token = getStoredToken();

  // Layer 1: Pre-flight expiry check.
  // Refresh before the request if the token is expired, so we don\'t waste a
  // round-trip getting a guaranteed 401.
  if (token && !isRetry && isTokenExpired(token)) {
    const newToken = await getOrStartRefresh();
    if (newToken) {
      token = newToken; // use the fresh token for this request
      isRetry = true;  // skip layer-2 refresh if the server still returns 401
    } else {
      // Refresh token is expired/revoked -- end the session.
      if (_onUnauthorized) {
        const handler = _onUnauthorized;
        _onUnauthorized = null;
        handler();
      }
      throw {
        success: false,
        message: "Your session has expired. Please sign in again.",
        statusCode: 401,
      } satisfies ApiError;
    }
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, config?.params), {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    throw {
      success: false,
      message: "Network error. Please check your connection.",
      statusCode: 0,
    } satisfies ApiError;
  }

  if (!response.ok) {
    // Layer 2: Reactive 401 (backup for clock-skew / revoked tokens).
    if (response.status === 401 && headers.has("Authorization") && !isRetry) {
      const newToken = await getOrStartRefresh();

      if (newToken) {
        // Retry once with the fresh token.
        return request<T>(path, init, config, true);
      }

      // Refresh failed -- log the user out (one-shot to prevent duplicates).
      if (_onUnauthorized) {
        const handler = _onUnauthorized;
        _onUnauthorized = null;
        handler();
      }
    }

    const data = await parseJson<{ message?: string }>(response).catch(
      () => null
    );

    throw {
      success: false,
      message:
        data?.message ??
        HTTP_MESSAGES[response.status] ??
        `Unexpected error (${response.status})`,
      statusCode: response.status,
    } satisfies ApiError;
  }

  return { data: await parseJson<T>(response) };
}

export const apiClient = {
  get<T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return request<T>(path, { method: "GET" }, config);
  },

  post<T>(
    path: string,
    payload?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return request<T>(
      path,
      {
        method: "POST",
        body: payload === undefined ? undefined : JSON.stringify(payload),
      },
      config
    );
  },

  patch<T>(
    path: string,
    payload?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return request<T>(
      path,
      {
        method: "PATCH",
        body: payload === undefined ? undefined : JSON.stringify(payload),
      },
      config
    );
  },

  put<T>(
    path: string,
    payload?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return request<T>(
      path,
      {
        method: "PUT",
        body: payload === undefined ? undefined : JSON.stringify(payload),
      },
      config
    );
  },

  delete<T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return request<T>(path, { method: "DELETE" }, config);
  },
};

export async function safeRequest<T>(
  fn: () => Promise<T>
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: buildApiError(err) };
  }
}

export default apiClient;
