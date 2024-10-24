import { type AggregatedCountries } from '@plentymarkets/shop-api';
import { type UseAggregatedCountriesReturn, UseAggregatedCountriesState, type GetAggregatedCountries } from './types';

/**
 * @description Composable for getting `AggregatedCountries`:
 * - Active shipping countries
 * - EU geo-regulated countries
 *
 * @example
 * ``` ts
 * const {
 *  data,
 *  loading,
 *  useGeoRegulatedCountries,
 *  getAggregatedCountries,
 *  getDefaultCountries,
 *  getGeoRegulatedCountries,
 * } = useAggregatedCountries();
 * ```
 */
export const useAggregatedCountries: UseAggregatedCountriesReturn = () => {
  const state = useState<UseAggregatedCountriesState>('useAggregatedCountries', () => ({
    data: {} as AggregatedCountries,
    loading: false,
  }));

  const useGeoRegulatedCountries = state.value.data?.geoRegulated?.length > 0;

  const getAggregatedCountries: GetAggregatedCountries = async () => {
    state.value.loading = true;

    const { data, error } = await useAsyncData('getAggregatedCountries', () =>
      useSdk().plentysystems.getAggregatedCountries(),
    );

    useHandleError(error.value);

    if (data.value?.data) state.value.data = data.value.data;
    state.value.loading = false;

    return state.value.data;
  };

  const getDefaultCountries = () => (state.value.data?.default?.length > 0 ? state.value.data.default : []);
  const getGeoRegulatedCountries = () => (useGeoRegulatedCountries ? state.value.data.geoRegulated : []);

  return {
    useGeoRegulatedCountries,
    getAggregatedCountries,
    getDefaultCountries,
    getGeoRegulatedCountries,
    ...toRefs(state.value),
  };
};
