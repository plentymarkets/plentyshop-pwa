import type { Product } from '@plentymarkets/shop-api';

export type TextContentProps = {
  index?: number;
  testId?: string;
  product?: Product;
  text?: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    color?: string;
    textAlignment?: 'left' | 'center' | 'right';
  };
  button?: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
    alignment?: 'left' | 'center' | 'right';
  };
};
