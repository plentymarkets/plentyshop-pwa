import { type AggregatedCountries } from '@plentymarkets/shop-api';
import { type UseAggregatedCountriesReturn, UseAggregatedCountriesState, FetchAggregatedCountries } from './types';

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
 *  fetchAggregatedCountries,
 *  defaultCountries,
 *  geoRegulatedCountries,
 * } = useAggregatedCountries();
 * ```
 */
export const useAggregatedCountries: UseAggregatedCountriesReturn = () => {
  const state = useState<UseAggregatedCountriesState>('useAggregatedCountries', () => ({
    data: {
      default: [],
      geoRegulated: [],
    } as AggregatedCountries,
    loading: false,
  }));

  const fetchAggregatedCountries: FetchAggregatedCountries = async () => {
    state.value.loading = true;

    const { data, error } = await useAsyncData('getAggregatedCountries', () =>
      useSdk().plentysystems.getAggregatedCountries(),
    );

    useHandleError(error.value);

    if (data.value?.data) state.value.data = data.value.data;
    state.value.loading = false;

    return state.value.data;
  };

  const defaultCountries = () => state.value.data.default;
  const geoRegulatedCountries = () => state.value.data.geoRegulated;
  const useGeoRegulatedCountries = geoRegulatedCountries().length > 0;

  return {
    fetchAggregatedCountries,
    defaultCountries,
    geoRegulatedCountries,
    useGeoRegulatedCountries,
    ...toRefs(state.value),
  };
};
