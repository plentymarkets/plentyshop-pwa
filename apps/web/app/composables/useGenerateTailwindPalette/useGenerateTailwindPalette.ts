import { getPaletteFromColor } from '~/utils/tailwindHelper';

type PaletteType = 'primary' | 'secondary';

const tailwindShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const getGlobalPaletteType = (value: string): PaletteType | null => {
  const paletteTypeMatch = value.match(/--colors-2-(primary|secondary)-500/);
  const matchedPaletteType = paletteTypeMatch?.[1];

  if (matchedPaletteType === 'primary' || matchedPaletteType === 'secondary') {
    return matchedPaletteType;
  }

  return null;
};

const isHexColor = (value: string): boolean => /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value);

/**
 * Generates a CSS-variable palette map for the provided color group.
 *
 * Supports either global CSS variables (`--colors-2-primary-500` / `--colors-2-secondary-500`)
 * or a hex color which will be expanded into a full shade palette.
 */
export const useGenerateTailwindPalette = (
  colorGroup: string,
  baseColor: Ref<string> | ComputedRef<string>,
): ComputedRef<Record<string, string>> => {
  return computed<Record<string, string>>(() => {
    const color = baseColor.value;
    if (!color) {
      return {};
    }

    const paletteType = getGlobalPaletteType(color);
    if (paletteType) {
      return tailwindShades.reduce<Record<string, string>>((style, shadeWeight) => {
        style[`--colors-2-${colorGroup}-${shadeWeight}`] = `var(--colors-2-${paletteType}-${shadeWeight})`;
        return style;
      }, {});
    }

    if (!isHexColor(color)) {
      return {};
    }

    return getPaletteFromColor(colorGroup, color).reduce<Record<string, string>>((style, shade) => {
      style[`--colors-2-${colorGroup}-${shade.weight}`] = shade.rgb;
      return style;
    }, {});
  });
};
