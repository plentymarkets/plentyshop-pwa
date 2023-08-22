import type { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type BasePriceProps = {
  product: Product;
  oneline: boolean;
  contentLineFirst: boolean;
};
