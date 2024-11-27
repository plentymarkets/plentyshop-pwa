import { addComponentsDir, addImportsDir, createResolver, defineNuxtModule, addPlugin } from '@nuxt/kit';
import i18nConfig from '~/configuration/vueI18n.config';

export default defineNuxtModule({
  meta: {
    name: 'paypal',
    configKey: 'paypal',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    nuxt.hook('i18n:registerModule', (register) => {
      register({
        langDir: resolver.resolve('./lang'),
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

    await addComponentsDir({
      path: resolver.resolve('components'),
      global: false,
    });
    addImportsDir(resolver.resolve('composables'));
    addPlugin(resolver.resolve('plugins/registerComponents.ts'));
    addPlugin(resolver.resolve('plugins/registerCookies.ts'));
  },
});
