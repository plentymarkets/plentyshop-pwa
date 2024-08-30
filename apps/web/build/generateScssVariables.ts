import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPaletteFromColor, TailwindPalette } from '../utils/tailwindHelper';
import { Writer } from './types/Writer';

type BaseColors = {
  primary: string;
  secondary: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prepareConfigFile = (primaryPalette: TailwindPalette, secondaryPalette: TailwindPalette) => {
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

const generateScssVariables = (colors: BaseColors, writer: Writer): string => {
  console.log('Generating SCSS variables...', colors.primary, colors.secondary);

  const primaryTailwindColors = getPaletteFromColor('primary', colors.primary);
  const secondaryTailwindColors = getPaletteFromColor('secondary', colors.secondary);

  const scssContent = prepareConfigFile(primaryTailwindColors, secondaryTailwindColors);
  const scssVariablesFilePath = path.resolve(__dirname, '../assets/_variables.scss');

  writer.write(scssContent, scssVariablesFilePath);

  console.log('SCSS variables generated.');

  return scssContent;
};

export default generateScssVariables;
