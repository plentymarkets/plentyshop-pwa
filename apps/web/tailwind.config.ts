import sfTypography from '@storefront-ui/typography';
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  presets: [tailwindConfig],
  content: ['./**/*.vue', '../../node_modules/@storefront-ui/vue/**/*.{js,mjs}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#AFDEF8',
          200: '#5DC3F0',
          300: '#0099BE',
          400: '#02809E',
          500: '#046980',
          600: '#054E63',
          700: '#04485B',
          800: '#073342',
          900: '#012E35',
        },
        secondary: {
          100: '#FFEDA1',
          200: '#FFEDA1',
          300: '#FFEDA1',
          400: '#FFEDA1',
          500: '#FFEDA1',
          600: '#F5D452',
          700: '#F1C002',
          800: '#C59701',
          900: '#987400',
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
