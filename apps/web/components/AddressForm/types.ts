import type { AddressType, type Address } from '@plentymarkets/shop-api';

export type AddressFormProps = {
  type: AddressType;
  savedAddress?: Address;
  useAsShippingDefault?: boolean;
};
