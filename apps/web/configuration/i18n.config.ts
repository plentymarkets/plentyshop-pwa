import type { NuxtI18nOptions } from '@nuxtjs/i18n';

const localeObject = [];

if (process.env.ACTIVELANGUAGEENGLISH === 'true') {
  localeObject.push({
    code: 'en',
    file: 'en.json',
  });
}

if (process.env.ACTIVELANGUAGEGERMAN === 'true') {
  localeObject.push({
    code: 'de',
    file: 'de.json',
  });
}
export const nuxtI18nOptions: NuxtI18nOptions = {
  locales: localeObject,
  langDir: 'lang',
  defaultLocale: process.env.DEFAULTLANGUAGE ?? 'en',
  strategy: 'prefix_and_default',
  vueI18n: '~/configuration/vueI18n.config.ts',
  detectBrowserLanguage: false,
};
