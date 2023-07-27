import type { Ref } from 'vue';
import type { SfProduct, Maybe } from '@vue-storefront/unified-data-model';
import type {
  ProductResponse, ProductItemDocumentData
} from '../../../../../plentymarkets-sdk/packages/api-client';

export interface UseProductState {
  data: ProductItemDocumentData | null | undefined;
  loading: boolean;
}

export type FetchProduct = (slug: string) => Promise<Ref<ProductResponse | null>>;

export interface UseProduct {
  data: Readonly<Ref<UseProductState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProduct: FetchProduct;
}

export type UseProductReturn = (slug: string) => UseProduct;
