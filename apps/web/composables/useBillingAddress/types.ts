import type { Address} from '@plentymarkets/shop-api';

export interface UseBillingAddressMethodsState {
  data: Address[];
  saveAddress: Address | null;
  loading: boolean;
  defaultAddressId: number;
}

export type GetBillingAddresses = () => Promise<Address[]>;
export type SaveBillingAddress = (address: Address) => Promise<Address | null>;
export type SetDefault = (addressId: number) => Promise<Address | null>;
export type DeleteAddress = (addressId: number) => Promise<Address | null>;

export interface UseBillingAddressMethods {
  data: Readonly<Ref<UseBillingAddressMethodsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  defaultAddressId: Readonly<Ref<number>>;
  getBillingAddresses: GetBillingAddresses;
  saveBillingAddress: SaveBillingAddress;
  setDefault: SetDefault;
  deleteAddress: DeleteAddress;
}

export type UseBillingAddressReturn = () => UseBillingAddressMethods;
