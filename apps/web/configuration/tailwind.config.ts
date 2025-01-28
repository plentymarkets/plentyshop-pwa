import sfTypography from '@storefront-ui/typography';
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import { fontFamilyText } from './fontFamily.config';

export default {
  presets: [tailwindConfig],
  content: ['./**/*.vue', '../../node_modules/@storefront-ui/vue/**/*.{js,mjs}'],
  theme: {
    extend: {
      sfTypography: () => ({
        'display-1': {
          fontFamily: 'inherit',
        },
        'display-2': {
          fontFamily: 'inherit',
        },
        'headline-1': {
          fontFamily: 'inherit',
        },
        'headline-2': {
          fontFamily: 'inherit',
        },
        'headline-3': {
          fontFamily: 'inherit',
        },
        'headline-4': {
          fontFamily: 'inherit',
        },
        'headline-5': {
          fontFamily: 'inherit',
        },
        'headline-6': {
          fontFamily: 'inherit',
        },
      }),
      fontFamily: {
        body: [`${fontFamilyText}`, ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          '50': 'rgb(var(--colors-2-primary-50) / <alpha-value>)',
          '100': 'rgb(var(--colors-2-primary-100) / <alpha-value>)',
          '200': 'rgb(var(--colors-2-primary-200) / <alpha-value>)',
          '300': 'rgb(var(--colors-2-primary-300) / <alpha-value>)',
          '400': 'rgb(var(--colors-2-primary-400) / <alpha-value>)',
          '500': 'rgb(var(--colors-2-primary-500) / <alpha-value>)',
          '600': 'rgb(var(--colors-2-primary-600) / <alpha-value>)',
          '700': 'rgb(var(--colors-2-primary-700) / <alpha-value>)',
          '800': 'rgb(var(--colors-2-primary-800) / <alpha-value>)',
          '900': 'rgb(var(--colors-2-primary-900) / <alpha-value>)',
          '950': 'rgb(var(--colors-2-primary-950) / <alpha-value>)',
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
        editor: {
          'body-bg': '#F1F3F5',
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
      width: {
        '128': '32rem',
      },
      spacing: {
        s: '1.875rem',
        m: '2.5rem',
        l: '3.125rem',
        xl: '3.75rem',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [sfTypography, require('@savvywombat/tailwindcss-grid-areas')],
} as Config;
