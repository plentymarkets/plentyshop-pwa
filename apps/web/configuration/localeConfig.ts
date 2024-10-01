import { LocaleObject } from '@nuxtjs/i18n';
import path from 'node:path';
import * as fs from 'node:fs';

export const getLocaleObject = () => {
  let localeObject: LocaleObject[] = [
    { code: 'en', file: 'en.json' },
    { code: 'de', file: 'de.json' },
  ];

  if (process.env.LANGUAGELIST !== undefined) {
    localeObject = [];
    const languageList = process.env.LANGUAGELIST.split(',');
    const defaultLanguage = process.env.DEFAULTLANGUAGE;

    if (
      process.env.DEFAULTLANGUAGE &&
      languageList.find((language) => language === process.env.DEFAULTLANGUAGE) === undefined
    ) {
      languageList.push(process.env.DEFAULTLANGUAGE);
    }

    languageList.forEach((language) => {
      const languageFile = path.resolve(__dirname, `../lang/${language}.json`);

      if (language === defaultLanguage && !fs.existsSync(languageFile)) {
        fs.writeFileSync(languageFile, '{}');
      }

      if (fs.existsSync(languageFile)) {
        localeObject.push({
          code: language,
          file: `${language}.json`,
        });
      }
    });

    if (localeObject.length === 0) {
      localeObject = [
        { code: 'en', file: 'en.json' },
        { code: 'de', file: 'de.json' },
      ];
    }
  }

  return localeObject;
};
