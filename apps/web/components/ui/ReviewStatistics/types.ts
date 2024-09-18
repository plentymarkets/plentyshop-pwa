import type {Product, ReviewCounts} from '@plentymarkets/shop-api';

export type ReviewStatisticsProps = {
  product: Product;
  counts: ReviewCounts;
};
