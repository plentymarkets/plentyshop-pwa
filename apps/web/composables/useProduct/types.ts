import type { Ref } from 'vue';
import type { Product } from '@plentymarkets/shop-api';
import { ProductParams } from '@plentymarkets/shop-api';

export interface UseProductState {
  data: Product;
  loading: boolean;
}

export type FetchProduct = (slug: ProductParams) => Promise<Product>;

export interface UseProduct {
  data: Readonly<Ref<UseProductState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProduct: FetchProduct;
}

export type UseProductReturn = (slug: string) => UseProduct;
