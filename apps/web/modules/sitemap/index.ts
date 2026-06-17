import { createResolver, defineNuxtModule, addServerHandler } from 'nuxt/kit';

// eslint-disable-next-line custom-rules/file-organization-types
export interface ModuleOptions {
  locales?: string[];
  defaultLocale?: string;
  exclude?: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'sitemap',
    configKey: 'plentySitemap',
  },
  defaults: {},
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const sitemapPages: string[] = [];
    const buildTime = new Date().toISOString();

    nuxt.options.runtimeConfig.public.plentySitemap = {
      locales: _options.locales || [],
      defaultLocale: _options.defaultLocale ?? 'en',
    };

    const routeHasParams = (path: string) => {
      return /^.*\/:.*$/.test(path);
    };

    nuxt.hook('pages:resolved', (pages) => {
      pages.forEach((page) => {
        if (routeHasParams(page.path)) return;
        if (/(\/__tests__(\/|$)|\.(spec|test)(\.|$))/.test(page.path)) return;
        if (page.meta?.sitemap === false) return;

        const isExcluded = _options.exclude?.some((excludePath) => {
          const regex = new RegExp('^' + excludePath.replaceAll('*', '.*') + '$');
          return regex.test(page.path);
        });

        if (!isExcluded) {
          sitemapPages.push(page.path);
        }
      });
    });

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.virtual = nitroConfig.virtual || {};
      nitroConfig.virtual['#sitemap-data'] = () =>
        `export const sitemapPages = ${JSON.stringify(sitemapPages)}; export const buildTime = '${buildTime}';`;
    });

    addServerHandler({
      route: '/sitemap/content-sitemap.xml',
      handler: resolver.resolve('./runtime/sitemap.xml'),
    });
  },
});
