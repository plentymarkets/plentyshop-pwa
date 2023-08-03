import type { ShippingProvider } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export interface UseCartShippingMethodsState {
  data: ShippingProvider;
  loading: boolean;
}

export type GetShippingMethods = () => Promise<ShippingProvider>;

export interface UseCartShippingMethods {
  data: Readonly<Ref<UseCartShippingMethodsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getShippingMethods: GetShippingMethods;
}

export type UseCartShippingMethodsReturn = () => UseCartShippingMethods;
