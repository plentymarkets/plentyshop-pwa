import type { ShippingProvider, ShippingMethod } from '@plentymarkets/shop-api';

export interface UseCartShippingMethodsState {
  data: ShippingProvider;
  loading: boolean;
  selectedMethod: ShippingMethod | undefined;
}

export type GetShippingMethods = () => Promise<ShippingProvider>;

export type SaveShippingMethod = (shippingMethodId: number) => Promise<ShippingProvider>;

export type SetSelectedMethod = (shippingMethodId: number) => void;

export interface UseCartShippingMethods {
  data: Readonly<Ref<UseCartShippingMethodsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  selectedMethod: Readonly<Ref<UseCartShippingMethodsState['selectedMethod']>>;
  getShippingMethods: GetShippingMethods;
  saveShippingMethod: SaveShippingMethod;
}

export type UseCartShippingMethodsReturn = () => UseCartShippingMethods;
