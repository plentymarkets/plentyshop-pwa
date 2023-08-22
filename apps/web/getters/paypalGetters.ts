import { PayPalConfig } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';

const integrationConfigLoad = useAppConfig().integration as { payment: { paypal: PayPalConfig } };
const integrationConfig = integrationConfigLoad.payment.paypal;

function getConfig(): PayPalConfig | null {
  return integrationConfig ?? null;
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
