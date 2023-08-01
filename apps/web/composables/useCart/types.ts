import type { Ref } from 'vue';
import type { Cart } from '../../../../../plentymarkets-sdk/packages/api-client';

export interface UseCartState {
  data: Cart;
  loading: boolean;
}

export type GetCart = () => Promise<Cart>;

export interface UseCart {
  data: Readonly<Ref<UseCartState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCard: FetchCard;
}

export type UseCartReturn = () => UseCart;
