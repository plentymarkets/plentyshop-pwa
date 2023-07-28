import type { Review, ReviewResponse } from '../../../../../plentymarkets-sdk/packages/api-client';

export interface UseProductReviewsState {
  data: Review | null;
  loading: boolean;
}

export type FetchProductReviews = (productId: string, itemId: number) => Promise<Ref<ReviewResponse | null>>;

export interface UseProductReviewsReturn {
  data: Readonly<Ref<UseProductReviewsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviews;
}

export type UseProductReviews = (productId: string, itemId: number) => UseProductReviewsReturn;
