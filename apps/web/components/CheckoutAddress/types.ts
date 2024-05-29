import type { AddressType } from '@plentymarkets/shop-api';

export type CheckoutAddressProps = {
  type: AddressType;
  heading: string;
  description: string;
  buttonText: string;
  disabled?: boolean;
};
