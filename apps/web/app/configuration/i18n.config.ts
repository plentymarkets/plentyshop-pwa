import type { LocaleObject, NuxtI18nOptions } from '@nuxtjs/i18n';

export const getActiveLanguages = (): string[] => {
  const activeLanguages = process.env.LANGUAGELIST || 'en,de';
  return activeLanguages.split(',').map((lang) => lang.trim());
};

export const getLocales = (): LocaleObject[] => {
  const locales: unknown[] = [];
  const allLocales = [
    { code: 'bg', file: 'bg.ts' },
    { code: 'cs', file: 'cs.ts' },
    { code: 'da', file: 'da.ts' },
    { code: 'de', file: 'de.ts' },
    { code: 'en', file: 'en.ts' },
    { code: 'es', file: 'es.ts' },
    { code: 'et', file: 'et.ts' },
    { code: 'fi', file: 'fi.ts' },
    { code: 'fr', file: 'fr.ts' },
    { code: 'ga', file: 'ga.ts' },
    { code: 'hr', file: 'hr.ts' },
    { code: 'hu', file: 'hu.ts' },
    { code: 'it', file: 'it.ts' },
    { code: 'lt', file: 'lt.ts' },
    { code: 'lv', file: 'lv.ts' },
    { code: 'nl', file: 'nl.ts' },
    { code: 'no', file: 'no.ts' },
    { code: 'pl', file: 'pl.ts' },
    { code: 'pt', file: 'pt.ts' },
    { code: 'ro', file: 'ro.ts' },
    { code: 'ru', file: 'ru.ts' },
    { code: 'sk', file: 'sk.ts' },
    { code: 'sv', file: 'sv.ts' },
    { code: 'tr', file: 'tr.ts' },
    { code: 'vi', file: 'vi.ts' },
    { code: 'zh', file: 'zh.ts' },
  ];

  const activeLanguages = getActiveLanguages();

  allLocales.forEach((locale) => {
    if (activeLanguages.includes(locale.code)) {
      locales.push(locale);
    }
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
