import type { Address } from '@plentymarkets/shop-api';

export type AddressState = {
  addresses: Address[];
};

export type AddressSetEvent = {
  event: 'set';
  payload: Address[];
  state: AddressState;
};

export type AddressUpdateEvent = {
  event: 'update';
  payload: Address;
  state: AddressState;
};

export type AddressCreateEvent = {
  event: 'create';
  payload: Address[];
  state: AddressState;
};

export type AddressDestroyEvent = {
  event: 'destroy';
  payload: number;
  state: AddressState;
};
