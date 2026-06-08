/**
 * auth.types.ts
 * All TypeScript types for authentication — mirrors the backend IUser model
 * and auth API request/response shapes.
 */

/* ── Domain ─────────────────────────────────────────────────── */

export interface User {
  /** MongoDB _id as string */
  _id: string;
  name: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

/* ── API Request shapes ──────────────────────────────────────── */

export interface SendOtpRequest {
  mobileNumber: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
  /** Required for new users (first login = registration) */
  name: string;
}

/* ── API Response shapes ─────────────────────────────────────── */

/** Generic backend envelope */
export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SendOtpResponse extends ApiResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponseData {
  user: User;
  accessToken: string;
}

export interface VerifyOtpResponse extends ApiResponse<VerifyOtpResponseData> {
  data: VerifyOtpResponseData;
}

/* ── Persisted session (localStorage) ───────────────────────── */

export interface PersistedSession {
  user: User;
  token: string;
  expiresAt: number; // unix ms — for future token-expiry checks
}

/* ── Auth context value ──────────────────────────────────────── */

export interface AuthContextUser {
  mobileNumber: string;
  name: string;
}
