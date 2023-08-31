import type { Address, AddressType } from '@plentymarkets/shop-api';

export type CheckoutAddressProps = {
  type: AddressType;
  addresses: Address[];
  heading: string;
  description: string;
  buttonText: string;
};
