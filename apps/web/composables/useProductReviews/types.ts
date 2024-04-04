import type { Review, ReviewItem } from '@plentymarkets/shop-api';

export interface UseProductReviewsState {
  data: Review;
  loading: boolean;
  createdReview: Review;
}

export type FetchProductReviews = (itemId: number) => Promise<Review>;
export type DeleteProductReview = (feedbackId: number) => Promise<void>;
export type SetProductReview = (data: ReviewItem) => Promise<void>;
export type CreateProductReview = () => Promise<void>;

export interface UseProductReviewsReturn {
  data: Readonly<Ref<UseProductReviewsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviews;
  deleteProductReview: DeleteProductReview;
  createProductReview: CreateProductReview;
  setProductReview: SetProductReview;
}

export type UseProductReviews = (itemId: number) => UseProductReviewsReturn;
