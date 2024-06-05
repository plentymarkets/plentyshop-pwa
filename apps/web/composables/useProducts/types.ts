import type { Facet, FacetSearchCriteria, Product } from '@plentymarkets/shop-api';

export interface UseProductsState {
  data: Facet;
  loading: boolean;
  productsPerPage: number;
  selectedVariation: Product;
}

export type FetchProducts = (params: FacetSearchCriteria) => Promise<Facet>;
export type SelectVariation = (product: Product) => void;

export interface UseProducts {
  data: Readonly<Ref<UseProductsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  productsPerPage: Readonly<Ref<number>>;
  selectedVariation: Readonly<Ref<UseProductsState['selectedVariation']>>;
  fetchProducts: FetchProducts;
  selectVariation: SelectVariation;
}

export type UseProductsReturn = () => UseProducts;
