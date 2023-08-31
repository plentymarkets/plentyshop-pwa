import { Product } from '@plentymarkets/shop-api';

export type ProductCardProps = {
  product: Product;
  name: string;
  description?: string;
  rating?: number;
  ratingCount?: number;
  price: number;
  slug?: string;
  priority?: boolean;
  lazy?: boolean;
  unitContent?: number;
  unitName?: string;
  basePrice?: string;
  showBasePrice?: boolean;
};
