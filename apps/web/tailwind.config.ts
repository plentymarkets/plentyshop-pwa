import sfTypography from '@storefront-ui/typography';
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const primaryColor50: string = process.env.PRIMARY50 || 'rgb(var(--colors-2-primary-50) / <alpha-value>)';
const primaryColor100: string = process.env.PRIMARY100 || 'rgb(var(--colors-2-primary-100) / <alpha-value>)';
const primaryColor200: string = process.env.PRIMARY200 || 'rgb(var(--colors-2-primary-200) / <alpha-value>)';
const primaryColor300: string = process.env.PRIMARY300 || 'rgb(var(--colors-2-primary-300) / <alpha-value>)';
const primaryColor400: string = process.env.PRIMARY400 || 'rgb(var(--colors-2-primary-400) / <alpha-value>)';
const primaryColor500: string = process.env.PRIMARY500 || 'rgb(var(--colors-2-primary-500) / <alpha-value>)';
const primaryColor600: string = process.env.PRIMARY600 || 'rgb(var(--colors-2-primary-600) / <alpha-value>)';
const primaryColor700: string = process.env.PRIMARY700 || 'rgb(var(--colors-2-primary-700) / <alpha-value>)';
const primaryColor800: string = process.env.PRIMARY800 || 'rgb(var(--colors-2-primary-800) / <alpha-value>)';
const primaryColor900: string = process.env.PRIMARY900 || 'rgb(var(--colors-2-primary-900) / <alpha-value>)';
const primaryColor950: string = process.env.PRIMARY950 || 'rgb(var(--colors-2-primary-950) / <alpha-value>)';

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
          '50': primaryColor50,
          '100': primaryColor100,
          '200': primaryColor200,
          '300': primaryColor300,
          '400': primaryColor400,
          '500': primaryColor500,
          '600': primaryColor600,
          '700': primaryColor700,
          '800': primaryColor800,
          '900': primaryColor900,
          '950': primaryColor950,
        },
        secondary: {
          '50': 'rgb(var(--colors-2-secondary-50) / <alpha-value>)',
          '100': 'rgb(var(--colors-2-secondary-100) / <alpha-value>)',
          '200': 'rgb(var(--colors-2-secondary-200) / <alpha-value>)',
          '300': 'rgb(var(--colors-2-secondary-300) / <alpha-value>)',
          '400': 'rgb(var(--colors-2-secondary-400) / <alpha-value>)',
          '500': 'rgb(var(--colors-2-secondary-500) / <alpha-value>)',
          '600': 'rgb(var(--colors-2-secondary-600) / <alpha-value>)',
          '700': 'rgb(var(--colors-2-secondary-700) / <alpha-value>)',
          '800': 'rgb(var(--colors-2-secondary-800) / <alpha-value>)',
          '900': 'rgb(var(--colors-2-secondary-900) / <alpha-value>)',
          '950': 'rgb(var(--colors-2-secondary-950) / <alpha-value>)',
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
