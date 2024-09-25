import { loadScript as loadPayPalScript, PayPalNamespace } from '@paypal/paypal-js';
import {
  PayPalCaptureOrderParams,
  PayPalConfigResponse,
  PayPalCreateOrder,
  PayPalExecuteParams,
  paypalGetters,
} from '@plentymarkets/shop-api';

interface PayPalScript {
  script: PayPalNamespace | null;
  currency: string;
  locale: string;
  commit: boolean;
}

interface PayPalState {
  loading: boolean;
  paypalScript: PayPalScript | null;
  loadingScripts: Record<string, Promise<PayPalNamespace | null>>;
  order: PayPalCreateOrder | null;
  config: PayPalConfigResponse | null;
  loadedConfig: boolean;
  isAvailable: boolean;
  isReady: boolean;
}

const handleError = (error: unknown, context: string) => {
  if (error) console.error(`Error in ${context}:`, error);
};

export const usePayPal = () => {
  const state = useState<PayPalState>('usePayPal', () => ({
    loading: false,
    paypalScript: null,
    loadingScripts: {},
    order: null,
    config: null,
    loadedConfig: false,
    isAvailable: false,
    isReady: false,
  }));

  const scriptCache = new Map<string, PayPalNamespace | null>();
  const localeMap: Record<string, string> = { de: 'de_DE' };
  const getLocaleForPayPal = (locale: string): string => localeMap[locale] || 'en_US';

  /**
   * Loads PayPal config, avoiding multiple calls.
   * @returns Promise<boolean>
   */
  const loadConfig = async (): Promise<boolean> => {
    if (state.value.config) return true;

    const { data } = await useAsyncData(() => useSdk().plentysystems.getPayPalMerchantAndClientIds());

    if (data && data.value) {
      state.value.config = data.value as unknown as PayPalConfigResponse;
      state.value.isAvailable = !!data.value;
    }

    return !!state.value.config;
  };

  /**
   * Loads the PayPal script and caches it.
   * @param currency string
   * @param locale string
   * @param commit boolean
   * @returns Promise<PayPalNamespace | null>
   */
  const loadScript = async (currency: string, locale: string, commit = false): Promise<PayPalNamespace | null> => {
    await loadConfig();
    const clientId = state.value.config ? paypalGetters.getClientId(state.value.config) : null;

    if (!clientId) return null;

    const cacheKey = `${currency}_${locale}_${commit}`;
    if (scriptCache.has(cacheKey)) return scriptCache.get(cacheKey) || null;

    try {
      const paypalScript = await loadPayPalScript({
        clientId,
        currency,
        commit,
        locale,
        components:
          'applepay,messages,buttons,funding-eligibility,card-fields,payment-fields,marks&enable-funding=paylater',
      });
      scriptCache.set(cacheKey, paypalScript);
      return paypalScript;
    } catch (error) {
      handleError(error, 'loadScript');
      return null;
    }
  };

  const getScript = async (currency: string, commit = false): Promise<PayPalNamespace | null> => {
    const { $i18n } = useNuxtApp();
    const localePayPal = getLocaleForPayPal($i18n.locale.value);
    const scriptKey = `${currency}_${localePayPal}_${commit}`;

    if (state.value.loadingScripts[scriptKey] !== undefined) {
      return state.value.loadingScripts[scriptKey];
    }

    if (
      state.value.paypalScript &&
      state.value.paypalScript.currency === currency &&
      state.value.paypalScript.locale === localePayPal &&
      state.value.paypalScript.commit === commit
    ) {
      return state.value.paypalScript.script;
    }

    state.value.isReady = false;
    state.value.paypalScript = null;
    state.value.loadingScripts[scriptKey] = loadScript(currency, localePayPal, commit)
      .then((paypalScript) => {
        state.value.paypalScript = { script: paypalScript, currency, locale: localePayPal, commit };
        state.value.isReady = true;
        return paypalScript;
      })
      .finally(() => {
        delete state.value.loadingScripts[scriptKey];
      });

    return state.value.loadingScripts[scriptKey];
  };

  /**
   * Wrapper function for handling async API calls with error handling.
   * @param requestFunc Function
   * @param context string
   * @returns Promise<any>
   */
  const asyncRequest = async <ResponseData>(
    requestFunction: () => Promise<ResponseData>,
    context: string,
  ): Promise<ResponseData | null> => {
    state.value.loading = true;

    try {
      const { data, error } = await useAsyncData<ResponseData>(requestFunction);
      if (error?.value) handleError(error.value, context);
      return (data?.value as ResponseData) ?? null;
    } catch (error) {
      handleError(error, context);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Approves a PayPal order.
   * @param orderID string
   * @param payerID string
   * @returns Promise<any>
   */
  const approveOrder = async (orderID: string, payerID: string) => {
    return await asyncRequest(
      () =>
        useSdk().plentysystems.doApprovePayPalTransaction({
          transactionId: orderID,
          payerId: payerID,
        }),
      'approveOrder',
    );
  };

  /**
   * Creates a PayPal transaction.
   * @param fundingSource string
   * @returns Promise<any>
   */
  const createTransaction = async (fundingSource: string) => {
    return await asyncRequest(
      () => useSdk().plentysystems.doCreatePayPalTransaction({ fundingSource }),
      'createTransaction',
    );
  };

  /**
   * Executes a PayPal order.
   * @param params PayPalExecuteParams
   * @returns Promise<any>
   */
  const executeOrder = async (params: PayPalExecuteParams) => {
    return await asyncRequest(() => useSdk().plentysystems.getExecutePayPalOrder(params), 'executeOrder');
  };

  /**
   * Creates a PayPal credit card transaction.
   * @returns Promise<any>
   */
  const createCreditCardTransaction = async () => {
    return await asyncRequest(
      () => useSdk().plentysystems.doCreatePayPalCreditCardTransaction(),
      'createCreditCardTransaction',
    );
  };

  /**
   * Captures a PayPal order.
   * @param params PayPalCaptureOrderParams
   * @returns Promise<any>
   */
  const captureOrder = async (params: PayPalCaptureOrderParams) => {
    return await asyncRequest(() => useSdk().plentysystems.doCapturePayPalOrder(params), 'captureOrder');
  };

  return {
    approveOrder,
    createTransaction,
    executeOrder,
    loadConfig,
    createCreditCardTransaction,
    captureOrder,
    getScript,
    ...toRefs(state.value),
  };
};
