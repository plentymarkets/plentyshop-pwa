import type { Product, ReviewCounts } from '@plentymarkets/shop-api';

export type PurchaseCardProps = {
  product: Product;
  reviewAverage: ReviewCounts;
};
