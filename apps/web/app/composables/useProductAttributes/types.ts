import type { Product, VariationMapProductAttribute, VariationMapProductVariation } from '@plentymarkets/shop-api';

export interface UseProductAttributesState {
  attributes: VariationMapProductAttribute[];
  attributeValues: { [key: string]: number };
  combinations: VariationMapProductVariation[];
  itemId: number;
  variationId: number;
}

export type SetAttribute = (product: Product, preSelectAttributes: boolean) => void;
export type UpdateValue = (attributeId: number, valueId: number) => void;
export type GetValue = (attributeId: number) => number | undefined;
export type GetCombination = () => VariationMapProductVariation | null;

export interface UseProductAttributesReturn {
  attributes: Readonly<Ref<UseProductAttributesState['attributes']>>;
  itemId: Readonly<Ref<UseProductAttributesState['itemId']>>;
  variationId: Readonly<Ref<UseProductAttributesState['variationId']>>;
  attributeValues: Ref<UseProductAttributesState['attributeValues']>;
  combinations: Readonly<Ref<UseProductAttributesState['combinations']>>;
  setAttribute: SetAttribute;
  updateValue: UpdateValue;
  getValue: GetValue;
  getCombination: GetCombination;
}

export type UseProductAttributes = () => UseProductAttributesReturn;
