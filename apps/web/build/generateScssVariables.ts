import fs from 'node:fs';
import path from 'node:path';
import { getTailwindColorsOklch } from '../utils/tailwindHelper';
import type { TailwindColors } from '~/composables/useConfigurationDrawer';
import { rgb } from 'culori';
import { formatRgb } from 'culori/fn';

const primaryColor = process.env.PRIMARY || '#0c7992';
const secondaryColor = process.env.SECONDARY || '#008ebd';

export const oklchToRgb = (oklch: string) => {
  const rgbColor = rgb(oklch) ?? { mode: 'rgb', r: 0, g: 0, b: 0 };
  const rgbColorFormatted = formatRgb(rgbColor);
  const rgbColorString = rgbColorFormatted.slice(rgbColorFormatted.indexOf('(') + 1, rgbColorFormatted.indexOf(')'));

  return rgbColorString.replaceAll(',', '');
};

export const convertOklchToRgb = (tailwindColors: TailwindColors) => {
  const spectrum: Array<{ weight: string; rgb: string }> = [];
  tailwindColors.forEach((color) => {
    if (color.value) {
      spectrum.push({ weight: color.weight, rgb: oklchToRgb(color.value) });
    }
  });
  return spectrum;
};

const prepareConfigFile = (
  primarySpectrum: Array<{ weight: string; rgb: string }>,
  secondarySpectrum: Array<{ weight: string; rgb: string }>,
) => {
  let scssContent = '';
  primarySpectrum.forEach((shade, index) => {
    scssContent += `$color-2-primary-${shade.weight}: ${shade.rgb};`;
    if (index !== primarySpectrum.length) {
      scssContent += `\n`;
    }
  });

  scssContent += '\n';

  secondarySpectrum.forEach((shade, index) => {
    scssContent += `$color-2-secondary-${shade.weight}: ${shade.rgb};`;
    if (index !== secondarySpectrum.length) {
      scssContent += `\n`;
    }
  });

  return scssContent;
};

const generateScssVariables = () => {
  const primaryTailwindColors = getTailwindColorsOklch(primaryColor);
  const primarySpectrum = convertOklchToRgb(primaryTailwindColors);
  const secondaryTailwindColors = getTailwindColorsOklch(secondaryColor);
  const secondarySpectrum = convertOklchToRgb(secondaryTailwindColors);
  const scssContent = prepareConfigFile(primarySpectrum, secondarySpectrum);

  const scssVariablesDirectory = path.resolve(__dirname, '../assets');
  const scssVariablesFilePath = path.resolve(scssVariablesDirectory, '_variables.scss');

  if (!fs.existsSync(scssVariablesDirectory)) {
    fs.mkdirSync(scssVariablesDirectory, { recursive: true });
  }

  fs.writeFileSync(scssVariablesFilePath, scssContent, 'utf8');
};

export default generateScssVariables;
