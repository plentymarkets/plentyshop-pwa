import type { Product } from '@plentymarkets/shop-api';

export type AttributeSelectProps = {
  product: Product;
};

export interface Attribute {
  attributeId: number;
  name: string;
  values: { attributeValueId: number; name: string; disabled?: boolean }[];
}

export interface Variation {
  variationId: number;
  isSalable: boolean;
  attributes: { attributeId: number; attributeValueId: number }[];
  attributeCombination: { attributeId: number; attributeValueId: number }[];
}

export interface TransformedProduct {
  attributes: Attribute[];
  combinations: Variation[];
}
