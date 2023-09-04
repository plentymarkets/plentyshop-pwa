import type { PaymentProviders } from '@plentymarkets/shop-api';

export type CheckoutPaymentProps = {
  paymentMethods: PaymentProviders;
  disabled?: boolean;
};

export type CheckoutPaymentEmits = (event: 'update:activePayment', paymentMethodId: number) => void;
