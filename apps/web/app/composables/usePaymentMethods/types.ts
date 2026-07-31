import type { PaymentMethod, PaymentProviders } from '@plentymarkets/shop-api';

export interface UsePaymentMethodsState {
  data: PaymentProviders;
  loading: boolean;
}

export type FetchPaymentMethods = () => Promise<PaymentProviders>;
export type SavePaymentMethod = (paymentMethodId: number) => Promise<void>;
export type SetPaymentMethods = (list: PaymentMethod[], selectedId: number) => void;

export interface UsePaymentMethods {
  data: Readonly<Ref<UsePaymentMethodsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchPaymentMethods: FetchPaymentMethods;
  savePaymentMethod: SavePaymentMethod;
  setPaymentMethods: SetPaymentMethods;
}

export type UsePaymentMethodsReturn = () => UsePaymentMethods;
