import type { BasketItemOrderParam, CartItem } from '@plentymarkets/shop-api';

export interface CartOrderPropertyProps {
  basketItemOrderParam: BasketItemOrderParam;
  cartItem: CartItem;
}
