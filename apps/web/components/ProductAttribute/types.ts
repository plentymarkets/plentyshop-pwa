import {Product, VariationMapProductAttribute} from '@plentymarkets/shop-api';

export type ProductAttributeProps = {
  product: Product;
};

export type AttributeSelectProps = {
  attribute: VariationMapProductAttribute;
};

export interface ComponentsMapper {
  [key: string]: object;
}
