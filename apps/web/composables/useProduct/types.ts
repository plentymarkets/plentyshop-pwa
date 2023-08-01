import type { Ref } from 'vue';
import type { ProductItemDocumentData } from '@plentymarkets/plentymarkets-sdk/packages/api-client';

export interface UseProductState {
  data: ProductItemDocumentData;
  loading: boolean;
}

export type FetchProduct = (slug: string) => Promise<ProductItemDocumentData>;

export interface UseProduct {
  data: Readonly<Ref<UseProductState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProduct: FetchProduct;
}

export type UseProductReturn = (slug: string) => UseProduct;
