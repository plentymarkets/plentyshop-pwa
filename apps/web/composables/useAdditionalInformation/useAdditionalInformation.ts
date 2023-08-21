import type { AdditionalInformationParams } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import {
  DoAdditionalInformation,
  DoAdditionalInformationReturn,
  SetShippingPrivacyAgreement,
  UseAdditionalInformationState
} from './types';

/**
 * @description Composable for setting additional information.
 * @returns {@link DoAdditionalInformationReturn}
 * @example
 * const { data, loading, shippingPrivacyAgreement } = useAdditionalInformation();
 */
export const useAdditionalInformation: DoAdditionalInformationReturn = () => {
  const state = useState<UseAdditionalInformationState>('useAdditionalInformation', () => ({
    data: null,
    loading: false,
    shippingPrivacyAgreement: false,
  }));

  /**
   * @description Function for setting the additional information.
   * @example
   * doAdditionalInformation({
   *   orderContactWish: null,
   *   orderCustomerSign: null,
   *   shippingPrivacyHintAccepted: true,
   *   templateType: 'checkout'
   * });
   */
  const doAdditionalInformation: DoAdditionalInformation = async (params: AdditionalInformationParams) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() => useSdk().plentysystems.doAdditionalInformation(params));
      useHandleError(error.value);
      state.value.data = data?.value?.data ?? state.value.data;

      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for setting the additional information.
   * @example
   * setShippingPrivacyAgreement({
   *   shippingPrivacyAgreement: true
   * });
   */
  const setShippingPrivacyAgreement: SetShippingPrivacyAgreement = async (shippingPrivacyAgreement: boolean) => {
    state.value.loading = true;
    state.value.shippingPrivacyAgreement = shippingPrivacyAgreement;
    state.value.loading = false;
  };

  return {
    setShippingPrivacyAgreement,
    doAdditionalInformation,
    ...toRefs(state.value),
  };
};
