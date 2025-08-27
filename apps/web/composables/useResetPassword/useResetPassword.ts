import type { UseResetPasswordState, UseResetPasswordReturn, SendEmail, ResetPassword } from './types';
import type { ApiError, RequestPasswordResetParams, ResetPasswordParams } from '@plentymarkets/shop-api';

export const useResetPassword: UseResetPasswordReturn = () => {
  const state = useState<UseResetPasswordState>(`useResetPassword`, () => ({
    data: null,
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

  const resetPassword: ResetPassword = async (params: ResetPasswordParams) => {
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.doResetPassword(params);
      state.value.data = data ?? null;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    sendEmail,
    resetPassword,
    ...toRefs(state.value),
  };
};
