import type { Address } from '../../../../../plentymarkets-sdk/packages/api-client';

export type CheckoutAddressProps = {
  type: 'billingAddress' | 'shippingAddress';
  heading: string;
  description: string;
  buttonText: string;
  savedAddress?: Address;
};
