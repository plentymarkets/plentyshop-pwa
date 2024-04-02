import { createResolver, defineNuxtModule, installModule } from 'nuxt/kit';
import sfTypography from '@storefront-ui/typography';
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';

export interface ModuleOptions {
  priority: number;
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary600: string;
  primary700: string;
  primary800: string;
  primary900: string;
  primary950: string;
  secondary50: string;
  secondary100: string;
  secondary200: string;
  secondary300: string;
  secondary400: string;
  secondary500: string;
  secondary600: string;
  secondary700: string;
  secondary800: string;
  secondary900: string;
  secondary950: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'theme',
  },

  defaults: {
    priority: Number(process.env.CONFIG_PRIORITY) ?? 1,
    primary50: process.env.PRIMARY50 ?? '#ecffff',
    primary100: process.env.PRIMARY100 ?? '#cefbff',
    primary200: process.env.PRIMARY200 ?? '#a4f7fd',
    primary300: process.env.PRIMARY300 ?? '#65edfb',
    primary400: process.env.PRIMARY400 ?? '#20dbf0',
    primary500: process.env.PRIMARY500 ?? '#04bed6',
    primary600: process.env.PRIMARY600 ?? '#0697b4',
    primary700: process.env.PRIMARY700 ?? '#0c7992',
    primary800: process.env.PRIMARY800 ?? '#146276',
    primary900: process.env.PRIMARY900 ?? '#155064',
    primary950: process.env.PRIMARY950 ?? '#073342',
    secondary50: process.env.SECONDARY50 ?? '#fffde7',
    secondary100: process.env.SECONDARY100 ?? '#fffcc1',
    secondary200: process.env.SECONDARY200 ?? '#fff787',
    secondary300: process.env.SECONDARY300 ?? '#ffea42',
    secondary400: process.env.SECONDARY400 ?? '#ffd90f',
    secondary500: process.env.SECONDARY500 ?? '#f1c002',
    secondary600: process.env.SECONDARY600 ?? '#cf9400',
    secondary700: process.env.SECONDARY700 ?? '#a56903',
    secondary800: process.env.SECONDARY800 ?? '#88520b',
    secondary900: process.env.SECONDARY900 ?? '#74430f',
    secondary950: process.env.SECONDARY950 ?? '#442204',
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    installModule('@nuxtjs/tailwindcss', {
      exposeConfig: true,
      config: {
        presets: [tailwindConfig],
        content: ['./**/*.vue', '../../node_modules/@storefront-ui/vue/**/*.{js,mjs}'],
        theme: {
          extend: {
            colors: {
              primary: {
                '50': options.primary50,
                '100': options.primary100,
                '200': options.primary200,
                '300': options.primary300,
                '400': options.primary400,
                '500': options.primary500,
                '600': options.primary600,
                '700': options.primary700,
                '800': options.primary800,
                '900': options.primary900,
                '950': options.primary950,
              },
              secondary: {
                '50': options.secondary50,
                '100': options.secondary100,
                '200': options.secondary200,
                '300': options.secondary300,
                '400': options.secondary400,
                '500': options.secondary500,
                '600': options.secondary600,
                '700': options.secondary700,
                '800': options.secondary800,
                '900': options.secondary900,
                '950': options.secondary950,
              },
            },
            gridTemplateAreas: {
              'product-page': ['left-top right', 'left-bottom right'],
            },
            gridTemplateColumns: {
              'product-page': 'minmax(56%, 500px) auto',
            },
            gridTemplateRows: {
              'category-sidebar': 'min-content auto min-content',
            },
            screens: {
              '4xl': '1920px',
              '3xl': '1536px',
              '2xl': '1366px',
              xl: '1280px',
              lg: '1024px',
              md: '768px',
              sm: '640px',
              xs: '376px',
              '2xs': '360px',
            },
          },
        },
        plugins: [sfTypography, require('@savvywombat/tailwindcss-grid-areas')],
      },
    });
  },
});
