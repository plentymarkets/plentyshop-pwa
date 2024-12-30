export type ShippingMethodProps = {
  disabled?: boolean;
};

export type CheckoutShippingEmits = (event: 'update:shippingMethod', shippingId: string) => void;
