import type { AddressType, Address } from '@plentymarkets/shop-api';

export type AddressSelectProps = {
  disabled?: boolean;
  type: AddressType;
};

export type AddressSelectEvents = (event: 'edit', payload: Address) => void;
export type AddressSelectNewAddressEvents = (event: 'create', payload: Address) => void;
