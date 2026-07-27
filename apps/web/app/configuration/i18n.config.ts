import type { LocaleObject, NuxtI18nOptions } from '@nuxtjs/i18n';

export const getLocales = (): LocaleObject[] => {
  const locales: unknown[] = [];
  const allLocales = [
    { code: 'de', language: 'de-DE', file: 'de.json' },
    { code: 'en', language: 'en-GB', file: 'en.json' },
    { code: 'bg', language: 'bg-BG', file: 'bg.json' },
    { code: 'fr', language: 'fr-FR', file: 'fr.json' },
    { code: 'it', language: 'it-IT', file: 'it.json' },
    { code: 'es', language: 'es-ES', file: 'es.json' },
    { code: 'tr', language: 'tr-TR', file: 'tr.json' },
    { code: 'nl', language: 'nl-NL', file: 'nl.json' },
    { code: 'pl', language: 'pl-PL', file: 'pl.json' },
    { code: 'pt', language: 'pt-PT', file: 'pt.json' },
    { code: 'nn', language: 'nn-NO', file: 'nn.json' },
    { code: 'ro', language: 'ro-RO', file: 'ro.json' },
    { code: 'da', language: 'da-DK', file: 'da.json' },
    { code: 'se', language: 'sv-SE', file: 'se.json' },
    { code: 'cz', language: 'cs-CZ', file: 'cz.json' },
    { code: 'ru', language: 'ru-RU', file: 'ru.json' },
    { code: 'sk', language: 'sk-SK', file: 'sk.json' },
    { code: 'cn', language: 'zh-CN', file: 'cn.json' },
    { code: 'vn', language: 'vi-VN', file: 'vn.json' },
    /*
    { code: 'fi', language: 'fi-FI', file: 'fi.json' },
    { code: 'ga', language: 'ga-IE', file: 'ga.json' },
    { code: 'lt', language: 'lt-LT', file: 'lt.json' },
    { code: 'lv', language: 'lv-LV', file: 'lv.json' },
    { code: 'et', language: 'et-EE', file: 'et.json' },
    { code: 'hr', language: 'hr-HR', file: 'hr.json' },
    { code: 'hu', language: 'hu-HU', file: 'hu.json' },
     */
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
};
