import type { LocaleObject, NuxtI18nOptions } from '@nuxtjs/i18n';

export const getLocales = (): LocaleObject[] => {
  const locales: unknown[] = [];
  const allLocales = [
    { code: 'de', file: 'de.json' },
    { code: 'en', file: 'en.json' },
    { code: 'bg', file: 'bg.json' },
    { code: 'fr', file: 'fr.json' },
    { code: 'it', file: 'it.json' },
    { code: 'es', file: 'es.json' },
    { code: 'tr', file: 'tr.json' },
    { code: 'nl', file: 'nl.json' },
    { code: 'pl', file: 'pl.json' },
    { code: 'pt', file: 'pt.json' },
    { code: 'nn', file: 'nn.json' },
    { code: 'ro', file: 'ro.json' },
    { code: 'da', file: 'da.json' },
    { code: 'se', file: 'se.json' },
    { code: 'cz', file: 'cz.json' },
    { code: 'ru', file: 'ru.json' },
    { code: 'sk', file: 'sk.json' },
    { code: 'cn', file: 'cn.json' },
    { code: 'vn', file: 'vn.json' },
    { code: 'fi', file: 'fi.json' },
    { code: 'ga', file: 'ga.json' },
    { code: 'lt', file: 'lt.json' },
    { code: 'lv', file: 'lv.json' },
    { code: 'et', file: 'et.json' },
    { code: 'hr', file: 'hr.json' },
    { code: 'hu', file: 'hu.json' },
  ];

  allLocales.forEach((locale) => {
    locales.push(locale);
  });

  return locales as LocaleObject[];
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
  langDir: '../app/lang',
  strategy: 'prefix_and_default',
  vueI18n: '~/configuration/vueI18n.config.ts',
  detectBrowserLanguage: false,
  lazy: true,
};
