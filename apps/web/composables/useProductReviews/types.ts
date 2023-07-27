import type { Maybe } from '@vue-storefront/unified-data-model';
import type { ReviewResponse } from '../../../../../plentymarkets-sdk/packages/api-client';

export interface UseProductReviewsState {
  data: Maybe<ReviewResponse>;
  loading: boolean;
}

export type FetchProductReviews = (productId: string, itemId: number) => Promise<Ref<Maybe<ReviewResponse>>>;

export interface UseProductReviewsReturn {
  data: Readonly<Ref<UseProductReviewsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviews;
}

export type UseProductReviews = (productId: string, itemId: number) => UseProductReviewsReturn;
