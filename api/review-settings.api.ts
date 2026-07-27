import apiClient from "./axios";
import type { ReviewSettings, UpdateReviewSettingsPayload } from "@/types/review-settings.types";

/**
 * GET /review-settings
 * Public — no auth required.
 */
export async function getReviewSettings(): Promise<ReviewSettings> {
  const res = await apiClient.get<{ success: boolean; data: ReviewSettings }>(
    "/review-settings"
  );
  // apiClient wraps parsed JSON in { data: T }, so res.data is the full response body.
  // The actual settings object is at res.data.data.
  return res.data.data;
}

/**
 * PUT /review-settings
 * Admin only.
 */
export async function updateReviewSettings(
  payload: Partial<UpdateReviewSettingsPayload>
): Promise<ReviewSettings> {
  const res = await apiClient.put<{ success: boolean; data: ReviewSettings }>(
    "/review-settings",
    payload
  );
  return res.data.data;
}
