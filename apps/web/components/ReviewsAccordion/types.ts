import type { Product } from '@plentymarkets/shop-api';

export type ProductAccordionPropsType = {
  reviewAverageText: number;
  reviewAverageStars?: number;
  product: Product;
  totalReviews: number;
};
