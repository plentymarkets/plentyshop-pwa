import type { Block } from '@plentymarkets/shop-api';

export function createTemplateLoader<TContent>(
  factory: (content: TContent) => Block[],
  loaders: Record<string, () => Promise<{ default: TContent }>>,
) {
  const cache = new Map<string, Block[]>();

  if (import.meta.hot) import.meta.hot.dispose(() => cache.clear());

  return async (locale: string): Promise<Block[]> => {
    const useCache = import.meta.env.PROD;

    if (useCache && cache.has(locale)) {
      console.warn(`📦 Template from CACHE [${locale}]`);
      return cache.get(locale)!;
    }

    const supportedLocale = (locale in loaders ? locale : 'en') as keyof typeof loaders;
    console.warn(
      `🔄 Loading template [${locale}] ${locale !== supportedLocale ? `(fallback to ${supportedLocale})` : ''}`,
    );

    const loader = loaders[supportedLocale]!;
    const module = await loader();
    const result = factory(module.default);

    if (useCache) {
      console.warn(`💾 Caching template [${locale}]`);
      cache.set(locale, result);
    }

    return result;
  };
}
