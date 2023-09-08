import type { Address, ActiveShippingCountry, AddressType } from '@plentymarkets/shop-api';

export type AddressFormProps = {
  type: AddressType;
  savedAddress?: Address;
  countries: ActiveShippingCountry[];
  useAsShippingDefault?: boolean;
};
