import { createFooter } from './factory';
import type { Block } from '@plentymarkets/shop-api';

const cache = new Map<string, Block>();

if (import.meta.hot) import.meta.hot.dispose(() => cache.clear());

export const getFooterTemplate = async (locale: string): Promise<Block> => {
  const useCache = import.meta.env.PROD;
  const cached = cache.get(locale);

  if (useCache && cached) return structuredClone(cached);

  const { t } = useI18n();
  const block = createFooter(t);

  if (useCache) cache.set(locale, block);

  return block;
};

export * from './factory';
