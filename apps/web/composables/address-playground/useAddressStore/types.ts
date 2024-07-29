import { Address } from "@plentymarkets/shop-api";

export type AddressState = {
    addresses: Address[];
}

export type AddressEvent = {
    event: 'create' | 'update' | 'destroy';
    payload: any;
    state: AddressState;
}