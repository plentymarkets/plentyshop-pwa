import type { Product, VariationMapProductAttribute, VariationMapProductVariation } from '@plentymarkets/shop-api';

export interface UseProductAttributesState {
  attributes: VariationMapProductAttribute[];
  attributeValues: { [key: string]: number };
  combinations: VariationMapProductVariation[];
  itemId: number;
  variationId: number;
}

export interface UseProductAttributesReturn {
  attributes: Readonly<Ref<UseProductAttributesState['attributes']>>;
  attributeValues: Ref<UseProductAttributesState['attributeValues']>;
  combinations: Readonly<Ref<UseProductAttributesState['combinations']>>;
  setAttribute: (product: Product) => void;
  updateValue: (attributeId: number, valueId: number) => void;
  getValue: (attributeId: number) => number | undefined;
}

export type UseProductAttributes = () => UseProductAttributesReturn;
