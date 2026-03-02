import { createHomepage } from './factory';
import type { Block } from '@plentymarkets/shop-api';
import { callWithNuxt } from '#app';

const cache = new Map<string, Block[]>();

if (import.meta.hot) import.meta.hot.dispose(() => cache.clear());

export const getHomepageTemplate = async (locale: string): Promise<Block[]> => {
  const useCache = import.meta.env.PROD;
  const cached = cache.get(locale);

  if (useCache && cached) return structuredClone(cached);

  const nuxtApp = useNuxtApp();
  const blocks = await callWithNuxt(nuxtApp, () => createHomepage());

  if (useCache) cache.set(locale, blocks);

  return blocks;
};

export * from './factory';
