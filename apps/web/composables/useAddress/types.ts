import type { Address } from '@plentymarkets/shop-api';
import { AddressType } from '@plentymarkets/shop-api';

export interface UseAddressMethodsState {
  data: Address[];
  savedAddress: Address;
  loading: boolean;
  defaultAddressId: number;
}

export type GetAddresses = () => Promise<Address[]>;
export type SaveAddress = (address: Address) => Promise<Address>;
export type SetDefault = (addressId: number) => void;
export type DeleteAddress = (addressId: number) => void;

export interface UseAddressMethods {
  data: Readonly<Ref<UseAddressMethodsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  defaultAddressId: Readonly<Ref<number>>;
  getAddresses: GetAddresses;
  saveAddress: SaveAddress;
  setDefault: SetDefault;
  deleteAddress: DeleteAddress;
}

export type UseAddressReturn = (type: AddressType) => UseAddressMethods;
