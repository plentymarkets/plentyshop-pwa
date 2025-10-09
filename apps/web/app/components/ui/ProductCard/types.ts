import type { Product } from '@plentymarkets/shop-api';
import type { ItemGridContent } from '~/components/blocks/ItemGrid/types';

export type ProductCardProps = {
  product: Product;
  configuration?: ItemGridContent;
  index?: number;
  isFromWishlist?: boolean;
  isFromSlider?: boolean;
  lazy?: boolean;
};
