import type { Order, AdditionalInformationParams } from '@plentymarkets/shop-api';

export interface UseMakeOrderState {
  data: Order | null;
  loading: boolean;
}

export interface MakeOrderParams {
  paymentId: number;
  /** @deprecated use additionalInformation: AdditionalInformationParams */
  shippingPrivacyHintAccepted?: boolean;
  additionalInformation?: AdditionalInformationParams;
  customQuery?: Record<string, unknown>;
}

export type CreateOrder = (params: MakeOrderParams) => Promise<Order | null>;

export interface UseMakeOrder {
  data: Readonly<Ref<UseMakeOrderState['data']>>;
  loading: Readonly<Ref<boolean>>;
  createOrder: CreateOrder;
}

export type UseMakeOrderReturn = () => UseMakeOrder;
