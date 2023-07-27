import { Ref } from 'vue';
import type { Facet, FacetSearchCriteria } from '../../../../../plentymarkets-sdk/packages/api-client';

export interface UseProductsState {
  data: Facet | null | undefined;
  loading: boolean;
}

export type FetchProducts = (params: FacetSearchCriteria) => Promise<Facet | null>;
export interface UseProducts {
  data: Readonly<Ref<UseProductsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProducts: FetchProducts;
}

export type UseProductsReturn = () => UseProducts;
