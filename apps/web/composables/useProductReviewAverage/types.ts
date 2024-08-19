import type { ReviewAverage } from '@plentymarkets/shop-api';

export interface UseProductReviewAverageState {
  data: ReviewAverage;
  loading: boolean;
}

export type FetchProductReviewAverage = (itemId: number) => Promise<ReviewAverage>;

export interface UseProductReviewsAverageReturn {
  data: Readonly<Ref<UseProductReviewAverageState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviewAverage: FetchProductReviewAverage;
}

export type UseProductReviewAverage = (itemId: number) => UseProductReviewsAverageReturn;
