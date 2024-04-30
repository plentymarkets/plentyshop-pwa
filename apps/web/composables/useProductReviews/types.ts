import type { Review, CreateReviewParams } from '@plentymarkets/shop-api';

export interface UseProductReviewsState {
  data: Review;
  loading: boolean;
  createdReview: Review;
}

export type FetchProductReviews = (itemId: number, variationId?: number) => Promise<Review>;
export type CreateProductReview = (params: CreateReviewParams) => Promise<void>;

export interface UseProductReviewsReturn {
  data: Readonly<Ref<UseProductReviewsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviews;
  createProductReview: CreateProductReview;
}

export type UseProductReviews = (itemId: number) => UseProductReviewsReturn;
