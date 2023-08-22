import { loadScript as loadPayPalScript, PayPalNamespace } from '@paypal/paypal-js';
import { paypalGetters } from '~/getters/paypalGetters';
import type { UsePayPalMethodsReturn, UsePayPalMethods, LoadScript, UsePayPalState } from './types';

/**
 * @description Composable for paypal.
 * @returns {@link UsePayPalMethodsReturn}
 * @example
 * const { loadScript } = usePayPal();
 */
export const usePayPal: UsePayPalMethodsReturn = () => {
  const state = useState<UsePayPalState>('usePayPal', () => ({
    PayPalScript: null,
  }));

  /**
   * @description Function for fetching the category tree.
   * @example
   * loadScript(currency: string);
   */
  const loadScript: LoadScript = async (currency: string) => {
    try {
      state.value.PayPalScript = await loadPayPalScript({
        clientId: 'Ab_wQoMAfzuqCrl4gVfYvkNHmBS_s_rQKMafFJrArKJ4GZU8nbSIn53v4Q8ZZfoHR01kxnjkDF4yVLAv',
        currency: currency,
      });
      return state.value.PayPalScript;
    } catch {
      // console.error('failed to load the PayPal JS SDK script', error);
    }
    return null;
  };

  return {
    state,
    loadScript,
  };
};
