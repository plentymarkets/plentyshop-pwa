import { type SpectrumList } from '@effective/color/dist/engine';
import { createPaletteFromColor, PaletteConfig } from 'palettey';

export interface ColorParameters {
  colorDifference: number;
  darkColorCompensation: number;
}

const spectrumToTailwindMapper = [
  { id: '+5', weight: '50' },
  { id: '+4', weight: '100' },
  { id: '+3', weight: '200' },
  { id: '+2', weight: '300' },
  { id: '+1', weight: '400' },
  { id: '0', weight: '500' },
  { id: '-1', weight: '600' },
  { id: '-2', weight: '700' },
  { id: '-3', weight: '800' },
  { id: '-4', weight: '900' },
  { id: '-5', weight: '950' },
];

export const spectrumToTailwind = (spectrumList: SpectrumList) => {
  const tailwindColors = [
    { weight: '50', value: '' },
    { weight: '100', value: '' },
    { weight: '200', value: '' },
    { weight: '300', value: '' },
    { weight: '400', value: '' },
    { weight: '500', value: '' },
    { weight: '600', value: '' },
    { weight: '700', value: '' },
    { weight: '800', value: '' },
    { weight: '900', value: '' },
    { weight: '950', value: '' },
  ];

  spectrumList.forEach((spectrumListEntry) => {
    const spectrumId = spectrumListEntry.id;
    const tailwindWeight = spectrumToTailwindMapper.find((entry) => entry.id === spectrumId);
    const tailwindColorsEntry = tailwindColors.find((entry) => entry.weight === tailwindWeight?.weight);

    const colorValue = spectrumListEntry.value;
    if (tailwindColorsEntry && colorValue && typeof colorValue === 'string') {
      tailwindColorsEntry.value = colorValue;
    }
  });

  return tailwindColors;
};

export const hex2rgb = (hex: string) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);

  return { r, g, b };
};

export const getPaletteFromColor = (type: string, hexColor: string, config: PaletteConfig = {}) => {
  const paletteOutput = createPaletteFromColor(type, hexColor, config);
  const rgbPalette: Array<{ weight: string; rgb: string }> = [];
  Object.entries(paletteOutput[type]).forEach((entry) => {
    const rgb = hex2rgb(entry[1]) || '';
    rgbPalette.push({ weight: entry[0], rgb: `${rgb.r} ${rgb.g} ${rgb.b}` });
  });
  return rgbPalette;
};
