import type { Address } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type AddressFormProps = {
  type: 'billingAddress' | 'shippingAddress';
  savedAddress?: Address;
};
