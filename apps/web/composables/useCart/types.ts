import type { Ref } from 'vue';
import type { Cart, CartResponse } from '../../../../../plentymarkets-sdk/packages/api-client';

export interface UseCartState {
  data: Cart | null | undefined;
  loading: boolean;
}

export type GetCart = () => Promise<Ref<CartResponse | null>>;

export interface UseCart {
  data: Readonly<Ref<UseCartState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getCart: GetCart;
}

export type UseCartReturn = () => UseCart;
