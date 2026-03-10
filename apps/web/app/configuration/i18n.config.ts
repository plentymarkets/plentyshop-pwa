import type { LocaleObject, NuxtI18nOptions } from '@nuxtjs/i18n';

export const getLocales = (): LocaleObject[] => {
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
  ];

  // 1. Get the active languages from the environment (fallback to 'en,de')
  const activeLanguagesStr = process.env.LANGUAGELIST || 'en,de';
  const activeLanguages = activeLanguagesStr.split(',').map((lang) => lang.trim());

  // 2. Filter the locales so ONLY the active ones are returned
  const locales = allLocales.filter((locale) => activeLanguages.includes(locale.code));

  // Safety fallback in case of misconfiguration
  if (locales.length === 0) {
    return [{ code: 'en', file: 'en.json' }];
  }

  return locales as LocaleObject[];
};

const getDefaultLocale = () => {
  const locales = getLocales();
  const localeKeys = locales.map((locale) => locale.code);
  const defaultLocale = process.env.DEFAULTLANGUAGE as LocaleObject['code'];

  // Ensure the default locale actually exists in our filtered list
  return localeKeys.includes(defaultLocale) ? defaultLocale : localeKeys[0];
};

export const nuxtI18nOptions: NuxtI18nOptions = {
  locales: getLocales(),
  defaultLocale: getDefaultLocale(),
  langDir: '../app/lang',
  strategy: 'prefix_and_default',
  vueI18n: '~/configuration/vueI18n.config.ts',
  detectBrowserLanguage: false,
};
