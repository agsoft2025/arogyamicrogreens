/**
 * api/axios.ts
 * Centralized HTTP client for all AgriNest API calls.
 *
 * This keeps the small Axios-like surface used by the app while avoiding a
 * server-prerender issue where Turbopack compiled the Axios value import away.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

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
  403: "You don't have permission to perform this action.",
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

async function request<T>(
  path: string,
  init: RequestInit = {},
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredToken();
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
    const data = await parseJson<{ message?: string }>(response).catch(() => null);

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
