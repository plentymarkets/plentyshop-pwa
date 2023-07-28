import type { Address } from '../../../../../plentymarkets-sdk/packages/api-client';

export type AddressFormProps = {
  type: 'billingAddress' | 'shippingAddress';
  savedAddress?: Address;
};
