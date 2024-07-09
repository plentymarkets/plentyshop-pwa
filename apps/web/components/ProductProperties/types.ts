import type { Product } from '@plentymarkets/shop-api';

export type ProductPropertiesProps = {
  product: Product;
};

export interface ComponentsMapper {
  [key: string]: object;
}
