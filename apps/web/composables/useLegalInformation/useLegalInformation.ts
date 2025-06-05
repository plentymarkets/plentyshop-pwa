import type { LegalInformationResponse, LegalTextsParams } from '@plentymarkets/shop-api';
import type { UseLegalInformationState, UseLegalInformationMethodsReturn, GetLegalInformation } from './types';

/**
 * @description Composable for managing the legal information.
 * @returns UseLegalInformationMethodsReturn
 * @example
 * ``` ts
 * const { data, loading, getLegalTexts } = useLegalInformation();
 * ```
 */
export const useLegalInformation: UseLegalInformationMethodsReturn = () => {
  const state = useState<UseLegalInformationState>('useLegalInformation', () => ({
    data: {} as LegalInformationResponse,
    loading: false,
  }));

  /**
   * @description Function for legal information of the given type.
   * @param params { LegalTextsParams } Type of the legal information
   * @return GetLegalInformation
   * @example
   * ``` ts
   * getLegalTexts({ type: 'CancellationForm' });
   * ```
   * @example
   * ``` ts
   * getLegalTexts({ type: 'CancellationRights' });
   * ```
   * @example
   * ``` ts
   * getLegalTexts({ type: 'LegalDisclosure' });
   * ```
   * @example
   * ``` ts
   * getLegalTexts({ type: 'PrivacyPolicy' });
   * ```
   * @example
   * ``` ts
   * getLegalTexts({ type: 'TermsConditions' });
   * ```
   */
  const getLegalTexts: GetLegalInformation = async (params: LegalTextsParams) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(`${params.type}`, () => useSdk().plentysystems.getLegalTexts(params));
      useHandleError(error.value);
      state.value.data = data?.value?.data ?? state.value.data;
      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    getLegalTexts,
    ...toRefs(state.value),
  };
};
