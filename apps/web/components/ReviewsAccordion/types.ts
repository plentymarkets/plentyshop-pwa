import type { Product } from '@plentymarkets/shop-api';

export type ProductAccordionPropsType = {
  reviewAverage: number;
  product: Product;
  totalReviews: number;
};
