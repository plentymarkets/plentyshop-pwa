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

  const activeLanguagesStr = process.env.LANGUAGELIST || 'en,de';
  const activeLanguages = activeLanguagesStr.split(',').map(lang => lang.trim());

  const locales = activeLanguages
      .map(code => allLocales.find(locale => locale.code === code))
      .filter((locale): locale is LocaleObject => locale !== undefined); // Drop invalid codes

  if (locales.length === 0) {
    return [{ code: 'en', file: 'en.json' }];
  }

  return locales;
};

const getDefaultLocale = () => {
  const locales = getLocales();
  const localeKeys = locales.map((locale) => locale.code);
  const defaultLocale = process.env.DEFAULTLANGUAGE as LocaleObject['code'];

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