import { createResolver, defineNuxtModule, addPlugin, addImportsDir, extendPages } from '@nuxt/kit';

export interface ModuleOptions {
  url?: string;
  clientKey?: string;
  appName?: string;
  refreshInterval?: number;
  mockFlags?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@plentymarkets/unleash',
    configKey: 'unleash',
  },
  defaults: {
    url: '',
    clientKey: '',
    appName: 'plentyshop-pwa',
    refreshInterval: 15,
    mockFlags: '',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.unleash = {
      url: options.url ?? '',
      clientKey: options.clientKey ?? '',
      appName: options.appName ?? 'plentyshop-pwa',
      refreshInterval: options.refreshInterval ?? 15,
      mockFlags: options.mockFlags ?? '',
    };

    addPlugin({ src: resolver.resolve('./runtime/plugins/unleash.server'), mode: 'server' });
    addPlugin({ src: resolver.resolve('./runtime/plugins/unleash.client'), mode: 'client' });

    addImportsDir(resolver.resolve('./runtime/composables'));

    extendPages((pages) => {
      pages.push({
        name: 'unleash-playground',
        path: '/_unleash',
        file: resolver.resolve('./runtime/pages/unleash.vue'),
      });
    });
  },
});
