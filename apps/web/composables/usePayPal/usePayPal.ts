import { loadScript as loadPayPalScript } from '@paypal/paypal-js';
import { PayPalExecuteParams } from '@plentymarkets/shop-api';
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
    paypalScript: null,
    order: null,
  }));

  /**
   * @description Function for get the paypal sdk script.
   * @example
   * loadScript('EUR');
   */
  const loadScript: LoadScript = async (currency: string) => {
    if (paypalGetters.getClientId()) {
      try {
        state.value.paypalScript = await loadPayPalScript({
          clientId: paypalGetters.getClientId() ?? '',
          currency: currency,
          dataPartnerAttributionId: 'Plenty_Cart_PWA_PPCP',
        });
        return state.value.paypalScript;
      } catch {
        // eslint-disable-next-line unicorn/expiring-todo-comments
        // TODO: Handle error (not loading sdk)
      }
    }

    return null;
  };

  /**
   * @description Function for creating a PayPal transaction.
   * @example
   * createTransaction(fundingSource: string);
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
   * @description Function for approving a PayPal transaction.
   * @example
   * approveOrder(orderID: string, payerID: string);
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
   * @description Function for executing a PayPal transaction.
   * @example
   * executeOrder({
   *   mode: 'paypal',
   *   plentyOrderId: 1234;
   *   paypalTransactionId: 'UHIhhur3h2rh2';
   *   paypalMerchantId: 'U3713H123';
   * });
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
