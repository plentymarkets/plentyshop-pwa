import fs from 'node:fs';
import path from 'node:path';
import { getPaletteFromColor } from '../utils/tailwindHelper';

const primaryColor = process.env.PRIMARY || '#0c7992';
const secondaryColor = process.env.SECONDARY || '#008ebd';

const prepareConfigFile = (
  primarySpectrum: Array<{ weight: string; rgb: string }>,
  secondarySpectrum: Array<{ weight: string; rgb: string }>,
) => {
  let scssContent = '';

  primarySpectrum.forEach((shade) => {
    scssContent += `$color-2-primary-${shade.weight}: ${shade.rgb};`;
  });

  scssContent += '\n';

  secondarySpectrum.forEach((shade) => {
    scssContent += `$color-2-secondary-${shade.weight}: ${shade.rgb};`;
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
