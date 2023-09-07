import type { Address } from '@plentymarkets/shop-api';

export interface UseBillingAddressMethodsState {
  data: Address[];
  saveAddress: Address | null;
  loading: boolean;
}

export type GetBillingAddresses = () => Promise<Address[]>;
export type SaveBillingAddress = (address: Address) => Promise<Address | null>;

export interface UseBillingAddressMethods {
  data: Readonly<Ref<UseBillingAddressMethodsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getBillingAddresses: GetBillingAddresses;
  saveBillingAddress: SaveBillingAddress;
}

export type UseBillingAddressReturn = () => UseBillingAddressMethods;
