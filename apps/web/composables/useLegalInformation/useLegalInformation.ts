import type {
  LegalInformationResponse,
  LegalTextsParams,
} from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
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
   * @description Function for fetching the category tree.
   * @example
   * getCategoryTree();
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
