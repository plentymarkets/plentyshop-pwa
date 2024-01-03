import type { Product } from '@plentymarkets/shop-api';
import type { ProductProperty } from '@plentymarkets/shop-api';

export type OrderPropertiesProps = {
  product: Product;
};

export type OrderPropertyTypesProps = {
  hasTooltip: boolean;
  productProperty: ProductProperty;
};
