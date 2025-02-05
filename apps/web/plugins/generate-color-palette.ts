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
    const primaryPalette = buildPalette('primary', process.env.NUXT_PUBLIC_PRIMARY_COLOR);
    const secondaryPalette = buildPalette('secondary', process.env.NUXT_PUBLIC_SECONDARY_COLOR);

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
