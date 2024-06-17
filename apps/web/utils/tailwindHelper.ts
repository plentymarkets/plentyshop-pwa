import { buildSpectrum, spectrumToList, type SpectrumList } from '@effective/color/dist/engine';
import { converter, formatRgb } from 'culori/fn';

const rgb = converter('rgb');

const spectrumToTailwindMapper = [
  { id: '-5', weight: '50' },
  { id: '-4', weight: '100' },
  { id: '-3', weight: '200' },
  { id: '-2', weight: '300' },
  { id: '-1', weight: '400' },
  { id: '0', weight: '500' },
  { id: '+1', weight: '600' },
  { id: '+2', weight: '700' },
  { id: '+3', weight: '800' },
  { id: '+4', weight: '900' },
  { id: '+5', weight: '950' },
];

const spectrumToTailwind = (spectrumList: SpectrumList) => {
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

export const oklchToRgb = (oklch: string) => {
  const rgbColor = rgb(oklch) ?? { mode: 'rgb', r: 0, g: 0, b: 0 };
  const rgbColorFormatted = formatRgb(rgbColor);
  const rgbColorString = rgbColorFormatted.slice(rgbColorFormatted.indexOf('(') + 1, rgbColorFormatted.indexOf(')'));

  return rgbColorString.replaceAll(',', '');
};

export const getTailwindColorsOklch = (hexColor: string) => {
  const spectrum = buildSpectrum(hexColor);
  const spectrumList = spectrumToList(spectrum);
  return spectrumToTailwind(spectrumList);
};
