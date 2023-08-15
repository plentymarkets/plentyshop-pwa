import { Ref } from 'vue';
import type { Facet, FacetSearchCriteria } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export interface UseProductsState {
  data: Facet;
  loading: boolean;
  productsPerPage: number;
}

export type FetchProducts = (params: FacetSearchCriteria) => Promise<Facet>;

export interface UseProducts {
  data: Readonly<Ref<UseProductsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  productsPerPage: Readonly<Ref<number>>;
  fetchProducts: FetchProducts;
}

export type UseProductsReturn = () => UseProducts;
