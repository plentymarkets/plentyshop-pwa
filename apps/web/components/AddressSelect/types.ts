import { type Address, AddressType } from '@plentymarkets/shop-api';

export type AddressSelectProps = {
  type: AddressType;
};

export type AddressSelectEvents = (event: 'edit', payload: Address) => void;
