import { type FUNDING_SOURCE, loadScript as loadPayPalScript } from '@paypal/paypal-js';
import type {
  ApiError,
  PayPalConfigResponse,
  PayPalCreateOrder,
  PayPalCreateOrderRequest,
} from '@plentymarkets/shop-api';
import { paypalGetters } from '@plentymarkets/shop-api';

const localeMap: Record<string, string> = { de: 'de_DE' };
const getLocaleForPayPal = (locale: string): string => localeMap[locale] || 'en_US';

/**
 * @description Composable for managing PayPal interaction.
 * @example
 * ``` ts
 * const {
 * loading, paypalScript, order, config, loadScript, loadConfig, createTransaction, approveOrder, executeOrder,
 * createCreditCardTransaction, captureOrder } = usePayPal();
 * ```
 */
export const usePayPal = () => {
  const state = useState('usePayPal', () => ({
    loading: false,
    paypalScript: null as PayPalScript | null,
    loadingScripts: {} as PayPalLoadScript,
    order: null as PayPalCreateOrder | null,
    config: null as PayPalConfigResponse | null,
    loadedConfig: false,
    isAvailable: false,
    isReady: false,
    activatedAPMs: false,
    fraudId: null as string | null,
  }));

  /**
   * @description Function to get the PayPal config.
   * @example
   * ``` ts
   * loadConfig();
   * ```
   */
  const loadConfig = async () => {
    if (state.value.loadedConfig) return false;
    try {
      const { data } = await useSdk().plentysystems.getPayPalMerchantAndClientIds();
      if (data) {
        state.value.config = data ?? null;
        state.value.isAvailable = !!state.value.config;
        state.value.loadedConfig = true;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateAvailableAPMs = async (currency: string, commit: boolean = true) => {
    const script = await getScript(currency, commit);
    if (script && script.getFundingSources && !state.value.activatedAPMs) {
      state.value.activatedAPMs = true;
      const availableFoundingSources = new Map();
      const fundingSources = script.getFundingSources();
      fundingSources.forEach((fundingSource: string) => {
        if (script.isFundingEligible) {
          availableFoundingSources.set(fundingSource, true);
        }
      });
      availableFoundingSources.set('googlepay', true);
      await useSdk().plentysystems.doHandlePayPalFundingSources({
        availableFundingSources: Object.fromEntries(availableFoundingSources),
      });
    }
  };

  /**
   * @description Function for get the PayPal sdk script.
   * @param currency string
   * @param locale string
   * @param commit boolean
   * @return Promise<PayPalNamespace | null>
   * @example
   * ``` ts
   * loadScript('EUR');
   * ```
   */
  const loadScript = async (currency: string, locale: string, commit = false) => {
    await loadConfig();
    if (state.value.config && paypalGetters.getClientId(state.value.config)) {
      try {
        return await loadPayPalScript({
          clientId: paypalGetters.getClientId(state.value.config),
          merchantId: paypalGetters.getMerchantId(state.value.config),
          currency: currency,
          dataPartnerAttributionId: 'Plenty_Cart_PWA_PPCP',
          components:
            'applepay,googlepay,messages,buttons,funding-eligibility,card-fields,payment-fields,marks,legal&enable-funding=paylater',
          locale: locale,
          commit: commit,
        });
      } catch {
        // TODO: Handle error (not loading sdk)
      }
    }

    return null;
  };

  /**
   * @description Function to get the PayPal SDK script.
   * @param currency
   * @param commit
   */
  const getScript = async (currency: string, commit = false) => {
    const { $i18n } = useNuxtApp();
    const localePayPal = getLocaleForPayPal($i18n.locale.value);
    const scriptKey = `${currency}_${localePayPal}_${commit}`;

    if (state.value.loadingScripts[scriptKey] !== undefined) {
      state.value.isReady = true;
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

    state.value.loadingScripts = {};
    state.value.isReady = false;
    state.value.paypalScript = null;
    state.value.loadingScripts[scriptKey] = loadScript(currency, localePayPal, commit)
      .then((paypalScript) => {
        state.value.paypalScript = { script: paypalScript, currency, locale: localePayPal, commit };
        state.value.isReady = true;
        return paypalScript;
      })
      .finally(() => {
        delete state.value.loadingScripts.scriptKey;
      });

    return state.value.loadingScripts[scriptKey];
  };

  /**
   * @description Function to get order details from PayPal.
   * @example
   * ``` ts
   * getOrder('paypal_transaction_id');
   * ```
   */
  const getOrder = async (paypalOrderId: string) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.getPayPalOrder({
        paypalOrderId,
      });
      return data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return null;
  };

  /**
   * @description Function to get order details from PayPal.
   * @example
   * ``` ts
   * getOrder('paypal_transaction_id');
   * ```
   */
  const setAddressesFromPayPal = async (paypalOrderId: string) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.doHandlePayPalAddress({
        paypalOrderId,
      });
      return data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return null;
  };

  /**
   * @description Function to get the fraud id.
   * @example
   * ``` ts
   * getFraudId();
   * ```
   */
  const getFraudId = async () => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.getPayPalFraudId();
      state.value.fraudId = data.fraudId ?? null;
    } catch (error) {
      useHandleError(error as ApiError);
      state.value.fraudId = null;
    } finally {
      state.value.loading = false;
    }

    return state.value.fraudId;
  };

  /**
   * @description Function for creating a PayPal transaction.
   * @return CreateTransaction
   * @example
   * ``` ts
   * createTransaction('paypal', true);
   * ```
   * @param params
   */
  const createTransaction = async (params: PayPalCreateOrderRequest) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.doCreatePayPalOrder(params);
      state.value.order = data ?? null;
    } catch (error) {
      useHandleError(error as ApiError);
      state.value.order = null;
    } finally {
      state.value.loading = false;
    }

    return state.value.order;
  };

  /**
   * @description Function for (re-)capturing a PayPal order.
   * @param PayPalOrderId string
   * @return CaptureOrder
   * @example
   * ``` ts
   * captureOrder({
   *    paypalOrderId: '1'
   * });
   * ```
   */
  const captureOrder = async (PayPalOrderId: string) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.doCapturePayPalOrderV2({
        paypalOrderId: PayPalOrderId,
      });
      return data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return null;
  };

  /**
   * @description Function for (re-)capturing a PayPal order.
   * @param PayPalOrderId string
   * @param plentyOrderId number
   * @return CaptureOrder
   * @example
   * ``` ts
   * captureOrder({
   *    paypalOrderId: '1'
   * });
   * ```
   */
  const createPlentyPaymentFromPayPalOrder = async (PayPalOrderId: string, plentyOrderId: number) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.doCreatePlentyPaymentFromPayPalOrder({
        payPalOrderId: PayPalOrderId,
        plentyOrderId,
      });
      return data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return null;
  };

  /**
   * @description Function for create a Plenty order.
   * @return Order | null
   * @example
   * ``` ts
   * createPlentyOrder();
   * ```
   */
  const createPlentyOrder = async () => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.doPlaceOrder();
      return data;
    } catch (error) {
      useHandleError(error as ApiError);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    state,
    createPlentyOrder,
    createTransaction,
    loadConfig,
    captureOrder,
    getScript,
    getOrder,
    updateAvailableAPMs,
    getFraudId,
    createPlentyPaymentFromPayPalOrder,
    setAddressesFromPayPal,
    ...toRefs(state.value),
  };
};
