import { getPaletteFromColor } from '../utils/tailwindHelper';
import type { Shade } from '../utils/tailwindHelper';

export default defineNuxtPlugin(async () => {
  const buildPalette = (colorType: string, baseColor?: string): Array<Shade & { type: string }> => {
    if (!baseColor) return [];

    return getPaletteFromColor(colorType, baseColor).map((item: Shade) => ({
      ...item,
      type: colorType,
    }));
  };

  try {
    const { getSetting: getPrimaryColor } = useSiteSettings('primaryColor');
    const { getSetting: getSecondaryColor } = useSiteSettings('secondaryColor');
    const { getSetting: getHeaderBackgroundColor } = useSiteSettings('headerBackgroundColor');

    const primaryColor = getPrimaryColor() || '#062633';
    const secondaryColor = getSecondaryColor() || '#31687d';
    const headerColor = getHeaderBackgroundColor() || primaryColor || '#062633';
    const primaryPalette = buildPalette('primary', primaryColor);
    const secondaryPalette = buildPalette('secondary', secondaryColor);
    const headerPalette = buildPalette('header', headerColor);

    const colors = [...primaryPalette, ...secondaryPalette, ...headerPalette];

    const styleString = colors.reduce((acc, { type, weight, rgb }) => {
      return acc + `--colors-2-${type}-${weight}: ${rgb};`;
    }, '');

    useHead({
      style: [
        {
          innerHTML: `:root { ${styleString} }`,
        },
      ],
    });
  } catch (error) {
    console.error('Failed to initialize settings:', error);
  }
});
