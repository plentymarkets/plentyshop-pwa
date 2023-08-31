import type { Review } from '@plentymarkets/shop-api';

export interface UseProductReviewsState {
  data: Review;
  loading: boolean;
}

export type FetchProductReviews = (productId: string | number, itemId: number) => Promise<Review>;

export interface UseProductReviewsReturn {
  data: Readonly<Ref<UseProductReviewsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviews;
}

export type UseProductReviews = (productId: string | number, itemId: number) => UseProductReviewsReturn;
