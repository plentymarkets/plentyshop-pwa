import { Ref } from 'vue';
import { PayPalNamespace } from '@paypal/paypal-js';
import {
  PayPalCreateOrder,
  PayPalApproveOrder,
  PayPalExecutePayment,
  PayPalExecuteParams,
} from '@plentymarkets/shop-api';

export interface UsePayPalState {
  paypalScript: PayPalNamespace | null;
  order: PayPalCreateOrder | null;
  loading: boolean;
}

export type LoadScript = (currency: string) => Promise<PayPalNamespace | null>;
export type createTransaction = (fundingSource: string) => Promise<PayPalCreateOrder | null>;
export type approveOrder = (orderID: string, payerID: string) => Promise<PayPalApproveOrder | null>;
export type executeOrder = (params: PayPalExecuteParams) => Promise<PayPalExecutePayment | null>;

export interface UsePayPalMethods {
  loading: Readonly<Ref<boolean>>;
  loadScript: LoadScript;
  createTransaction: createTransaction;
  approveOrder: approveOrder;
  executeOrder: executeOrder;
}

export type UsePayPalMethodsReturn = () => UsePayPalMethods;
