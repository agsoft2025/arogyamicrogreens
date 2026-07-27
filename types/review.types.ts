export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsPage {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  title?: string;
  body?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  body?: string;
}
