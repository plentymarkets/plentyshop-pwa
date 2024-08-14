import type { AddressType } from '@plentymarkets/shop-api';

export type CheckoutAddressNewProps = {
  disabled?: boolean;
  asShippingAddress?: boolean;
  type: AddressType;
};
