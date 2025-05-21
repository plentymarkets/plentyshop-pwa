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
    const publicRuntimeConfig = useRuntimeConfig().public;
    const primaryColor = publicRuntimeConfig.primaryColor || '#062633';
    const secondaryColor = publicRuntimeConfig.secondaryColor || '#31687d';
    const primaryPalette = buildPalette('primary', primaryColor);
    const secondaryPalette = buildPalette('secondary', secondaryColor);

    const colors = [...primaryPalette, ...secondaryPalette];

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
