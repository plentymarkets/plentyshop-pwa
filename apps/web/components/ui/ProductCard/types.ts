import type { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

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
};
