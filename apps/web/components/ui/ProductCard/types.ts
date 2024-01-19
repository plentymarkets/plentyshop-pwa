import { Product } from '@plentymarkets/shop-api';

export type ProductCardProps = {
  product: Product;
  name: string;
  imageUrl: string;
  imageAlt?: string;
  description?: string;
  rating?: number;
  ratingCount?: number;
  price: number;
  slug?: string;
  priority?: boolean;
  lazy?: boolean;
  unitContent?: number;
  unitName?: string;
  basePrice?: number;
  showBasePrice?: boolean;
  isFromWishlist?: boolean;
};
