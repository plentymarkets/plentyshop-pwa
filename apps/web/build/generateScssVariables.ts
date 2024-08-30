import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPaletteFromColor, TailwindPalette } from '../utils/tailwindHelper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

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

const generateScssVariables = (primaryColor: string, secondaryColor: string) => {
  console.log('Generating SCSS variables...', primaryColor, secondaryColor);
  const primaryTailwindColors = getPaletteFromColor('primary', primaryColor);
  const secondaryTailwindColors = getPaletteFromColor('secondary', secondaryColor);
  const scssContent = prepareConfigFile(primaryTailwindColors, secondaryTailwindColors);

  const scssVariablesDirectory = path.resolve(__dirname, '../assets');
  const scssVariablesFilePath = path.resolve(scssVariablesDirectory, '_variables.scss');

  fs.mkdirSync(scssVariablesDirectory, { recursive: true });
  fs.writeFileSync(scssVariablesFilePath, scssContent, 'utf8');
  console.log('SCSS variables generated.');
};

export default generateScssVariables;
