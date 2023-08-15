import type { Address, ActiveShippingCountry, AddressType } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
export type AddressFormProps = {
  type: AddressType;
  savedAddress?: Address;
  countries: ActiveShippingCountry[];
};
