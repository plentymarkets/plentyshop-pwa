import type { CartItem } from '@plentymarkets/shop-api';

export interface Attribute {
  label: string;
  name: string;
  value: string;
}

export type CartProductCardProps = {
  cartItem: CartItem;
  disabled?: boolean;
};
