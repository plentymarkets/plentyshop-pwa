import type { Product, FacetSearchCriteria  } from '@plentymarkets/shop-api';

export interface UseProductRecommendedState {
  data: Product[];
  loading: boolean;
}

export type FetchProductRecommended = (params: FacetSearchCriteria) => Promise<Product[]>;

export interface useProductRecommended {
  data: Readonly<Ref<UseProductRecommendedState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductRecommended: FetchProductRecommended;
}

export type UseProductRecommendedReturn = (categoryId: string) => useProductRecommended;
