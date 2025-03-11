import type { ActiveShippingCountry, Data } from '@plentymarkets/shop-api';
import type {
  GetActiveShippingCountries,
  UseActiveShippingCountriesReturn,
  UseActiveShippingCountriesState,
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

    const { data, error } = await useAsyncData(
      'getActiveShippingCountries',
      (): Promise<Data<ActiveShippingCountry[]>> => useSdk().plentysystems.getActiveShippingCountries(),
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
