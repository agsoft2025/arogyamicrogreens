export interface ReviewSettings {
  _id: string;
  reviewsEnabled: boolean;
  showRatingOnCards: boolean;
  showRatingOnDetailPage: boolean;
  showReviewCount: boolean;
  minimumRatingToShow: number;
  updatedAt: string;
}

export type UpdateReviewSettingsPayload = Omit<ReviewSettings, "_id" | "updatedAt">;

export interface ReviewSettingsResponse {
  success: boolean;
  data: ReviewSettings;
  message?: string;
}
