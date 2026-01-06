import type { Facet, FacetSearchCriteria, Product } from '@plentymarkets/shop-api';

export interface UseProductsState {
  data: Facet;
  loading: boolean;
  productsPerPage: number;
  currentProduct: Product;
}

export type FetchProducts = (params: FacetSearchCriteria) => Promise<Facet>;
export type SetCurrentProduct = (product: Product) => void;

export interface UseProducts {
  data: Readonly<Ref<UseProductsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  productsPerPage: Readonly<Ref<number>>;
  currentProduct: Readonly<Ref<UseProductsState['currentProduct']>>;
  fetchProducts: FetchProducts;
  setCurrentProduct: SetCurrentProduct;
}

export type UseProductsReturn = (category?: string) => UseProducts;
