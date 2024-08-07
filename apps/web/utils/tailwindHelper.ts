import { createPaletteFromColor, PaletteConfig } from '@plentymarkets/tailwind-colors';

export const hex2rgb = (hex: string) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);

  return { r, g, b };
};

export const getPaletteFromColor = (type: string, hexColor: string, config: PaletteConfig = {}) => {
  const paletteOutput = createPaletteFromColor(type, hexColor, config);
  const rgbPalette: Array<{ weight: string; rgb: string }> = [];
  Object.entries(paletteOutput[type]).forEach((entry) => {
    const rgb = hex2rgb(entry[1]) || '';
    rgbPalette.push({ weight: entry[0], rgb: `${rgb.r} ${rgb.g} ${rgb.b}` });
  });
  return rgbPalette;
};
