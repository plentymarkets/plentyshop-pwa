import type { UseResetPasswordState, UseResetPasswordReturn, SendEmail } from './types';
import type { ApiError, RequestPasswordResetParams } from '@plentymarkets/shop-api';

export const useResetPassword: UseResetPasswordReturn = () => {
  const state = useState<UseResetPasswordState>(`useResetPassword`, () => ({
    loading: false,
  }));

  const sendEmail: SendEmail = async (params: RequestPasswordResetParams) => {
    try {
      state.value.loading = true;
      await useSdk().plentysystems.doRequestResetPasswordLink(params);
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    sendEmail,
    ...toRefs(state.value),
  };
};
