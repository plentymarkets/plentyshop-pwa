import { ReviewAverage } from '@plentymarkets/shop-api';
import type { Product } from '@plentymarkets/shop-api';

export type PurchaseCardProps = {
  product: Product;
  reviewAverage: ReviewAverage;
};
