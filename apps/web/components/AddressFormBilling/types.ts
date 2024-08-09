import { type ActiveShippingCountry, type Address } from '@plentymarkets/shop-api';

export type AddressFormProps = {
  countries: ActiveShippingCountry[];
  address?: Address;
  addAddress?: boolean;
};
