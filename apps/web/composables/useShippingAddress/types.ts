import type { Address } from '@plentymarkets/shop-api';

export interface UseShippingAddressMethodsState {
  data: Address[];
  saveAddress: Address | null;
  loading: boolean;
  defaultAddressId: number;
}

export type GetShippingAddresses = () => Promise<Address[]>;
export type SaveShippingAddress = (address: Address) => Promise<Address | null>;
export type SetDefault = (addressId: number) => Promise<Address | null>;
export type DeleteAddress = (addressId: number) => Promise<Address | null>;

export interface UseShippingAddressMethods {
  data: Readonly<Ref<UseShippingAddressMethodsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  defaultAddressId: Readonly<Ref<number>>;
  getShippingAddresses: GetShippingAddresses;
  saveShippingAddress: SaveShippingAddress;
  setDefault: SetDefault;
  deleteAddress: DeleteAddress;
}

export type UseShippingAddressReturn = () => UseShippingAddressMethods;
