import apiClient from "./axios";
import type {
  Review,
  ReviewsPage,
  CreateReviewPayload,
  UpdateReviewPayload,
} from "@/types/review.types";

export async function getProductReviews(
  productId: string,
  page = 1,
  limit = 10
): Promise<ReviewsPage> {
  const res = await apiClient.get<{ success: boolean; data: ReviewsPage }>(
    `/reviews?productId=${productId}&page=${page}&limit=${limit}`
  );
  return res.data.data;
}

export async function getMyReview(productId: string): Promise<Review | null> {
  const res = await apiClient.get<{ success: boolean; data: Review | null }>(
    `/reviews/my?productId=${productId}`
  );
  return res.data.data;
}

export async function submitReview(payload: CreateReviewPayload): Promise<Review> {
  const res = await apiClient.post<{ success: boolean; data: Review }>(
    "/reviews",
    payload
  );
  return res.data.data;
}

export async function editReview(
  reviewId: string,
  payload: UpdateReviewPayload
): Promise<Review> {
  const res = await apiClient.put<{ success: boolean; data: Review }>(
    `/reviews/${reviewId}`,
    payload
  );
  return res.data.data;
}
