import type { Product } from '@plentymarkets/shop-api';

export type ProductCardProps = {
  product: Product;
  name: string;
  imageUrl: string;
  imageAlt?: string;
  imageWidth: number;
  imageHeight: number;
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
  isFromSlider?: boolean;
};
