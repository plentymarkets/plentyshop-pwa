import { getPaletteFromColor } from '../utils/tailwindHelper';
import type { Shade } from '../utils/tailwindHelper';

const paletteCache = new Map<string, Array<Shade & { type: string }>>();

export default defineNuxtPlugin({
  enforce: 'post',
  async setup() {
    const buildPalette = (colorType: string, baseColor?: string): Array<Shade & { type: string }> => {
      if (!baseColor) return [];

      const cacheKey = `${colorType}:${baseColor}`;
      const cached = paletteCache.get(cacheKey);
      if (cached) return cached;

      const palette = getPaletteFromColor(colorType, baseColor).map((item: Shade) => ({
        ...item,
        type: colorType,
      }));

      paletteCache.set(cacheKey, palette);
      return palette;
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
  },
});
