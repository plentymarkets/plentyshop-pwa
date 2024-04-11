import type { OpenQuickCheckout, UseQuickCheckoutReturn, UseQuickCheckoutState } from './types';

/**
 * @description Composable for managing the quick checkout.
 * @returns UseCouponReturn
 * @example
 * ``` ts
 * const { addCoupon, deleteCoupon, loading } = useQuickCheckout();
 * ```
 */
export const useQuickCheckout: UseQuickCheckoutReturn = () => {
  const state = useState<UseQuickCheckoutState>('quickCheckout', () => ({
    loading: false,
    isOpen: false,
    timer: 15,
  }));

  let interval = setTimeout(() => {});

  const endTimer = () => {
    if (state.value.timer === 0) {
      return;
    }

    clearInterval(interval);
    state.value.timer = 0;
  };

  const openQuickCheckout: OpenQuickCheckout = () => {
    state.value.isOpen = true;
  };

  const closeQuickCheckout = () => {
    state.value.isOpen = false;
  };

  const startTimer = () => {
    console.log('start timer');
    state.value.timer = 15;

    interval = setInterval(() => {
      state.value.timer--;

      if (state.value.timer <= 0) {
        closeQuickCheckout();
        clearInterval(interval);
      }
    }, 1000);
  };

  return {
    startTimer,
    endTimer,
    openQuickCheckout,
    closeQuickCheckout,
    ...toRefs(state.value),
  };
};
