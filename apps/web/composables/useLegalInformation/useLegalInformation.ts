import type {
  LegalInformationResponse,
  LegalTextsParams,
} from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import type { UseLegalInformationState, UseLegalInformationMethodsReturn, GetLegalInformation } from './types';

/**
 * @description Composable for getting the legal information.
 * @returns {@link UseLegalInformationMethodsReturn}
 * @example
 * const { data, loading } = useLegalInformation();
 */
export const useLegalInformation: UseLegalInformationMethodsReturn = () => {
  const state = useState<UseLegalInformationState>('useLegalInformation', () => ({
    data: {} as LegalInformationResponse,
    loading: false,
  }));

  /**
   * @description Function for legal information of the given type.
   * @param LegalTextsParams Type of the legal information
   * @example
   * getLegalTexts({type: 'CancellationForm',});
   * @example
   * getLegalTexts({type: 'CancellationRights',});
   * @example
   * getLegalTexts({type: 'LegalDisclosure',});
   * @example
   * getLegalTexts({type: 'PrivacyPolicy',});
   * @example
   * getLegalTexts({type: 'TermsConditions',});
   */
  const getLegalTexts: GetLegalInformation = async (params: LegalTextsParams) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() => useSdk().plentysystems.getLegalTexts(params));
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
