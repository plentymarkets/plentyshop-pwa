import type { Ref } from 'vue';
import type { Cart, DoAddItemParams, DeleteCartItemParams, SetCartItemQuantityParams } from '@plentymarkets/shop-api';

export interface UseCartState {
  data: Cart;
  loading: boolean;
}

export type GetCart = () => Promise<Cart>;
export type SetCart = (data: Cart) => void;
export type ClearCartItems = () => void;
export type AddToCart = (params: DoAddItemParams) => Promise<Cart>;
export type DeleteCartItem = (params: DeleteCartItemParams) => Promise<Cart>;
export type SetCartItemQuantity = (params: SetCartItemQuantityParams) => Promise<Cart>;

export interface UseCart {
  data: Readonly<Ref<UseCartState['data']>>;
  loading: Ref<boolean>;
  getCart: GetCart;
  addToCart: AddToCart;
  deleteCartItem: DeleteCartItem;
  setCartItemQuantity: SetCartItemQuantity;
  setCart: SetCart;
  clearCartItems: ClearCartItems;
}

export type UseCartReturn = () => UseCart;
