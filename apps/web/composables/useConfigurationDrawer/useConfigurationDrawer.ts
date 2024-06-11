import { getTailwindColorsOklch, oklchToRgb } from '~/utils/tailwindHelper';

const open = ref(false);

const setColorProperties = (type: string, tailwindColors: any) => {
  tailwindColors.forEach((color: {weight: string, value: string}) => {
    if (color.value) {
      const rgb = oklchToRgb(color.value);
      document.documentElement.style.setProperty(`--colors-${type}-${color.weight}`, rgb);
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
