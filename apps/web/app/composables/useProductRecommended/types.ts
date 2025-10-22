import type { Product } from '@plentymarkets/shop-api';

export interface UseProductRecommendedState {
  data: Product[];
  loading: boolean;
}

export type FetchParams = { type: 'category' | 'cross_selling'; itemId?: string; crossSellingRelation?: 'Accessory' | 'ReplacementPart' | 'Similar' |'Bundle' | 'Configurator', categoryId?: string };

export type FetchProductRecommended = (params: FetchParams) => Promise<Product[]>;

export interface useProductRecommended {
  data: Readonly<Ref<UseProductRecommendedState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductRecommended: FetchProductRecommended;
}

export type UseProductRecommendedReturn = (categoryId: string) => useProductRecommended;
