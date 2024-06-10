const open = ref(false);

const hexToRgb = (hex: string) => {
  const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (!result) return '';
  const r = Number.parseInt(result[1], 16);
  const g = Number.parseInt(result[2], 16);
  const b = Number.parseInt(result[3], 16);
  return `${r} ${g} ${b}`;
};

const updatePrimaryColor = (hexColor: string) => {
  const rgb = hexToRgb(hexColor);
  document.documentElement.style.setProperty('--colors-primary-700', rgb);
};

const updateSecondaryColor = (hexColor: string) => {
  const rgb = hexToRgb(hexColor);
  document.documentElement.style.setProperty('--colors-secondary-700', rgb);
};

export const useConfigurationDrawer = () => {
  return { open, updatePrimaryColor, updateSecondaryColor };
};
