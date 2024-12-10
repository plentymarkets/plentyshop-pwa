export type CheckoutPaymentProps = {
  disabled?: boolean;
};

export type CheckoutPaymentEmits = (event: 'update:activePayment', paymentMethodId: number) => void;
