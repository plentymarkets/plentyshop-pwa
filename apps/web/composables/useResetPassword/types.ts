import type { RequestPasswordResetParams, User, ResetPasswordParams } from '@plentymarkets/shop-api';

export interface UseResetPasswordState {
  data: User | null;
  loading: boolean;
}

export type ResetPassword = (params: ResetPasswordParams) => void;
export type SendEmail = (params: RequestPasswordResetParams) => void;

export interface UseResetPassword {
  data: Readonly<Ref<UseResetPasswordState['data']>>;
  loading: Readonly<Ref<UseResetPasswordState['loading']>>;
  sendEmail: SendEmail;
  resetPassword: ResetPassword;
}

export type UseResetPasswordReturn = () => UseResetPassword;
