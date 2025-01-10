import type { ShippingProvider, ShippingMethod } from '@plentymarkets/shop-api';
import { shippingProviderGetters } from '@plentymarkets/shop-api';
import type {
  UseCartShippingMethodsState,
  UseCartShippingMethodsReturn,
  GetShippingMethods,
  SaveShippingMethod,
  SetSelectedMethod,
} from '~/composables/useCartShippingMethods/types';

/**
 * @description Composable for managing shipping methods.
 * @example
 * ``` ts
 * const { data, loading, getShippingMethods, saveShippingMethod } = useCartShippingMethods();
 * ```
 */
export const useCartShippingMethods: UseCartShippingMethodsReturn = () => {
  const state = useState<UseCartShippingMethodsState>('useCartSippingMethods', () => ({
    data: {} as ShippingProvider,
    loading: false,
    selectedMethod: {} as ShippingMethod,
  }));

  const setSelectedMethod: SetSelectedMethod = (shippingMethodId: number) => {
    state.value.selectedMethod = state.value.data.list?.find(
      (method) => method.parcelServicePresetId === Number(shippingMethodId),
    );
  };

  /**
   * @description Function for fetching shipping methods.
   * @example
   * ``` ts
   * getShippingMethods();
   * ```
   */
  const getShippingMethods: GetShippingMethods = async () => {
    state.value.loading = true;

    const { data: cart } = useCart();

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getShippingProvider());
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;

    setSelectedMethod(Number(shippingProviderGetters.getShippingProfileId(cart.value)));

    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for selecting shipping method.
   * @param shippingMethodId
   * @example
   * ``` ts
   * saveShippingMethod(1);
   * ```
   */
  const saveShippingMethod: SaveShippingMethod = async (shippingMethodId: number) => {
    state.value.loading = true;
    const { error } = await useAsyncData(() =>
      useSdk().plentysystems.setShippingProvider({
        shippingId: shippingMethodId,
      }),
    );

    setSelectedMethod(shippingMethodId);

    useHandleError(error.value);
    state.value.loading = false;
    return state.value.data;
  };

  return {
    saveShippingMethod,
    getShippingMethods,
    ...toRefs(state.value),
  };
};
