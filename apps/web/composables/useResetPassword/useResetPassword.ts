import type { UseResetPasswordState, UseResetPasswordReturn, SendEmail, ResetPassword } from './types';
import type { ApiError, RequestPasswordResetParams, ResetPasswordParams } from '@plentymarkets/shop-api';

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

  const resetPassword: ResetPassword = async (params: ResetPasswordParams): Promise<boolean> => {
    try {
      const success = ref(false);
      state.value.loading = true;
      await useSdk().plentysystems.doResetPassword(params);
      success.value = true;
      return true;
    } catch (error) {
      useHandleError(error as ApiError);
      return false;
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
