import dotenv from 'dotenv';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaseColors, ConfigurationCategory, ConfigurationEntry, ConfigurationResponse } from './types';
import { getPaletteFromColor } from '../../utils/tailwindHelper';
import { Writer } from '../writers/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

export class AppConfigurator {
  private writer: Writer;

  private environmentMap = {
    FETCH_REMOTE_CONFIG: process.env.FETCH_REMOTE_CONFIG,
    API_ENDPOINT: process.env.API_ENDPOINT,
    API_SECURITY_TOKEN: process.env.API_SECURITY_TOKEN,
    CONFIG_ID: process.env.CONFIG_ID,
  };

  constructor(writer: Writer) {
    this.writer = writer;
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
    console.log('Generating SCSS variables...', colors.primary, colors.secondary);

    const primaryTailwindColors = getPaletteFromColor('primary', colors.primary);
    const secondaryTailwindColors = getPaletteFromColor('secondary', colors.secondary);

    const scssContent = this.generateScssFileContent(primaryTailwindColors, secondaryTailwindColors);
    const scssVariablesFilePath = path.resolve(__dirname, '../../assets/_variables.scss');

    this.writer.write(scssContent, scssVariablesFilePath);

    console.log('SCSS variables generated.');

    return scssContent;
  };

  private isValidEnvironment = (): boolean => {
    let isValidEnvironment = true;

    Object.entries(this.environmentMap).forEach(([key, value]) => {
      if (!value) {
        console.error(`Missing or invalid required environment variable: ${key}`);
        isValidEnvironment = false;
      }
    });

    return isValidEnvironment;
  };

  private generateEnvironmentFileContent = (data: ConfigurationResponse): string => {
    let environmentContent = '';

    Object.entries(this.environmentMap).forEach(([key, value]) => {
      environmentContent += `${key}=${value}\n`;
    });

    Object.values(data).forEach((category: ConfigurationCategory) => {
      category.forEach((entry: ConfigurationEntry) => {
        environmentContent += `${entry.key.toUpperCase()}="${entry.value}"\n`;
      });
    });

    return environmentContent;
  };

  generateEnvironment = (data: ConfigurationResponse): string => {
    const environmentFilePath = path.resolve(__dirname, '../../.env');
    let environmentContent = '';

    if (this.isValidEnvironment()) {
      environmentContent = this.generateEnvironmentFileContent(data);
      this.writer.write(environmentContent, environmentFilePath);
    }

    return environmentContent;
  };
}
