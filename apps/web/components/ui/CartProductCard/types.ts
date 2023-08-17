import { CartItem } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';

export interface Attribute {
  label: string;
  name: string;
  value: string;
}

export type CartProductCardProps = {
  cartItem: CartItem;
};
