import type { Product } from '@plentymarkets/shop-api';

export interface BulletPointProps {
  product: Product;
  fallback?: string;
  language: string;
}
