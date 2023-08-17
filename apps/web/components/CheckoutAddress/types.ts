import type { Address, AddressType } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type CheckoutAddressProps = {
  type: AddressType;
  addresses: Address[];
  heading: string;
  description: string;
  buttonText: string;
};
