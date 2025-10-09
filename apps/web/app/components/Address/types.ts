import type { Address } from '@plentymarkets/shop-api';

export type AddressProps = {
  address: Address;
  isDefault: boolean;
  isSelected?: boolean;
  showDivider?: boolean;
};
