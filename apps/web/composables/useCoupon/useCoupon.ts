import type { UseCouponReturn, UseCouponState, AddCoupon, DeleteCoupon } from './types';
import type { Cart, DoAddCouponParams } from '@plentymarkets/shop-api';

/**
 * @description Composable for managing coupons.
 * @returns UseCouponReturn
 * @example
 * ``` ts
 * const { addCoupon, deleteCoupon, loading } = useCoupon();
 * ```
 */
export const useCoupon: UseCouponReturn = () => {
  const state = useState<UseCouponState>('coupon', () => ({
    loading: false,
  }));

  /**
   * @description Function for adding a coupon to curent cart.
   * @param params { DoAddCouponParams }
   * @return Cart
   * @example
   * ``` ts
   * addCoupon({
      couponCode: 'Z23ZMP'
    })
   * ```
   */
  const addCoupon: AddCoupon = async (params: DoAddCouponParams) => {
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();
    const { getCart } = useCart();
    state.value.loading = true;
    if (params.couponCode.trim() === '') {
      send({ message: $i18n.t('coupon.pleaseProvideCoupon'), type: 'warning' });
      state.value.loading = false;
      return {} as Cart;
    }
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doAddCoupon(params));
    state.value.loading = false;

    useHandleError(error.value);

    if (data.value) {
      await getCart();
      send({ message: $i18n.t('coupon.couponApplied'), type: 'positive' });
    }
    return {} as Cart;
  };

  const deleteCoupon: DeleteCoupon = async (params: DoAddCouponParams) => {
    state.value.loading = true;
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();
    const { getCart } = useCart();

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.deleteCoupon(params));
    state.value.loading = false;

    useHandleError(error.value);

    if (data.value) {
      await getCart();
      send({ message: $i18n.t('coupon.couponRemoved'), type: 'positive' });
    }
    return {} as Cart;
  };

  return {
    addCoupon,
    deleteCoupon,
    ...toRefs(state.value),
  };
};
