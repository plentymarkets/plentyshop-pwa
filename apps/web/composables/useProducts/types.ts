import { Ref } from 'vue';
import type {
  FacetApiResponse,
  GetFacetResponse,
  FacetSearchCriteria,
} from '../../../../../plentymarkets-sdk/packages/api-client';

export interface UseProductsState {
  data: FacetApiResponse | null | undefined;
  loading: boolean;
}

export type FetchProducts = (params: FacetSearchCriteria) => Promise<Ref<GetFacetResponse | null>>;
export interface UseProducts {
  data: Readonly<Ref<UseProductsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProducts: FetchProducts;
}

export type UseProductsReturn = () => UseProducts;
