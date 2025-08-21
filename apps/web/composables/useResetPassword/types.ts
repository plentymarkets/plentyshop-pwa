// import type { RequestPasswordResetParams } from '@plentymarkets/shop-api'; TODO: after shop api release use this line

export interface UseResetPasswordState {
  loading: boolean;
}

export type SendEmail = (emal: string) => void; // TODO: replace email: string with "RequestPasswordResetParams" after shop-api release

export interface UseResetPassword {
  loading: Readonly<Ref<UseReturnOrderState['loading']>>;
  sendEmail: SendEmail;
}

export type UseResetPasswordReturn = () => UseResetPassword;
