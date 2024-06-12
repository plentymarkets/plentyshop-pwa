import type { Review, UpdateReviewParams, CreateReviewParams } from '@plentymarkets/shop-api';

export interface UseProductReviewsState {
  data: Review;
  authFeedbackCount: number;
  loading: boolean;
  createdReview: Review;
}

export type FetchProductReviews = (itemId: number, variationId?: number) => Promise<Review>;
export type DeleteProductReview = (feedbackId: number) => Promise<void>;
export type SetProductReview = (params: UpdateReviewParams) => Promise<void>;
export type CreateProductReview = (params: CreateReviewParams) => Promise<void>;

export interface UseProductReviewsReturn {
  data: Readonly<Ref<UseProductReviewsState['data']>>;
  authFeedbackCount: Readonly<Ref<number>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviews;
  deleteProductReview: DeleteProductReview;
  createProductReview: CreateProductReview;
  setProductReview: SetProductReview;
}

export type UseProductReviews = (itemId: number) => UseProductReviewsReturn;
