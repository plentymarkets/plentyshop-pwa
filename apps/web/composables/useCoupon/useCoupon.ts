import type { UseCouponReturn, UseCouponState, AddCoupon, DeleteCoupon } from './types';
import type { ApiError, Cart, DoAddCouponParams } from '@plentymarkets/shop-api';

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
    const { fetchSession } = useFetchSession();
    state.value.loading = true;
    if (params.couponCode.trim() === '') {
      send({ message: $i18n.t('coupon.pleaseProvideCoupon'), type: 'warning' });
      state.value.loading = false;
      return {} as Cart;
    }

    try {
      await useSdk().plentysystems.doAddCoupon(params);
      await fetchSession();
      send({ message: $i18n.t('coupon.couponApplied'), type: 'positive' });
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return {} as Cart;
  };

  const deleteCoupon: DeleteCoupon = async (params: DoAddCouponParams) => {
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();
    const { fetchSession } = useFetchSession();

    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.deleteCoupon(params);

      if (data) {
        await fetchSession();
        send({ message: $i18n.t('coupon.couponRemoved'), type: 'positive' });
      }
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }

    return {} as Cart;
  };

  return {
    addCoupon,
    deleteCoupon,
    ...toRefs(state.value),
  };
};
