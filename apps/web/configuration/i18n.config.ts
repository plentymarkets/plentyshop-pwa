import path from 'node:path';
import type { LocaleObject, NuxtI18nOptions } from '@nuxtjs/i18n';
import { readdirSync } from 'node:fs';

export const getLocales = (): LocaleObject[] => {
  const locales: LocaleObject[] = [];
  const languages = (readdirSync(path.resolve(__dirname, '../i18n/lang')) || []).map((file: string) =>
    file.replace('.json', ''),
  );

  languages.forEach((language) => {
    locales.push({
      code: language as LocaleObject['*'],
      file: `${language}.json`,
    });
  });

  return locales;
};

const getDefaultLocale = () => {
  const locales = getLocales();
  const localeKeys = locales.map((locale) => locale.code);
  const defaultLocale = process.env.DEFAULTLANGUAGE as LocaleObject['*'];

  return localeKeys.includes(defaultLocale) ? defaultLocale : 'en';
};

export const nuxtI18nOptions: NuxtI18nOptions = {
  locales: getLocales(),
  defaultLocale: getDefaultLocale(),
  langDir: 'lang',
  strategy: 'prefix_and_default',
  vueI18n: '~/configuration/vueI18n.config.ts',
  detectBrowserLanguage: false,
  lazy: true
};
