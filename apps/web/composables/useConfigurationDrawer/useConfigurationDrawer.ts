import { getTailwindColorsOklch, oklchToRgb } from '~/utils/tailwindHelper';
import type { TailwindColors } from './types';

const open = ref(false);

const setColorProperties = (type: string, tailwindColors: TailwindColors) => {
  tailwindColors.forEach((color) => {
    if (color.value) {
      const rgb = oklchToRgb(color.value);
      document.documentElement.style.setProperty(`--colors-2-${type}-${color.weight}`, rgb);
    }
  });
};

const updatePrimaryColor = (hexColor: string) => {
  const tailwindColors = getTailwindColorsOklch(hexColor);

  setColorProperties('primary', tailwindColors);
};

const updateSecondaryColor = (hexColor: string) => {
  const tailwindColors = getTailwindColorsOklch(hexColor);

  setColorProperties('secondary', tailwindColors);
};

export const useConfigurationDrawer = () => {
  return { open, updatePrimaryColor, updateSecondaryColor };
};
