import type { ApiError } from '@plentymarkets/shop-api';
import type { SubmitCancellation, UseCancellationFormReturn, UseCancellationFormState } from './types';

export const useCancellationForm: UseCancellationFormReturn = () => {
  const state = useState<UseCancellationFormState>('useCancellationForm', () => ({
    loading: false,
  }));

  const submitCancellation: SubmitCancellation = async (params) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.doSubmitCancellation(params);
      return data?.email ?? null;
    } catch (error) {
      useHandleError(error as ApiError);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    submitCancellation,
    ...toRefs(state.value),
  };
};