import { type Address, AddressType } from '@plentymarkets/shop-api';

export type AddressFormProps = {
  type: AddressType;
  savedAddress?: Address;
  useAsShippingDefault?: boolean;
};
