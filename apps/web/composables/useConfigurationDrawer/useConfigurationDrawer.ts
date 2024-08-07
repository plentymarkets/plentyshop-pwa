import { getPaletteFromColor, TailwindPalette } from '~/utils/tailwindHelper';
import { SetColorProperties, UpdateColorPalette, UseConfigurationDraerMethodsReturn } from './types';

const open = ref(false);

const setColorProperties: SetColorProperties = (type: string, tailwindPalette: TailwindPalette) => {
  tailwindPalette.forEach((shade) => {
    if (shade.rgb) {
      document.documentElement.style.setProperty(`--colors-2-${type}-${shade.weight}`, shade.rgb);
    }
  });
};

const updatePrimaryColor: UpdateColorPalette = (hexColor: string) => {
  const tailwindColors: TailwindPalette = getPaletteFromColor('primary', hexColor).map((color) => ({
    ...color,
    value: '',
  }));

  setColorProperties('primary', tailwindColors);
};

const updateSecondaryColor: UpdateColorPalette = (hexColor: string) => {
  const tailwindColors: TailwindPalette = getPaletteFromColor('secondary', hexColor).map((color) => ({
    ...color,
    value: '',
  }));

  setColorProperties('secondary', tailwindColors);
};

export const useConfigurationDrawer: UseConfigurationDraerMethodsReturn = () => {
  return { open, updatePrimaryColor, updateSecondaryColor };
};
