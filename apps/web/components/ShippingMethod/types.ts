export type ShippingMethodProps = {
  disabled?: boolean;
  loading?: boolean;
};

export type CheckoutShippingEmits = (event: 'update:shippingMethod', shippingId: string) => void;
