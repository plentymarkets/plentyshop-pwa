import dotenv from 'dotenv';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { BaseColors, ConfigurationEntry, ConfigurationResponse } from './types';
import { getPaletteFromColor } from '../../utils/tailwindHelper';
import { readFileSync, writeFileSync, copyFile, unlink } from 'node:fs';
import { Writer } from '../writers/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

export class AppConfigurator {
  private writer: Writer;

  private environmentFilePath = path.resolve(__dirname, '../../.env');
  private environmentTemporaryFilePath = path.resolve(__dirname, '../../.env.tmp');

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

  private setupTemporaryEnvironment = () => {
    let requiredEnvironmentData = '';

    for (const [key, value] of Object.entries(this.environmentMap)) {
      requiredEnvironmentData += `${key}=${value}\n`;
      if (key === 'FETCH_REMOTE_CONFIG') continue;
      if (!value) {
        console.error(`Missing or invalid required environment variable: ${key}`);
        return;
      }
    }

    writeFileSync(this.environmentTemporaryFilePath, requiredEnvironmentData);
  };

  private writeConfigurationToTemporaryEnvironment = (data: ConfigurationResponse) => {
    console.log('Writing remote configuration to temporary environment file...');
    const environmentVariables = readFileSync(this.environmentTemporaryFilePath, 'utf8').split(os.EOL);

    for (const category in data) {
      if (Array.isArray(data[category])) {
        data[category].forEach((item: ConfigurationEntry) => {
          environmentVariables.push(`${item.key.toUpperCase()}="${item.value}"`);
        });
      }
    }

    writeFileSync(this.environmentTemporaryFilePath, environmentVariables.join(os.EOL));

    console.log('Remote configuration written to temporary environment file.');
  };

  private convertTemporaryToPermanentEnvironment = () => {
    copyFile(this.environmentTemporaryFilePath, this.environmentFilePath, () => {});
    unlink(this.environmentTemporaryFilePath, () => {});
  };

  generateEnvironment = (data: ConfigurationResponse): void => {
    this.setupTemporaryEnvironment();
    this.writeConfigurationToTemporaryEnvironment(data);
    this.convertTemporaryToPermanentEnvironment();
  };
}
