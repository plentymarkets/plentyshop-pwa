import type { Product } from '@plentymarkets/shop-api';

export interface ProductEprelProps {
  product: Product;
  size: 'sm' | 'base' | 'lg' | 'xl' | 'xxl' | 'xxxl';
}
