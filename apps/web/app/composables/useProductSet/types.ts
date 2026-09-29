import type { Product } from '@plentymarkets/shop-api';

export type SetComponentParams = {
  variationId: number;
  quantity: number;
};

export type GetCartSetComponents = () => SetComponentParams[];

export interface UseProductSet {
  isSet: ComputedRef<boolean>;
  getCartSetComponents: GetCartSetComponents;
}

export type UseProductSetReturn = (product: MaybeRef<Product>) => UseProductSet;

export type RawSetComponent = {
  defaultVariationId: number;
  minimumOrderQuantity: number | null;
};
