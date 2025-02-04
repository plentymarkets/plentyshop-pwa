import { SystemConfiguration } from '../build/configurator/SystemConfiguration';
import { getPaletteFromColor } from '../utils/tailwindHelper';

export default defineNuxtPlugin(async () => {
  const colors = [
    { type: 'primary', weight: 50, rgb: '239 246 255' },
    { type: 'primary', weight: 100, rgb: '219 234 254' },
    { type: 'primary', weight: 200, rgb: '191 219 254' },
    { type: 'primary', weight: 300, rgb: '147 197 253' },
    { type: 'primary', weight: 400, rgb: '96 165 250' },
    { type: 'primary', weight: 500, rgb: '59 130 246' },
    { type: 'primary', weight: 600, rgb: '37 99 35' },
    { type: 'primary', weight: 700, rgb: '29 78 16' },
    { type: 'primary', weight: 800, rgb: '30 64 75' },
    { type: 'primary', weight: 900, rgb: '30 58 38' },
    { type: 'secondary', weight: 50, rgb: '238 242 255' },
    { type: 'secondary', weight: 100, rgb: '224 231 255' },
    { type: 'secondary', weight: 200, rgb: '199 210 254' },
    { type: 'secondary', weight: 300, rgb: '165 180 252' },
    { type: 'secondary', weight: 400, rgb: '129 140 248' },
    { type: 'secondary', weight: 500, rgb: '99 102 241' },
    { type: 'secondary', weight: 600, rgb: '79 70 29' },
    { type: 'secondary', weight: 700, rgb: '67 56 02' },
    { type: 'secondary', weight: 800, rgb: '55 48 63' },
    { type: 'secondary', weight: 900, rgb: '49 46 29' },
  ];

  const mergeColors = (baseIndex, newPalette) => {
    for (let i = 0; i < newPalette.length; i++) {
      if (baseIndex + i < colors.length) {
        colors[baseIndex + i].rgb = newPalette[i].rgb;
      }
    }
  }

  if (import.meta.server) {
    const systemConfiguration = new SystemConfiguration();
    
    try {
      await systemConfiguration.fetch();

      const primaryBase = systemConfiguration.getBaseColors().primary;
      const tailwindPrimary = getPaletteFromColor('primary', primaryBase);

      const secondaryBase = systemConfiguration.getBaseColors().secondary || primaryBase;
      const tailwindSecondary = getPaletteFromColor('secondary', secondaryBase);

      mergeColors(0, tailwindPrimary);
      mergeColors(10, tailwindSecondary);

      const styleString = colors.reduce((acc, val) => {
        return acc + `--colors-2-${val.type}-${val.weight}: ${val.rgb};`;
      }, '');

      useHead({
        style: [
          {
            children: `:root { ${styleString} }`,
            type: 'text/css',
          },
        ],
      });
    } catch (error) {
      console.error('Failed to fetch system configuration:', error);
    }
  }
});
