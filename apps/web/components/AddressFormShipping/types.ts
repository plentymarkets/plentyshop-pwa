import type { Address } from '@plentymarkets/shop-api';

export type AddressFormShippingProps = {
  disabled: boolean;
  address?: Address;
  addAddress?: boolean;
};
