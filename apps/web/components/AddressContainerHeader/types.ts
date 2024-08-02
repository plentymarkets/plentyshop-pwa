import { Address, AddressType } from '@plentymarkets/shop-api';

export type AddressContainerHeaderEvent = (event: 'edit', payload: Address) => void;

export type AddressContainerHeaderProps = {
  disabled?: boolean;
  type: AddressType;
};
