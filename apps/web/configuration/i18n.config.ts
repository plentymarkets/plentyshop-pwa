import type { NuxtI18nOptions } from '@nuxtjs/i18n';

export const nuxtI18nOptions: NuxtI18nOptions = {
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
  langDir: 'lang',
  defaultLocale: 'en',
  strategy: 'prefix_and_default',
  vueI18n: '~/configuration/vueI18n.config.ts',
  detectBrowserLanguage: false,
};
