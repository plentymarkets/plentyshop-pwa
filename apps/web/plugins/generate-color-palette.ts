import { getPaletteFromColor } from '../utils/tailwindHelper';
import type { Shade } from '../utils/tailwindHelper';

export default defineNuxtPlugin(async () => {
  if (!import.meta.server) return;
  const buildPalette = (colorType: string, baseColor?: string): Array<Shade & { type: string }> => {
    if (!baseColor) return [];

    return getPaletteFromColor(colorType, baseColor).map((item: Shade) => ({
      ...item,
      type: colorType,
    }));
  };

  try {
    const primaryColor = process.env.NUXT_PUBLIC_PRIMARY_COLOR || '#062633';
    const secondaryColor = process.env.NUXT_PUBLIC_SECONDARY_COLOR || '#31687d';
    const primaryPalette = buildPalette('primary', primaryColor);
    const secondaryPalette = buildPalette('secondary', secondaryColor);

    const colors = [...primaryPalette, ...secondaryPalette];

    const styleString = colors.reduce((acc, { type, weight, rgb }) => {
      return acc + `--colors-2-${type}-${weight}: ${rgb};`;
    }, '');

    useHead({
      style: [
        {
          children: `:root { ${styleString} }`,
        },
      ],
    });
  } catch (error) {
    console.error('Failed to initialize settings:', error);
  }
});
