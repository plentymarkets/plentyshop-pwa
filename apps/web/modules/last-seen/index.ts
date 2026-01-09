import { addComponentsDir, addImports, addPlugin, createResolver, defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'last-seen',
    configKey: 'lastSeen',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    nuxt.hook('i18n:registerModule', (register: any) => {
      register({
        langDir: resolver.resolve('./runtime/lang'),
        locales: [
          {
            code: 'en',
            file: 'en.json',
          },
          {
            code: 'de',
            file: 'de.json',
          },
        ],
      });
    });

    addImports({
      name: 'useLastSeen',
      as: 'useLastSeen',
      from: resolver.resolve('runtime/composables/useLastSeen'),
    });

    addComponentsDir({
      path: resolver.resolve('runtime/components'),
      global: true,
    });

    addPlugin(resolver.resolve('./runtime/plugin/addLastSeen.ts'));
  },
});
