import type { Ref } from 'vue';
import type {
  Cart,
  DoAddItemParams,
  DeleteCartItemParams,
  SetCartItemQuantityParams,
} from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export interface UseCartState {
  data: Cart;
  loading: boolean;
}

export type GetCart = () => Promise<Cart>;

export type AddToCart = (params: DoAddItemParams) => Promise<Cart>;

export type DeleteCartItem = (params: DeleteCartItemParams) => Promise<Cart>;

export type SetCartItemQuantity = (params: SetCartItemQuantityParams) => Promise<Cart>;

export interface UseCart {
  data: Readonly<Ref<UseCartState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getCart: GetCart;
  addToCart: AddToCart;
  deleteCartItem: DeleteCartItem;
  setCartItemQuantity: SetCartItemQuantity;
}

export type UseCartReturn = () => UseCart;
