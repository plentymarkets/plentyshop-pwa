import { loadScript as loadPayPalScript } from '@paypal/paypal-js';
import { PayPalExecuteParams } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';
import { paypalGetters } from '~/getters/paypalGetters';
import { useSdk } from '~/sdk';
import type {
  UsePayPalMethodsReturn,
  createTransaction,
  executeOrder,
  LoadScript,
  UsePayPalState,
  approveOrder,
} from './types';

/**
 * @description Composable for paypal.
 * @returns {@link UsePayPalMethodsReturn}
 * @example
 * const { loadScript } = usePayPal();
 */
export const usePayPal: UsePayPalMethodsReturn = () => {
  const state = useState<UsePayPalState>('usePayPal', () => ({
    PayPalScript: null,
    order: null,
  }));

  /**
   * @description Function for fetching the category tree.
   * @example
   * loadScript(currency: string);
   */
  const loadScript: LoadScript = async (currency: string) => {
    if (paypalGetters.getClientId()) {
      try {
        state.value.PayPalScript = await loadPayPalScript({
          clientId: paypalGetters.getClientId() ?? '',
          currency: currency,
          dataPartnerAttributionId: 'plentysystemsAG_Cart_PPCP',
        });
        return state.value.PayPalScript;
      } catch {
        // console.error('failed to load the PayPal JS SDK script', error);
      }
    }

    return null;
  };

  /**
   * @description Function for creating a PayPal transaction.
   * @example
   * createOrder(fundingSource: string);
   */
  const createTransaction: createTransaction = async (fundingSource: string) => {
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doCreatePayPalTransaction({
        fundingSource: fundingSource,
      }),
    );
    state.value.order = data.value?.data ?? null;
    useHandleError(error.value);

    return state.value.order;
  };

  /**
   * @description Function for fetching the category tree.
   * @example
   * loadScript(currency: string);
   */
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const approveOrder: approveOrder = async (orderID: string, payerID: string) => {
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doApprovePayPalTransaction({
        transactionId: orderID,
        payerId: payerID,
      }),
    );
    useHandleError(error.value);

    return data.value?.data ?? null;
  };

  /**
   * @description Function for fetching the category tree.
   * @example
   * loadScript(currency: string);
   */
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const executeOrder: executeOrder = async (params: PayPalExecuteParams) => {
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getExecutePayPalOrder(params));
    useHandleError(error.value);

    return data.value?.data ?? null;
  };

  return {
    state,
    approveOrder,
    createTransaction,
    executeOrder,
    loadScript,
  };
};
