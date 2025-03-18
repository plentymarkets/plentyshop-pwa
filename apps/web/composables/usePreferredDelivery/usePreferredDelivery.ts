import type {
  UsePreferredDeliveryReturn,
  UsePreferredDeliveryState,
  LoadAvailableShippingProfiles,
  LoadShippingProfileServices,
} from './types';
import type { preferredDeliveryProfileServiceParams } from '@plentymarkets/shop-api';

export const usePreferredDelivery: UsePreferredDeliveryReturn = () => {
  const state = useState<UsePreferredDeliveryState>('preferredDeliveryState', () => ({
    loading: false,
    data: {},
  }));

  /**
   * @description Function for loading the available shipping provider for preferred delivery
   * @return ...
   */
  const loadAvailableShippingProfiles: LoadAvailableShippingProfiles = async () => {
    state.value.loading = true;

    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.getPreferredDeliveryAvailableShippingProfiles(),
    );
    state.value.loading = false;
    state.value.data = data.value?.data ?? { 0: [] };

    useHandleError(error.value);
    return state.value.data;
  };

  //{{plentyBackendUrl}}/rest/dhl-shipping/preferred-delivery/parcel-manager/services
  /**
   * @description ...
   * @return ...
   */
  const loadShippingProfileServices: LoadShippingProfileServices = async (
    params: preferredDeliveryProfileServiceParams,
  ) => {
    state.value.loading = true;

    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.getPreferredDeliveryProfileServices(params),
    );
    console.log(data);
    console.log(error);
    state.value.loading = false;
    state.value.data = data.value?.data ?? {};

    useHandleError(error.value);
    return state.value.data;
  };

  return {
    loadAvailableShippingProfiles,
    loadShippingProfileServices,
    ...toRefs(state.value),
  };
};
