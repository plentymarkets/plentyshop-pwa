import integrationConfig from '../integration.config';

interface PayPalConfig {
  paymentId: number;
  clientId: string;
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

function getPaymentId(): number {
  const config = getConfig();

  return config?.paymentId ?? -1;
}

export const paypalGetters = {
  getConfig,
  getClientId,
  getMerchantId,
  getPaymentId,
};
