import type { NuxtI18nOptions } from '@nuxtjs/i18n';
import { getLocaleObject } from './localeConfig';

const localeObject = getLocaleObject();

export const nuxtI18nOptions: NuxtI18nOptions = {
  locales: localeObject,
  langDir: 'lang',
  defaultLocale: process.env.DEFAULTLANGUAGE ?? 'en',
  strategy: 'prefix_and_default',
  vueI18n: '~/configuration/vueI18n.config.ts',
  detectBrowserLanguage: false,
};
