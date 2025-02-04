import path from 'node:path';
import type { LocaleObject, NuxtI18nOptions } from '@nuxtjs/i18n';
import { readdirSync } from 'node:fs';

const languages = readdirSync(path.resolve(__dirname, '../i18n/lang'))
  .map((file: string) => file.replace('.json', ''))
  .join(',');

const locales = languages.split(',');

const getDefaultLocale = () => {
  const defaultLanguage = process.env.DEFAULTLANGUAGE as LocaleObject['*'];
  const fallbackLanguage = locales[0] as LocaleObject['*'];
  return locales.includes(defaultLanguage) ? defaultLanguage : fallbackLanguage;
};

export const nuxtI18nOptions: NuxtI18nOptions = {
  locales: locales,
  defaultLocale: getDefaultLocale(),
  strategy: 'prefix_and_default',
  vueI18n: '~/configuration/vueI18n.config.ts',
  detectBrowserLanguage: false,
};
