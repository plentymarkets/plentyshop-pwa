import { Address, AddressType } from "@plentymarkets/shop-api";

export type AddressContainerHeaderEvents = (event: 'edit', payload: Address) => void;

export type AddressContainerHeaderProps = {
    disabled?: boolean;
    type: AddressType;
  };
  