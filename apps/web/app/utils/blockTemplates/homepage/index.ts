import { createHomepage } from './factory';
import type { Block } from '@plentymarkets/shop-api';

const cache = new Map<string, Block[]>();

if (import.meta.hot) import.meta.hot.dispose(() => cache.clear());

export const getHomepageTemplate = async (locale: string): Promise<Block[]> => {
  const useCache = import.meta.env.PROD;
  const cached = cache.get(locale);

  if (useCache && cached) return JSON.parse(JSON.stringify(cached));

  const blocks = createHomepage();

  if (useCache) {
    cache.set(locale, blocks);
    return JSON.parse(JSON.stringify(blocks));
  }

  return blocks;
};

export * from './factory';
