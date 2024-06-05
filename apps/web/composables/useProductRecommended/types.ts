import type { Product } from '@plentymarkets/shop-api';

export interface UseProductRecommendedState {
  data: Product[];
  loading: boolean;
}

export type FetchProductRecommended = (categoryId: string) => Promise<Product[]>;

export interface useProductRecommended {
  data: Readonly<Ref<UseProductRecommendedState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductRecommended: FetchProductRecommended;
}

export type UseProductRecommendedReturn = (categoryId: string) => useProductRecommended;
