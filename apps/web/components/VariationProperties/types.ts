import type { Product } from '@plentymarkets/shop-api';

export type VariationPropertiesProps = {
  product: Product;
};

export interface ComponentsMapper {
  [key: string]: object;
}
