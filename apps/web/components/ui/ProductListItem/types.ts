import { Product, CartItem } from '@plentymarkets/shop-api';

export type ProductListItem = {
  id: number;
  variationId: number;
  image: string;
  path: string;
  name: string;
  currency: string;
  currentFullPrice: string;
  variation: Product;
  attributes: unknown[];
  basketItemOrderParams: unknown;
  quantitySelectorDisabled: boolean;
  quantity: number;
  basePriceSingleValue: number;
  itemPrice: number;
  cartItem: CartItem;
};
