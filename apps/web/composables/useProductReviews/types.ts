import type { Review, UpdateReviewParams, CreateReviewParams } from '@plentymarkets/shop-api';

export interface UseProductReviewsState {
  data: Review;
  allData: Review;
  loading: boolean;
  createdReview: Review;
}

type FetchProductReviewsParams = {
  itemId: number;
  variationId?: number;
  allData?: boolean;
};

export type FetchProductReviews = (
  itemId: number,
  variationId?: number,
  options?: { allData?: boolean },
) => Promise<Review>;
export type DeleteProductReview = (feedbackId: number) => Promise<void>;
export type SetProductReview = (params: UpdateReviewParams) => Promise<void>;
export type CreateProductReview = (params: CreateReviewParams) => Promise<void>;

export interface UseProductReviewsReturn {
  data: Readonly<Ref<UseProductReviewsState['data']>>;
  allData: Readonly<Ref<UseProductReviewsState['allData']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviews;
  deleteProductReview: DeleteProductReview;
  createProductReview: CreateProductReview;
  setProductReview: SetProductReview;
}

export type UseProductReviews = (itemId: number) => UseProductReviewsReturn;
