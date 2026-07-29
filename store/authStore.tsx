"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { logout as apiLogout } from "@/services/auth.api";
import {
  registerUnauthorizedHandler,
  unregisterUnauthorizedHandler,
  refreshAccessToken,
} from "@/services/axios";

/* -- Session persistence helpers -- */

const SESSION_KEY = "agrinest_session";

interface PersistedSession {
  user: User;
  token: string;
}

function persistSession(user: User, token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
  } catch {
    // safe to ignore
  }
}

function clearPersistedSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // safe to ignore
  }
}

function loadPersistedSession(): PersistedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedSession;
    if (!parsed?.user?.mobileNumber || !parsed?.user?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

/* -- JWT expiry helper -- */

/**
 * Decodes the JWT payload (client-side, no library) and returns the
 * exp claim in milliseconds, or null if the token is malformed.
 */
function getTokenExpMs(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

/* -- Types -- */

export interface User {
  _id: string;
  name: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  role: "user" | "admin";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoginModalOpen: boolean;
  redirectAfterLogin: string | null;
  isRestoring: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "RESTORE_SESSION"; payload: User }
  | { type: "RESTORE_DONE" }
  | { type: "OPEN_LOGIN_MODAL"; redirectAfterLogin?: string }
  | { type: "CLOSE_LOGIN_MODAL" };

export interface AuthContextValue extends AuthState {
  login: (user: User, token?: string) => void;
  logout: () => void;
  restoreSession: () => void;
  openLoginModal: (redirectAfterLogin?: string) => void;
  closeLoginModal: () => void;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

/* -- Reducer -- */

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoginModalOpen: false,
        isRestoring: false,
      };
    case "RESTORE_SESSION":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoginModalOpen: false,
        isRestoring: false,
      };
    case "RESTORE_DONE":
      return { ...state, isRestoring: false };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        redirectAfterLogin: null,
        isRestoring: false,
      };
    case "OPEN_LOGIN_MODAL":
      return {
        ...state,
        isLoginModalOpen: true,
        redirectAfterLogin: action.redirectAfterLogin ?? null,
      };
    case "CLOSE_LOGIN_MODAL":
      return {
        ...state,
        isLoginModalOpen: false,
        redirectAfterLogin: null,
      };
    default:
      return state;
  }
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoginModalOpen: false,
  redirectAfterLogin: null,
  isRestoring: true,
};

/* -- Context & Provider -- */

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Guard that prevents restoreSession from running concurrently.
   * React 18 Strict Mode double-invokes effects in development, which would
   * otherwise fire two simultaneous refresh requests -- the second using the
   * already-rotated refresh token and failing, causing a spurious logout.
   */
  const isRestoringRef = useRef(false);

  /** Shared redirect used by the unauthorized handler. */
  const redirectToHome = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  /** Clears localStorage and in-memory auth state. */
  const logout = useCallback(() => {
    clearPersistedSession();
    dispatch({ type: "LOGOUT" });
    // Fire-and-forget -- failure is non-critical; cookie expires on its own
    apiLogout().catch(() => {});
  }, []);

  /**
   * Called by LoginModal after successful OTP verification.
   * Persists user + token and updates auth state.
   *
   * Token refresh is handled lazily by axios.ts:
   *   - Pre-flight check: refreshes before the next API call if the token is expired
   *   - Reactive 401: retries the call once with a fresh token if the server rejects it
   */
  const login = useCallback((user: User, token = "") => {
    persistSession(user, token);
    dispatch({ type: "LOGIN", payload: user });
  }, []);

  /**
   * Restores auth state from localStorage on app cold-start.
   *
   * If the stored access token is expired, attempts a silent refresh before
   * restoring state. If the refresh token is also expired, clears the session
   * and lets the user log in again.
   *
   * Token refresh during active use is handled by axios.ts (pre-flight check
   * + reactive 401 interceptor) -- no polling or timers are needed here.
   */
  const restoreSession = useCallback(async () => {
    // Prevent concurrent invocations (React Strict Mode double-effect guard).
    if (isRestoringRef.current) return;
    isRestoringRef.current = true;

    try {
      const session = loadPersistedSession();

      if (!session) {
        dispatch({ type: "RESTORE_DONE" });
        return;
      }

      const expMs = session.token ? getTokenExpMs(session.token) : null;

      if (expMs !== null && expMs <= Date.now()) {
        // Access token is expired -- attempt a silent refresh.
        const newToken = await refreshAccessToken();

        if (newToken) {
          // Refresh succeeded: restore the session with the fresh access token.
          dispatch({ type: "RESTORE_SESSION", payload: session.user });
        } else {
          // Refresh token is also expired/revoked -- clear the stale session.
          clearPersistedSession();
          dispatch({ type: "RESTORE_DONE" });
        }
        return;
      }

      // Access token is still valid (or we cannot decode it) -- restore directly.
      // axios.ts will refresh it lazily when it next expires.
      dispatch({ type: "RESTORE_SESSION", payload: session.user });
    } finally {
      isRestoringRef.current = false;
    }
  }, []);

  const openLoginModal = useCallback((redirectAfterLogin?: string) => {
    dispatch({ type: "OPEN_LOGIN_MODAL", redirectAfterLogin });
  }, []);

  const closeLoginModal = useCallback(() => {
    dispatch({ type: "CLOSE_LOGIN_MODAL" });
  }, []);

  /**
   * Registers a fallback 401 handler with the API client.
   * Fires when an authenticated request returns 401 after token refresh has
   * already been attempted and failed (e.g., refresh token revoked server-side).
   */
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout();
      redirectToHome();
    });
    return () => {
      unregisterUnauthorizedHandler();
    };
  }, [logout, redirectToHome]);

  const isAdmin = useCallback(
    () => state.isAuthenticated && state.user?.role === "admin",
    [state.isAuthenticated, state.user]
  );

  const isUser = useCallback(
    () => state.isAuthenticated && state.user?.role === "user",
    [state.isAuthenticated, state.user]
  );

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    restoreSession,
    openLoginModal,
    closeLoginModal,
    isAdmin,
    isUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* -- Hook -- */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
