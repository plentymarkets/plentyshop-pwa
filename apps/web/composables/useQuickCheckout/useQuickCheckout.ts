import type {
  CloseQuickCheckout,
  EndTimer,
  OpenQuickCheckout,
  StartTimer,
  UseQuickCheckoutReturn,
  UseQuickCheckoutState,
} from './types';
import type { Product } from '@plentymarkets/shop-api';

/**
 * @description Composable for managing the quick checkout.
 * @returns UseCouponReturn
 * @example
 * ``` ts
 * const {
 * isOpen, timer, loading, endTimer, openQuickCheckout, closeQuickCheckout, startTimer, product
 * } = useQuickCheckout();
 * ```
 */
export const useQuickCheckout: UseQuickCheckoutReturn = () => {
  const state = useState<UseQuickCheckoutState>('quickCheckout', () => ({
    loading: false,
    isOpen: false,
    quantity: 1,
    product: {} as Product,
    timer: defaults.DEFAULT_QUICK_CHECKOUT_TIMER,
  }));

  let interval = setTimeout(() => {});

  /**
   * @description Function for ending quick checkout timer.
   * @return EndTimer
   * @example
   * ``` ts
   * endTimer();
   * ```
   */
  const endTimer: EndTimer = () => {
    const config = useRuntimeConfig();
    if (!config.public.enableQuickCheckoutTimer) {
      return;
    }

    if (state.value.timer === 0) {
      return;
    }

    clearInterval(interval);
    state.value.timer = 0;
  };

  /**
   * @description Function for opening quick checkout.
   * @return OpenQuickCheckout
   * @example
   * ``` ts
   * openQuickCheckout();
   * ```
   */
  const openQuickCheckout: OpenQuickCheckout = (product: Product, quantity: number) => {
    state.value.product = product;
    state.value.quantity = quantity;
    state.value.isOpen = true;
  };

  /**
   * @description Function for closing quick checkout.
   * @return CloseQuickCheckout
   * @example
   * ``` ts
   * closeQuickCheckout();
   * ```
   */
  const closeQuickCheckout: CloseQuickCheckout = () => {
    state.value.isOpen = false;
  };

  /**
   * @description Function for starting the quick checkout timer.
   * @return StartTimer
   * @example
   * ``` ts
   * startTimer();
   * ```
   */
  const startTimer: StartTimer = () => {
    const config = useRuntimeConfig();

    if (!config.public.enableQuickCheckoutTimer) {
      return;
    }

    state.value.timer = defaults.DEFAULT_QUICK_CHECKOUT_TIMER;

    interval = setInterval(() => {
      state.value.timer--;

      if (state.value.timer <= 0) {
        closeQuickCheckout();
        clearInterval(interval);
      }
    }, 1000);
  };

  /**
   * @description Getter for checking display of timer.
   * @return boolen
   * @example
   * ``` ts
   * hasTimer === true;
   * ```
   */
  const hasTimer = computed(() => {
    const config = useRuntimeConfig();
    return Boolean(state.value.timer && config.public.enableQuickCheckoutTimer);
  });

  return {
    startTimer,
    endTimer,
    openQuickCheckout,
    closeQuickCheckout,
    hasTimer,
    ...toRefs(state.value),
  };
};
