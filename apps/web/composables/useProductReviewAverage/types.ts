import { ReviewAverage } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';

export interface UseProductReviewAverageState {
  data: ReviewAverage;
  loading: boolean;
}

export type FetchProductReviewAverage = (itemId: number) => Promise<ReviewAverage>;

export interface UseProductReviewsAverageReturn {
  data: Readonly<Ref<UseProductReviewAverageState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviewAverage;
}

export type UseProductReviewAverage = (itemId: number) => UseProductReviewsAverageReturn;
