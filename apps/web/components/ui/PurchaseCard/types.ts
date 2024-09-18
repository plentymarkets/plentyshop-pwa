import type {Product, ReviewAverage, ReviewCounts} from '@plentymarkets/shop-api';

export type PurchaseCardProps = {
  product: Product;
  reviewAverage: ReviewCounts;
};
