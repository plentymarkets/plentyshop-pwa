import type { RequestPasswordResetParams } from '@plentymarkets/shop-api';

export interface UseResetPasswordState {
  loading: boolean;
}

export type SendEmail = (params: RequestPasswordResetParams) => void;

export interface UseResetPassword {
  loading: Readonly<Ref<UseReturnOrderState['loading']>>;
  sendEmail: SendEmail;
}

export type UseResetPasswordReturn = () => UseResetPassword;
