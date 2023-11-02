import type { Ref } from 'vue';
import type { Breadcrumb, Product } from '@plentymarkets/shop-api';
import { ProductParams } from '@plentymarkets/shop-api';

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
}

export type UseProductReturn = (slug: string) => UseProduct;
