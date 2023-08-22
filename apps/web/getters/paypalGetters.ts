import { PayPalConfig } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';
import integrationConfig from '../integration.config';

function getConfig(): PayPalConfig | null {
  return integrationConfig.payment.paypal ?? null;
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
