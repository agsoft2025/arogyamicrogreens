"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import { logout as apiLogout } from "@/api/auth.api";

/* ── Session persistence helpers ────────────────────────────── */

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
    // localStorage unavailable (private browsing, etc.) — safe to ignore
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
    // Basic validity check — discard corrupt or old-format data
    if (!parsed?.user?.mobileNumber || !parsed?.user?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

/* ── Types ─────────────────────────────────────────────────── */

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
  /**
   * Where to redirect after a successful login.
   * null        = just close the modal (no redirect)
   * "/checkout" = came from cart → checkout flow
   * "/profile"  = came from profile icon click
   */
  redirectAfterLogin: string | null;
  /**
   * true while the initial localStorage restore is in flight.
   * Auth guards must wait for this to become false before making
   * any routing decisions to avoid a flash of incorrect state.
   */
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
  /** Restore session from localStorage — called once on app mount via SessionRestorer */
  restoreSession: () => void;
  openLoginModal: (redirectAfterLogin?: string) => void;
  closeLoginModal: () => void;
  /** Returns true if the current user has the "admin" role */
  isAdmin: () => boolean;
  /** Returns true if the current user has the "user" role */
  isUser: () => boolean;
}

/* ── Reducer ────────────────────────────────────────────────── */

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoginModalOpen: false,
        isRestoring: false,
        // keep redirectAfterLogin so the modal's setTimeout closure can read it
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
  isRestoring: true, // assume restore needed until proven otherwise
};

/* ── Context & Provider ─────────────────────────────────────── */

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Called by LoginModal after successful OTP verification.
   * Persists full user + token to localStorage and updates in-memory state.
   */
  const login = useCallback((user: User, token = "") => {
    persistSession(user, token);
    dispatch({ type: "LOGIN", payload: user });
  }, []);

  /**
   * Called from ProfilePage or any logout UI.
   * Clears localStorage, fires logout API to clear httpOnly cookie,
   * and resets in-memory auth state.
   */
  const logout = useCallback(() => {
    clearPersistedSession();
    dispatch({ type: "LOGOUT" });
    // Fire-and-forget — failure is non-critical (cookie will expire on its own)
    apiLogout().catch(() => {});
  }, []);

  /**
   * Restores auth state from localStorage on app cold-start.
   * Called once in Providers.tsx via SessionRestorer's useEffect.
   * Dispatches RESTORE_DONE (not RESTORE_SESSION) if no valid session found,
   * so guards know the restore attempt has completed.
   */
  const restoreSession = useCallback(() => {
    const session = loadPersistedSession();
    if (session) {
      dispatch({ type: "RESTORE_SESSION", payload: session.user });
    } else {
      dispatch({ type: "RESTORE_DONE" });
    }
  }, []);

  const openLoginModal = useCallback((redirectAfterLogin?: string) => {
    dispatch({ type: "OPEN_LOGIN_MODAL", redirectAfterLogin });
  }, []);

  const closeLoginModal = useCallback(() => {
    dispatch({ type: "CLOSE_LOGIN_MODAL" });
  }, []);

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

/* ── Hook ───────────────────────────────────────────────────── */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
