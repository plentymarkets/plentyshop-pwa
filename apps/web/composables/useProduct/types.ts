import type { Breadcrumb, Product, ProductParams } from '@plentymarkets/shop-api';
import type { UseProductOrderProperties } from '~/composables/useProductOrderProperties';

export interface UseProductState {
  data: Product;
  loading: boolean;
  breadcrumbs: Breadcrumb[];
}

export type FetchProduct = (params: ProductParams) => Promise<Product>;
export type GenerateBreadcrumb = () => void;

export interface UseProduct {
  data: Readonly<Ref<UseProductState['data']>>;
  loading: Readonly<Ref<boolean>>;
  breadcrumbs: Readonly<Ref<UseProductState['breadcrumbs']>>;
  fetchProduct: FetchProduct;
  generateBreadcrumbs: GenerateBreadcrumb;
  setTitle: () => void;
  properties: UseProductOrderProperties;
}

export type UseProductReturn = (slug: string) => UseProduct;
