import type { Product } from '@plentymarkets/shop-api';

export type BadgesProps = {
  product: Product;
  useTags?: boolean;
  useAvailability?: boolean;
};
