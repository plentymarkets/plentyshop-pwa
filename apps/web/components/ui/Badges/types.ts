import { Product } from '@plentymarkets/shop-api';

export type BadgesProps = {
  product: Product;
  displayTags?: boolean;
  displayAvailability?: boolean;
};
