import type { ShippingProvider, ShippingMethod, ApiError } from '@plentymarkets/shop-api';
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
   * @description Function to set shipping methods list and selected method id.
   * @param list { ShippingMethod[] }
   * @param selectedId { number }
   */
  const setShippingMethods = (list: ShippingMethod[], selectedId: number) => {
    state.value.data.list = list;
    setSelectedMethod(selectedId);
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

    try {
      const { data } = await useSdk().plentysystems.getShippingProvider();
      state.value.data = data ?? state.value.data;
      setSelectedMethod(Number(shippingProviderGetters.getShippingProfileId(cart.value)));
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }

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
    try {
      state.value.loading = true;
      await useSdk().plentysystems.setShippingProvider({
        shippingId: shippingMethodId,
      });

      setSelectedMethod(shippingMethodId);
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }

    return state.value.data;
  };

  return {
    setShippingMethods,
    saveShippingMethod,
    getShippingMethods,
    ...toRefs(state.value),
  };
};
