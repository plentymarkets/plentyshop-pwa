import type { Ref } from 'vue';
import type { SfProduct, Maybe } from '@vue-storefront/unified-data-model';
import type {
  FacetResponse, ProductItemDocument
} from '../../../../../plentymarkets-sdk/packages/api-client';

export interface UseProductRecommendedState {
  data: ProductItemDocument[] | null | undefined;
  loading: boolean;
}

export type FetchProductRecommended = (slug: string) => Promise<Ref<FacetResponse | null>>;

export interface useProductRecommended {
  data: Readonly<Ref<UseProductRecommendedState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductRecommended: FetchProductRecommended;
}

export type UseProductRecommendedReturn = (slug: string) => useProductRecommended;
