import dotenv from 'dotenv';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync, readFileSync } from 'node:fs';
import type { Languages } from './types';
import type { Writer } from '../writers/types';
import type { Logger } from '../logs/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

export class AppConfigurator {
  private writer: Writer;
  private logger: Logger;

  constructor(writer: Writer, logger: Logger) {
    this.writer = writer;
    this.logger = logger;
  }

  private writeLanguageFiles(defaultLanguageFile: string, languages: Languages, languageFilesPath: string) {
    const fileData = '{}';
    this.writer.writeMissing(fileData, defaultLanguageFile);

    languages.activated.split(',').forEach((language) => {
      const languageFile = path.resolve(languageFilesPath, `${language}.json`);
      this.writer.writeMissing(fileData, languageFile);

      const tsFilePath = path.resolve(languageFilesPath, `${language}.ts`);
      const tsFileContent = this.getTsFileContent(languages.default);

      this.writer.writeMissing(tsFileContent, tsFilePath);
    });
  }

  private getTsFileContent(language: string): string {
    const filePath = path.resolve(__dirname, `../../i18n/lang/${language}.ts`);
    return readFileSync(filePath, 'utf-8');
  }

  private cleanUpInactiveLanguages(languages: Languages, languageFilesPath: string) {
    if (!languages.activated.includes('en') && languages.default !== 'en') {
      const enFile = path.resolve(languageFilesPath, 'en.json');
      rmSync(enFile);
    }

    if (!languages.activated.includes('de') && languages.default !== 'de') {
      const deFile = path.resolve(languageFilesPath, 'de.json');
      rmSync(deFile);
    }
  }

  generateLanguageFiles = (languages: Languages): void => {
    this.logger.info(
      `Generating language files with languages ${languages.activated} and default language ${languages.default}...`,
    );

    const languageFilesPath = path.resolve(__dirname, '../../i18n/lang');
    const defaultLanguageFile = path.resolve(languageFilesPath, `${languages.default}.json`);

    this.writeLanguageFiles(defaultLanguageFile, languages, languageFilesPath);

    this.cleanUpInactiveLanguages(languages, languageFilesPath);
  };
}
