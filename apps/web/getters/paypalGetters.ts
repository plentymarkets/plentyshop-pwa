import integrationConfig from '../integration.config';

interface PayPalConfig {
  paymentId: number;
  clientId: string;
  creditCardPaymentId: number;
  merchantId: string;
}

function getConfig(): PayPalConfig | null {
  return integrationConfig?.payment?.paypal ?? null;
}

function getClientId(): string | null {
  const config = getConfig();

  return config?.clientId ?? null;
}

function getMerchantId(): string | null {
  const config = getConfig();

  return config?.merchantId ?? null;
}

export const paypalGetters = {
  getConfig,
  getClientId,
  getMerchantId,
};
