import type { RequestPasswordResetParams, ResetPasswordParams } from '@plentymarkets/shop-api';

export interface UseResetPasswordState {
  loading: boolean;
}

export type ResetPassword = (params: ResetPasswordParams) => Promise<boolean>;
export type SendEmail = (params: RequestPasswordResetParams) => void;

export interface UseResetPassword {
  loading: Readonly<Ref<UseResetPasswordState['loading']>>;
  sendEmail: SendEmail;
  resetPassword: ResetPassword;
}

export type UseResetPasswordReturn = () => UseResetPassword;
