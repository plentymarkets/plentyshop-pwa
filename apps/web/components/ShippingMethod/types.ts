import type { ShippingMethod } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type ShippingMethodProps = {
  shippingMethods: ShippingMethod[];
};

export type CheckoutShippingEmits = (event: 'update:shippingMethod', shippingId: string) => void;
