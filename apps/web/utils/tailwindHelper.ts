import { buildSpectrum, spectrumToList, type SpectrumList } from '@effective/color/dist/engine';
import { converter, formatRgb, Rgb } from 'culori/fn';
import { createPaletteFromColor, PaletteConfig } from '@plentymarkets/tailwind-colors';

export interface ColorParameters {
  colorDifference: number;
  darkColorCompensation: number;
}

const rgb = converter('rgb');

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

const handleMissingColor = (weight: string): Rgb => {
  const white = rgb('#fff') as Rgb;
  const black = rgb('#000') as Rgb;

  return weight < '500' ? white : black;
};

export const oklchToRgb = (oklch: string, weight: string) => {
  const rgbColor = rgb(oklch) ?? handleMissingColor(weight);
  const rgbColorFormatted = formatRgb(rgbColor);
  const rgbColorString = rgbColorFormatted.slice(rgbColorFormatted.indexOf('(') + 1, rgbColorFormatted.indexOf(')'));

  return rgbColorString.replaceAll(',', '');
};

export const getTailwindColorsOklch = (type: string, hexColor: string, config: PaletteConfig) => {
  const palette = createPaletteFromColor(type, hexColor, config);
  const fix: Array<{ weight: string; rgb: string }> = [];
  Object.entries(palette[type]).forEach((entry) => {
    fix.push({ weight: entry[0], rgb: entry[1] });
  });
  return fix;

  // console.error('_Pallet', palette);
  // return palette;
  // let colors;
  // Object.entries(palette).forEach((entry) => {
  //   colors = entry[1];
  // });
  // console.log(colors)
  // return colors;
  // const spectrum = buildSpectrum(hexColor, {
  //   colorSteps: 5,
  //   colorDifference: colorParameters.colorDifference,
  //   darkColorCompensation: colorParameters.darkColorCompensation,
  //   mixerSteps: 0.001,
  //   outputSpace: 'oklch',
  //   outputGamut: 'p3',
  //   outputCSS: true,
  //   outputPrecision: 3,
  // });
  // const spectrumList = spectrumToList(spectrum);
  // return spectrumToTailwind(spectrumList);
};
