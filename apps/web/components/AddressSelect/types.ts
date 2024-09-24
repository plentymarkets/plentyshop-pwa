import { type Address, AddressType } from '@plentymarkets/shop-api';

export type AddressSelectProps = {
  type: AddressType;
};

export type AddressSelectEvents = (event: 'edit', payload: Address) => void;
export type AddressSelectNewAddressEvents = (event: 'create', payload: Address) => void;
