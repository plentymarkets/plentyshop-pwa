export interface PaymentEligibility {
  googlePayEligible: boolean;
  applePayEligible: boolean;
}

export type SetMobilePayment = () => Promise<PaymentEligibility>;

export interface UseMobilePaymentMethods {
  setMobilePayments: SetMobilePayment;
}

export type UseMobileMethodsReturn = () => UseMobilePaymentMethods;
