import type { Product } from '@plentymarkets/shop-api';

export type OrderPropertiesProps = {
  product: Product;
};

export interface ComponentsMapper {
  [key: string]: object;
}
