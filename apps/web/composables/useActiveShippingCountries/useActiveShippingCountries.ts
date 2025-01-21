import type { ActiveShippingCountry } from '@plentymarkets/shop-api';
import type {
  UseActiveShippingCountriesState,
  UseActiveShippingCountriesReturn,
  GetActiveShippingCountries,
} from './types';

/**
 * @description Composable for getting an array of `ActiveShippingCountry`.
 * @example
 * ``` ts
 * const {
 *  data,
 *  loading,
 *  getActiveShippingCountries
 * } = useActiveShippingCountries();
 * getActiveShippingCountries();
 * ```
 */

export const useActiveShippingCountries: UseActiveShippingCountriesReturn = () => {
  const state = useState<UseActiveShippingCountriesState>('useActiveShippingCountries', () => ({
    data: [] as ActiveShippingCountry[],
    loading: false,
  }));

  const getActiveShippingCountries: GetActiveShippingCountries = async () => {
    state.value.loading = true;

    const { data, error } = await useAsyncData('getActiveShippingCountries', () =>
      useSdk().plentysystems.getActiveShippingCountries(),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;
    state.value.loading = false;

    return state.value.data;
  };

  return {
    getActiveShippingCountries,
    ...toRefs(state.value),
  };
};
