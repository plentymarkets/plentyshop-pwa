import fs from 'node:fs';
import path from 'node:path';
import { getPaletteFromColor, TailwindPalette } from '../utils/tailwindHelper';

const primaryColor = process.env.PRIMARY || '#0c7992';
const secondaryColor = process.env.SECONDARY || '#008ebd';

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

const generateScssVariables = () => {
  const primaryTailwindColors = getPaletteFromColor('primary', primaryColor);
  const secondaryTailwindColors = getPaletteFromColor('secondary', secondaryColor);
  const scssContent = prepareConfigFile(primaryTailwindColors, secondaryTailwindColors);

  const scssVariablesDirectory = path.resolve(__dirname, '../assets');
  const scssVariablesFilePath = path.resolve(scssVariablesDirectory, '_variables.scss');

  fs.mkdirSync(scssVariablesDirectory, { recursive: true });
  fs.writeFileSync(scssVariablesFilePath, scssContent, 'utf8');
};

export default generateScssVariables;
