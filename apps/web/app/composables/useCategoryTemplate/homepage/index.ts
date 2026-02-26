import { createTemplateLoader } from '../templateLoader';
import { createHomepage } from './factory';
import type { HomepageContent } from './interface';

export const getHomepageTemplate = createTemplateLoader<HomepageContent>(createHomepage, {
  de: () => import('./de'),
  en: () => import('./en'),
});

export * from './interface';
export * from './factory';
