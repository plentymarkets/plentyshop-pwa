import type { PaletteConfig } from '@plentymarkets/tailwind-colors';
import { createPaletteFromColor } from '@plentymarkets/tailwind-colors';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface Shade {
  weight: string;
  rgb: string;
}

export type TailwindPalette = Array<Shade>;

const hex2rgb = (hex: string): RGB => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);

  return { r, g, b };
};

export const getPaletteFromColor = (type: string, hexColor: string, config: PaletteConfig = {}): TailwindPalette => {
  const paletteOutput = createPaletteFromColor(type, hexColor, config);
  const rgbPalette: TailwindPalette = [];
  Object.entries(paletteOutput[type]).forEach((entry) => {
    const rgb = hex2rgb(entry[1]) || '';
    rgbPalette.push({ weight: entry[0], rgb: `${rgb.r} ${rgb.g} ${rgb.b}` });
  });
  return rgbPalette;
};
