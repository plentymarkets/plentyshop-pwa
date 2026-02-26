import { createTemplateLoader } from '../templateLoader';
import { createProduct } from './factory';
import type { ProductContent } from './interface';

export const getProductTemplate = createTemplateLoader<ProductContent>(createProduct, {
  de: () => import('./-.de'),
  en: () => import('./-.en'),
});

export * from './interface';
export * from './factory';
