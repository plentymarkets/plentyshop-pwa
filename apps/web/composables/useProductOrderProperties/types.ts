import type { Ref } from 'vue';
import type { BasketItemOrderParamsProperty, ProductProperty, Product } from '@plentymarkets/shop-api';

export interface UseProductOrderPropertiesState {
  data: BasketItemOrderParamsProperty[];
}

export type SetProperties = (productProperties: ProductProperty[]) => void;
export type GetPropertiesPrice = (product: Product) => number;

export interface UseProductOrderProperties {
  data: Ref<UseProductOrderPropertiesState['data']>;
  setProperties: SetProperties;
  getPropertyById: (id: number) => BasketItemOrderParamsProperty | undefined;
  getPropertiesForCart: () => BasketItemOrderParamsProperty[];
  getPropertiesPrice: GetPropertiesPrice;
}

export type UseProductOrderPropertiesReturn = () => UseProductOrderProperties;
