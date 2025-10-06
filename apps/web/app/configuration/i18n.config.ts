import type { LocaleObject, NuxtI18nOptions } from '@nuxtjs/i18n';
import { readdirSync } from 'node:fs';
import path from 'node:path';

export const getLocales = (): LocaleObject[] => {
  const languages = (readdirSync(path.resolve(__dirname, '../i18n/lang')) || []).map((file: string) =>
    file.replace(/\.[^.]+$/, ''),
  );

  const LANGUAGE_CODES = languages.filter((item, pos) => languages.indexOf(item) == pos);

  const locales: LocaleObject[] = [];

  LANGUAGE_CODES.forEach((language) => {
    locales.push({
      code: language as LocaleObject['code'],
      file: `${language}.ts`,
    });
  });

  return locales;
};

const getDefaultLocale = () => {
  const locales = getLocales();
  const localeKeys = locales.map((locale) => locale.code);
  const defaultLocale = process.env.DEFAULTLANGUAGE as LocaleObject['code'];

  return localeKeys.includes(defaultLocale) ? defaultLocale : 'en';
};

export const nuxtI18nOptions: NuxtI18nOptions = {
  locales: getLocales(),
  defaultLocale: getDefaultLocale(),
  langDir: 'lang',
  strategy: 'prefix_and_default',
  vueI18n: '~/configuration/vueI18n.config.ts',
  detectBrowserLanguage: false,
  lazy: true,
};
