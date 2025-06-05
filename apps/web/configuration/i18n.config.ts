import type { LocaleObject, NuxtI18nOptions } from '@nuxtjs/i18n';

export const getLocales = (): LocaleObject[] => {
  const LANGUAGE_CODES = ['en'];
  // const languages = (readdirSync(path.resolve(__dirname, '../i18n/lang')) || []).map((file: string) =>
  //   file.replace('.json', ''),
  // );

  const locales: LocaleObject[] = [];

  LANGUAGE_CODES.forEach((language) => {
    locales.push({
      code: language as LocaleObject['*'],
      file: `${language}.ts`,
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
  lazy: true,
};
