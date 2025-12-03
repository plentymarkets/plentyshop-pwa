import type { Product } from '@plentymarkets/shop-api';

export interface UseLastSeenState {
  data: Product[];
  loading: boolean;
  variationIds: number[];
}
