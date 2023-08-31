import type { ShippingMethod } from '@plentymarkets/shop-api';

export type ShippingMethodProps = {
  shippingMethods: ShippingMethod[];
};

export type CheckoutShippingEmits = (event: 'update:shippingMethod', shippingId: string) => void;
