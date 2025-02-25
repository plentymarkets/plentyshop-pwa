import type { Address } from '@plentymarkets/shop-api';

export type AddressFormBillingProps = {
  disabled: boolean;
  address?: Address;
  addAddress?: boolean;
};
