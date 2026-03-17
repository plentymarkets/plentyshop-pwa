import { createDefaultHeaderContainerBlock } from './factory';
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';

const cache = new Map<string, HeaderContainerBlock>();

if (import.meta.hot) import.meta.hot.dispose(() => cache.clear());

export const getHeaderContainerTemplate = async (locale: string): Promise<HeaderContainerBlock> => {
  const useCache = import.meta.env.PROD;
  const cached = cache.get(locale);

  if (useCache && cached) return JSON.parse(JSON.stringify(cached));

  const block = createDefaultHeaderContainerBlock();

  if (useCache) {
    cache.set(locale, block);
    return JSON.parse(JSON.stringify(block));
  }

  return block;
};

export * from './factory';
