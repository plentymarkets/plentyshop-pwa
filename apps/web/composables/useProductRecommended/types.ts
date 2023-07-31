import type { Ref } from 'vue';
import type { ProductItemDocumentData } from '../../../../../plentymarkets-sdk/packages/api-client';

export interface UseProductRecommendedState {
  data: ProductItemDocumentData[];
  loading: boolean;
}

export type FetchProductRecommended = (categoryId: string) => Promise<ProductItemDocumentData[]>;

export interface useProductRecommended {
  data: Readonly<Ref<UseProductRecommendedState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductRecommended: FetchProductRecommended;
}

export type UseProductRecommendedReturn = (categoryId: string) => useProductRecommended;
