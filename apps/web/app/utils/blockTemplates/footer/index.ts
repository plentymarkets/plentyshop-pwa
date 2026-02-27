import { createFooter } from './factory';
import type { Block } from '@plentymarkets/shop-api';

const cache = new Map<string, Block>();

if (import.meta.hot) import.meta.hot.dispose(() => cache.clear());

export const getFooterTemplate = async (locale: string): Promise<Block> => {
  const useCache = import.meta.env.PROD;
  const cached = cache.get(locale);
  if (useCache && cached) return cached;

  const module = locale === 'de' ? await import('./-.de') : await import('./-.en');
  const block = createFooter(module.default);

  if (useCache) cache.set(locale, block);

  return block;
};

export * from './interface';
export * from './factory';
