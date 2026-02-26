import { createTemplateLoader } from '../templateLoader';
import { createCategory } from './factory';
import type { CategoryContent } from './interface';

export const getCategoryTemplate = createTemplateLoader<CategoryContent>(createCategory, {
  de: () => import('./-.de'),
  en: () => import('./-.en'),
});

export * from './interface';
export * from './factory';
