import type { Product, VariationMapProductAttribute } from '@plentymarkets/shop-api';

export type ProductAttributesProps = {
  product: Product;
};

export type AttributeSelectProps = {
  attribute: VariationMapProductAttribute;
};

export interface ComponentsMapper {
  [key: string]: object;
}
