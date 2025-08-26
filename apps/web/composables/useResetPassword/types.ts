import type { RequestPasswordResetParams, User } from '@plentymarkets/shop-api';

export interface UseResetPasswordState {
  data: User | null;
  loading: boolean;
}

export type ResetPassword = (params: string) => void;
export type SendEmail = (params: RequestPasswordResetParams) => void;

export interface UseResetPassword {
  data: Readonly<Ref<UseResetPasswordState['data']>>;
  loading: Readonly<Ref<UseResetPasswordState['loading']>>;
  sendEmail: SendEmail;
}

export type UseResetPasswordReturn = () => UseResetPassword;
