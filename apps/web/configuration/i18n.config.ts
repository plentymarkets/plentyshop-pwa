import type { NuxtI18nOptions } from '@nuxtjs/i18n';

export default {
  fallbackLocale: 'en',
  detectBrowserLanguage: false,
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'GBP',
        currencyDisplay: 'symbol',
      },
    },
    de: {
      currency: {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'symbol',
      },
    },
  },
};

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
};
