/**
 * api/auth.api.ts
 * Raw HTTP calls for authentication endpoints.
 * All functions throw ApiError on failure — callers use safeRequest()
 * or catch the error themselves.
 */

import apiClient from "./axios";
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth.types";

/**
 * POST /auth/send-otp
 * Sends a one-time password to the given mobile number.
 */
export async function sendOtp(
  payload: SendOtpRequest
): Promise<SendOtpResponse> {
  const res = await apiClient.post<SendOtpResponse>("/auth/send-otp", payload);
  return res.data;
}

/**
 * POST /auth/verify-otp
 * Verifies the OTP. Creates a new user if they don't exist yet.
 * Returns user info + accessToken on success.
 * The server also sets an httpOnly cookie containing the same token.
 */
export async function verifyOtp(
  payload: VerifyOtpRequest
): Promise<VerifyOtpResponse> {
  const res = await apiClient.post<VerifyOtpResponse>(
    "/auth/verify-otp",
    payload
  );
  return res.data;
}

/**
 * POST /auth/logout
 * Clears the httpOnly auth cookie on the server.
 */
export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
