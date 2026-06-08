/**
 * lib/authApi.ts
 * Thin wrappers used by LoginModal — delegates to the real API layer.
 *
 * Preserves the call signatures that LoginModal expects so the UI
 * component needs only minimal changes.
 *
 * Real HTTP calls live in: @/api/auth.api.ts
 * Error handling lives in: @/api/axios.ts
 */

import * as authApiRaw from "@/api/auth.api";

/* ── Re-exported types (for backward compatibility) ─────────── */

export interface SendOtpRequest {
  mobileNumber: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
  name: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  user: {
    _id: string;
    mobileNumber: string;
    name: string;
    role: "user" | "admin";
    isMobileVerified: boolean;
  };
  /** JWT access token returned by the backend */
  token?: string;
  message?: string;
}

/* ── Wrappers ────────────────────────────────────────────────── */

/**
 * POST /api/v1/auth/send-otp
 * Sends an OTP to the given mobile number.
 * Throws ApiError on network or server failure.
 */
export async function sendOtp(
  data: SendOtpRequest
): Promise<SendOtpResponse> {
  const res = await authApiRaw.sendOtp({ mobileNumber: data.mobileNumber });
  return {
    success: res.success,
    message: res.message,
  };
}

/**
 * POST /api/v1/auth/verify-otp
 * Verifies the OTP and returns full user info + token.
 * Throws ApiError on failure.
 */
export async function verifyOtp(
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> {
  const res = await authApiRaw.verifyOtp({
    mobileNumber: data.mobileNumber,
    otp: data.otp,
    name: data.name,
  });

  return {
    success: res.success,
    user: {
      _id: res.data.user._id,
      mobileNumber: res.data.user.mobileNumber,
      name: res.data.user.name,
      role: res.data.user.role,
      isMobileVerified: res.data.user.isMobileVerified,
    },
    token: res.data.accessToken,
    message: res.message,
  };
}
