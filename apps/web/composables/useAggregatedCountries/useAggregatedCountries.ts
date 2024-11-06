import { type AggregatedCountries } from '@plentymarkets/shop-api';
import { type UseAggregatedCountriesReturn, UseAggregatedCountriesState, type FetchAggregatedCountries } from './types';

/**
 * @description Composable for getting `AggregatedCountries`:
 * - Active shipping countries
 * - EU geo-regulated countries
 *
 * @example
 * ``` ts
 * const {
 *  default,
 *  geoRegulated,
 *  loading,
 *  fetchAggregatedCountries,
 *  useGeoRegulatedCountries,
 * } = useAggregatedCountries();
 * ```
 */
export const useAggregatedCountries: UseAggregatedCountriesReturn = () => {
  const state = useState<UseAggregatedCountriesState>('useAggregatedCountries', () => ({
    default: [] as AggregatedCountries['default'],
    geoRegulated: [] as AggregatedCountries['geoRegulated'],
    loading: false,
  }));

  const fetchAggregatedCountries: FetchAggregatedCountries = async () => {
    state.value.loading = true;

    const { data, error } = await useAsyncData('getAggregatedCountries', () =>
      useSdk().plentysystems.getAggregatedCountries(),
    );

    useHandleError(error.value);

    if (data.value?.data) {
      state.value.default = data.value.data.default;
      state.value.geoRegulated = data.value.data.geoRegulated;
    }

    state.value.loading = false;
  };

  const useGeoRegulatedCountries = state.value.geoRegulated.length > 0;
  const billingCountries = computed(() =>
    useGeoRegulatedCountries
      ? [...state.value.default, ...state.value.geoRegulated].sort((a, b) => a.id - b.id)
      : state.value.default,
  );

  return {
    fetchAggregatedCountries,
    useGeoRegulatedCountries,
    billingCountries,
    ...toRefs(state.value),
  };
};
