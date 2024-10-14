import type { NuxtI18nOptions } from '@nuxtjs/i18n';
import { getLocaleObject } from './locale.config';
import { readdirSync } from 'node:fs';

const languages = readdirSync('../lang')
  .map((file: string) => file.replace('.json', ''))
  .join(',');

const localeObject = getLocaleObject(languages);

export const nuxtI18nOptions: NuxtI18nOptions = {
  locales: localeObject,
  langDir: 'lang',
  defaultLocale: process.env.DEFAULTLANGUAGE ?? 'en',
  strategy: 'prefix_and_default',
  vueI18n: '~/configuration/vueI18n.config.ts',
  detectBrowserLanguage: false,
};
