import dotenv from 'dotenv';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync } from 'node:fs';
import type { BaseColors, Languages } from './types';
import { getPaletteFromColor } from '../../utils/tailwindHelper';
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

  private generateScssFileContent = (primaryPalette: TailwindPalette, secondaryPalette: TailwindPalette) => {
    let scssContent = '';

    primaryPalette.forEach((shade) => {
      scssContent += `$color-2-primary-${shade.weight}: ${shade.rgb};\n`;
    });

    scssContent += '\n';

    secondaryPalette.forEach((shade) => {
      scssContent += `$color-2-secondary-${shade.weight}: ${shade.rgb};\n`;
    });

    return scssContent;
  };

  generateScssVariables = (colors: BaseColors): string => {
    this.logger.info(
      `Generating SCSS variables with primary color: ${colors.primary} and secondary color: ${colors.secondary}`,
    );

    const primaryTailwindColors = getPaletteFromColor('primary', colors.primary);
    const secondaryTailwindColors = getPaletteFromColor('secondary', colors.secondary);

    const scssContent = this.generateScssFileContent(primaryTailwindColors, secondaryTailwindColors);
    const scssVariablesFilePath = path.resolve(__dirname, '../../assets/_variables.scss');

    this.writer.write(scssContent, scssVariablesFilePath);

    return scssContent;
  };

  private writeLanguageFiles(defaultLanguageFile: string, languages: Languages, languageFilesPath: string) {
    const fileData = '{}';
    this.writer.writeMissing(fileData, defaultLanguageFile);

    languages.activated.split(',').forEach((language) => {
      const languageFile = path.resolve(languageFilesPath, `${language}.json`);

      this.writer.writeMissing(fileData, languageFile);
    });
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

    const languageFilesPath = path.resolve(__dirname, '../../lang');
    const defaultLanguageFile = path.resolve(languageFilesPath, `${languages.default}.json`);

    this.writeLanguageFiles(defaultLanguageFile, languages, languageFilesPath);

    this.cleanUpInactiveLanguages(languages, languageFilesPath);
  };
}
