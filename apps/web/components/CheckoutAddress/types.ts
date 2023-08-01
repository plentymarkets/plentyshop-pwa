import type { Address } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type CheckoutAddressProps = {
  type: 'billingAddress' | 'shippingAddress';
  heading: string;
  description: string;
  buttonText: string;
  savedAddress?: Address;
};
