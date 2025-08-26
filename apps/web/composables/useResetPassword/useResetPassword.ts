import type { UseResetPasswordState, UseResetPasswordReturn, SendEmail, ResetPassword } from './types';
import type { ApiError, RequestPasswordResetParams } from '@plentymarkets/shop-api'; // TODO: add ResetPasswordParams later on after sdk release

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

  const resetPassword: ResetPassword = async (params: string) => {
    console.log(params);
    // TODO: add ResetPasswordParams later on as params type after sdk release
    try {
      state.value.loading = true;
      // const {data} = await useSdk().plentysystems.doResetPassword(params); TODO: add after
      // state.value.data = data.value ?? null; //TODO: add later after sdk release
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
