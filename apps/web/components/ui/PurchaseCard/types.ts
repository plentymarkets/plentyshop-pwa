import type { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { ReviewAverage } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';

export type PurchaseCardProps = {
  product: Product;
  reviewAverage: ReviewAverage
};
