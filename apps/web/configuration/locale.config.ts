import type { LocaleObject } from '@nuxtjs/i18n';

export const getLocaleObject = (languages: string) => {
  const localeObject: LocaleObject[] = [];
  const languagesList = languages.split(',');

  languagesList.forEach((language) => {
    localeObject.push({
      code: language,
      file: `${language}.json`,
    });
  });

  return localeObject;
};
