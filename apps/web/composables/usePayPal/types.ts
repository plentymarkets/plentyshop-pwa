import type { PayPalNamespace } from '@paypal/paypal-js';

export const PayPalPaymentKey = 'PAYPAL';
export const PayPalCreditCardPaymentKey = 'PAYPAL_UNBRANDED_CARD';

export const PayPalGooglePayKey = 'PAYPAL_GOOGLE_PAY';

export const PayPalApplePayKey = 'PAYPAL_APPLE_PAY';

export const PayPalPayUponInvoiceKey = 'PAYPAL_PAY_UPON_INVOICE';

export const PayPalAlternativeFundingSourceMapper = {
  PAYPAL_GIROPAY: 'giropay',
  PAYPAL_SEPA: 'sepa',
  PAYPAL_SOFORT: 'sofort',
  PAYPAL_BANCONTACT: 'bancontact',
  PAYPAL_BLIK: 'blik',
  PAYPAL_EPS: 'eps',
  PAYPAL_IDEAL: 'ideal',
  PAYPAL_MYBANK: 'mybank',
  PAYPAL_PRZELEWY24: 'p24',
  PAYPAL_TRUSTLY: 'trustly',
};

export type PayPalScript = {
  script: PayPalNamespace | null;
  locale: string;
  currency: string;
  commit: boolean;
};

export type PayPalLoadScript = {
  [key: string]: Promise<PayPalNamespace | null>;
};
