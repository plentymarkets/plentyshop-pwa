import { PaymentEligibility, UseMobileMethodsReturn, UseMobilePaymentMethods } from './types';

const checkMobilePayments = async (): Promise<PaymentEligibility> => {
  // Load Google Pay SDK and check if loaded successfully
  const googlePayLoaded = await loadGooglePayScript();

  const applePayEligible = checkApplePayEligibility();
  const googlePayEligible = googlePayLoaded ? await checkGooglePayEligibility() : false;

  return {
    applePayEligible,
    googlePayEligible,
  };
};

// Dynamically load Google Pay SDK
function loadGooglePayScript(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const existingScript = document.querySelector('#google-pay-script');

      if (existingScript) {
        // If script is already loaded, resolve immediately
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.async = true;
      script.id = 'google-pay-script';

      // Event listener for successful script load
      script.addEventListener('load', () => {
        resolve(true);
      });

      // Event listener for script loading errors
      script.addEventListener('error', () => {
        console.error('Failed to load Google Pay script.');
      });

      // Append the script to the document head
      document.head.append(script);
    } catch {
      // In case of any other unexpected error
    }
  });
}

// Check if Google Pay is available
async function checkGooglePayEligibility(): Promise<boolean> {
  if (typeof window === 'undefined' || typeof google === 'undefined' || !google.payments) return false; // Ensure running in a browser environment

  const googlePayClient = new google.payments.api.PaymentsClient({
    environment: 'TEST', // or 'TEST' depending on your environment
  });

  type PaymentMethodType = 'CARD' | 'PAYPAL'; // Adjust according to the actual definition

  const isReadyToPayRequest: google.payments.api.IsReadyToPayRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD', // Ensure this matches `PaymentMethodType`
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'], // Adjust as needed
          allowedCardNetworks: ['AMEX', 'MASTERCARD', 'VISA'], // Adjust card networks
        },
      },
    ],
  };

  try {
    const result = await googlePayClient.isReadyToPay(isReadyToPayRequest);
    return result.result; // true if eligible, false otherwise
  } catch (error) {
    console.error('Error checking Google Pay eligibility:', error);
    return false;
  }
}

// Check if Apple Pay is available
function checkApplePayEligibility(): boolean {
  return typeof ApplePaySession !== 'undefined' && ApplePaySession.canMakePayments();
}

export const useMobileMethods: UseMobileMethodsReturn = (): UseMobilePaymentMethods => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const setMobilePayments: any = async () => {
    const { applePayEligible, googlePayEligible } = await checkMobilePayments();
    const { data, error } = await useAsyncData('', () => {
      const mobilePayments: string[] = [];

      if (applePayEligible) {
        mobilePayments.push('PAYPAL_APPLE_PAY');
      }

      if (googlePayEligible) {
        mobilePayments.push('PAYPAL_GOOGLE_PAY');
      }
      if (mobilePayments && mobilePayments.length > 0) {
        return useSdk().plentysystems.setMobilePaymentProviderList({
          mobilePayments: mobilePayments,
        });
      }
      return mobilePayments as any;
    });
  };

  return {
    setMobilePayments,
  };
};
