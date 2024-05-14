import sfTypography from '@storefront-ui/typography';
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  presets: [tailwindConfig],
  content: ['./**/*.vue', '../../node_modules/@storefront-ui/vue/**/*.{js,mjs}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Red Hat Display"', ...defaultTheme.fontFamily.sans],
        body: ['"Red Hat Text"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          '50': '#ecffff',
          '100': '#ddd1ba',
          '200': '#a4f7fd',
          '300': '#65edfb',
          '400': '#20dbf0',
          '500': '#04bed6',
          '600': '#0697b4',
          '700': '#ceb38d',
          '800': '#808080', 
          '900': '#606060',
          '950': '#073342',
        },
        secondary: {
          '50': '#fffde7',
          '100': '#fffcc1',
          '200': '#fff787',
          '300': '#ffea42',
          '400': '#ffd90f',
          '500': '#f1c002',
          '600': '#cf9400',
          '700': '#a56903',
          '800': '#88520b',
          '900': '#74430f',
          '950': '#442204',
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
} as Config;
