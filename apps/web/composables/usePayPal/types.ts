import { PayPalNamespace } from '@paypal/paypal-js';

export interface UsePayPalState {
  PayPalScript: PayPalNamespace | null;
}

export type LoadScript = (currency: string) => Promise<PayPalNamespace | null>;

export interface UsePayPalMethods {
  loadScript: LoadScript;
}

export type UsePayPalMethodsReturn = () => UsePayPalMethods;
