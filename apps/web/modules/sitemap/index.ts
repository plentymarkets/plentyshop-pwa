import { createResolver, defineNuxtModule, addServerHandler } from 'nuxt/kit';
import type { NuxtPage } from "@nuxt/schema";

export interface ModuleOptions {
  locales?: string[];
  defaultLocale?: string;
  baseUrl?: string;
  exclude?: string[];
  trailingSlash?: 'always' | 'auto' | 'never';
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'sitemap',
    configKey: 'plentySitemap',
  },
  defaults: {},
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const sitemapPages: NuxtPage[] = [];
    const buildTime = new Date().toISOString();

    nuxt.options.runtimeConfig.public.plentySitemap = {
      locales: _options.locales || [],
      defaultLocale: _options.defaultLocale ?? 'en',
      baseUrl: _options.baseUrl ?? '',
      trailingSlash: _options.trailingSlash ?? 'never',
    };

    const isParamRoute = (path: string) => {
      return /^.*\/:.*$/.test(path);
    };

    nuxt.hook('pages:resolved', (pages) => {
      pages.forEach((page) => {
        if (isParamRoute(page.path)) return;

        const isExcluded = _options.exclude?.some((excludePath) => {
          const regex = new RegExp('^' + excludePath.replace(/\*/g, '.*') + '$');
          return regex.test(page.path);
        });

        if (!isExcluded) {
          sitemapPages.push(page);
        }
      });
    });

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.virtual = nitroConfig.virtual || {};
      nitroConfig.virtual['#sitemap-data'] = () => `export const sitemapPages = ${JSON.stringify(sitemapPages)}; export const buildTime = '${buildTime}';`;
    });

    addServerHandler({
      route: '/sitemap/content-sitemap.xml',
      handler: resolver.resolve('./runtime/sitemap.xml'),
    });
  },
});
