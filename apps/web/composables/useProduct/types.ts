import type { Product, Breadcrumb, ProductParams } from '@plentymarkets/shop-api';
import type { UseProductOrderProperties } from '../useProductOrderProperties/types';

export interface UseProductState {
  data: Product;
  loading: boolean;
  breadcrumbs: Breadcrumb[];
}

export type FetchProduct = (params: ProductParams) => Promise<Product>;
export type SetBreadcrumbs = () => void;

export interface UseProduct {
  data: Readonly<Ref<UseProductState['data']>>;
  loading: Readonly<Ref<boolean>>;
  breadcrumbs: Readonly<Ref<UseProductState['breadcrumbs']>>;
  fetchProduct: FetchProduct;
  setBreadcrumbs: SetBreadcrumbs;
  setProductMeta: () => void;
  properties: UseProductOrderProperties;
}

export type UseProductReturn = (slug: string) => UseProduct;
