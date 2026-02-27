import { createHomepage } from './factory';
import type { Block } from '@plentymarkets/shop-api';

const cache = new Map<string, Block[]>();

if (import.meta.hot) import.meta.hot.dispose(() => cache.clear());

export const getHomepageTemplate = async (locale: string): Promise<Block[]> => {
  const useCache = import.meta.env.PROD;
  const cached = cache.get(locale);
  if (useCache && cached) return cached;

  const [homepageModule, footerModule] = await Promise.all([
    locale === 'de' ? import('./-.de') : import('./-.en'),
    locale === 'de' ? import('../footer/-.de') : import('../footer/-.en'),
  ]);

  const blocks = createHomepage(homepageModule.default, footerModule.default);

  if (useCache) cache.set(locale, blocks);

  return blocks;
};

export * from './interface';
export * from './factory';
