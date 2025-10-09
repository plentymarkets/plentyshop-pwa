import type { Product } from '@plentymarkets/shop-api';

export type VariationPropertiesProps = {
  product: Product | null;
};

export interface ComponentsMapper {
  [key: string]: object;
}
