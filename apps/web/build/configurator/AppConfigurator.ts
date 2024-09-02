import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataToFileWriter } from '../writers/DataToFileWriter';
import { BaseColors } from './types';
import { getPaletteFromColor } from '../../utils/tailwindHelper';

export class AppConfigurator {
  private __filename = fileURLToPath(import.meta.url);
  private __dirname = dirname(this.__filename);
  private writer: DataToFileWriter;

  constructor() {
    this.writer = new DataToFileWriter();
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
    const scssVariablesFilePath = path.resolve(this.__dirname, '../../assets/_variables.scss');

    this.writer.write(scssContent, scssVariablesFilePath);

    console.log('SCSS variables generated.');

    return scssContent;
  };
}
