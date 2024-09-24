import { LocaleObject } from '@nuxtjs/i18n';
import path from 'node:path';
import * as fs from 'node:fs';

export const getLocaleObject = () => {
  const localeObject: LocaleObject[] = [
    { code: 'en', file: 'en.json' },
    { code: 'de', file: 'de.json' },
  ];

  if (process.env.LANGUAGELIST !== undefined) {
    const languageList = process.env.LANGUAGELIST.split(',');
    languageList.forEach((language) => {
      if (language === 'en' || language === 'de') return;

      const languageFile = path.resolve(__dirname, `../lang/${language}.json`);

      if (fs.existsSync(languageFile)) {
        localeObject.push({
          code: language,
          file: `${language}.json`,
        });
      }
    });
  }

  return localeObject;
};
