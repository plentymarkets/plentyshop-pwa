import { getPaletteFromColor } from '~/utils/tailwindHelper';
import type { TailwindColors } from './types';

const open = ref(false);

const setColorProperties = (type: string, tailwindColors: TailwindColors) => {
  tailwindColors.forEach((color) => {
    if (color.rgb) {
      document.documentElement.style.setProperty(`--colors-2-${type}-${color.weight}`, color.rgb);
    }
  });
};

const updatePrimaryColor = (hexColor: string) => {
  const tailwindColors: TailwindColors = getPaletteFromColor('primary', hexColor).map((color) => ({
    ...color,
    value: '',
  }));

  setColorProperties('primary', tailwindColors);
};

const updateSecondaryColor = (hexColor: string) => {
  const tailwindColors: TailwindColors = getPaletteFromColor('secondary', hexColor).map((color) => ({
    ...color,
    value: '',
  }));

  setColorProperties('secondary', tailwindColors);
};

export const useConfigurationDrawer = () => {
  return { open, updatePrimaryColor, updateSecondaryColor };
};
