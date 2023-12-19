import { UseCouponReturn, UseCouponState, AddCoupon, DeleteCoupon } from './types';
import { useSdk } from '~/sdk';
import { DoAddCouponParams } from '@plentymarkets/shop-api';
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
      couponCode: 'KB82AZ'
    })
   * ```
   */
  const addCoupon: AddCoupon = async (params: DoAddCouponParams) => {
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();
    const { getCart } = useCart();
    state.value.loading = true;
    const response = await useAsyncData(() => useSdk().plentysystems.doAddCoupon(params));
    state.value.loading = false;
    if (response.data.value.data) {
      await getCart();
      send({ message: $i18n.t('coupon.couponApplied'), type: 'positive' });
    } else if (response.data.value.error) {
      const error = {
        status: 500,
        message: $i18n.t(`error.${getErrorCode(response.data.value.error.code)}`),
        statusMessage: $i18n.t(`error.${getErrorCode(response.data.value.error.code)}`),
      };
      useHandleError(error);
    }
    return response.data.value.data;
  };

  const deleteCoupon: DeleteCoupon = async (params: DoAddCouponParams) => {
    state.value.loading = true;
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();
    const { getCart } = useCart();

    const response = await useAsyncData(() => useSdk().plentysystems.deleteCoupon(params));
    state.value.loading = false;
    if (response.data.value.data) {
      await getCart();
      send({ message: $i18n.t('coupon.couponRemoved'), type: 'positive' });
    } else if (response.data.value.error) {
      const error = {
        status: 500,
        message: $i18n.t(`error.errorActionIsNotExecuted`),
        statusMessage: $i18n.t(`error.errorActionIsNotExecuted`),
      };

      useHandleError(error);
    }
    return response.data.value.data;
  };

  return {
    addCoupon,
    deleteCoupon,
    ...toRefs(state.value),
  };
};
