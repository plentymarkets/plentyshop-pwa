import type { AdditionalInformationParams } from '@plentymarkets/shop-api';
import { useSdk } from '~/sdk';
import type {
  DoAdditionalInformation,
  DoAdditionalInformationReturn,
  SetShippingPrivacyAgreement,
  UseAdditionalInformationState,
} from './types';

/**
 * @description Composable for setting additional information.
 * @returns DoAdditionalInformationReturn
 * @example
 * ``` ts
 * const {
 * data, loading, shippingPrivacyAgreement, setShippingPrivacyAgreement, doAdditionalInformation
 * } = useAdditionalInformation();
 * ```
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
   * ``` ts
   * doAdditionalInformation({
   *   orderContactWish: null,
   *   orderCustomerSign: null,
   *   shippingPrivacyHintAccepted: true,
   *   templateType: 'checkout'
   * });
   * ```
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
   * @description Function for setting the shipping privacy agreement value.
   * @example
   * ``` ts
   * setShippingPrivacyAgreement({
   *   shippingPrivacyAgreement: true
   * });
   * ```
   */
  const setShippingPrivacyAgreement: SetShippingPrivacyAgreement = (shippingPrivacyAgreement: boolean) => {
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
