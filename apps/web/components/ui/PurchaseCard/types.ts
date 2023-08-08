import { ReviewAverage } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';
import type { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type PurchaseCardProps = {
  product: Product;
  reviewAverage: ReviewAverage;
};
