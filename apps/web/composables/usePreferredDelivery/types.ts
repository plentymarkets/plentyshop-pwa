import type { preferredDeliveryProfileServiceParams } from '@plentymarkets/shop-api';

export interface UsePreferredDeliveryState {
  loading: boolean;
  data: any;
}

export type LoadAvailableShippingProfiles = () => Promise<any>;
export type LoadShippingProfileServices = (params: preferredDeliveryProfileServiceParams) => Promise<any>;

export interface UsePreferredDelivery {
  loading: Readonly<Ref<boolean>>;
  data: Readonly<Ref<any>>;
  loadAvailableShippingProfiles: LoadAvailableShippingProfiles;
  loadShippingProfileServices: LoadShippingProfileServices;
}

export type UsePreferredDeliveryReturn = () => UsePreferredDelivery;
