import sfTypography from '@storefront-ui/typography';
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const fontFamilyText = process.env.NUXT_PUBLIC_FONT || 'Red Hat Text';

export default {
  presets: [tailwindConfig],
  content: ['./**/*.vue', '../../node_modules/@storefront-ui/vue/**/*.{js,mjs}'],
  safelist: [
    {
      pattern: /^col-span-(1[0-2]|[1-9])$/,
    },
  ],
  theme: {
    extend: {
      sfTypography: () => ({
        'display-1': {
          fontFamily: 'inherit',
        },
        'display-2': {
          fontFamily: 'inherit',
        },
        'display-3': {
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
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px
        '3xs': ['0.625rem', { lineHeight: '0.875rem' }], // 10px
        '4xs': ['0.5625rem', { lineHeight: '0.75rem' }], // 9px
      },
      fontFamily: {
        body: [`${fontFamilyText}`, ...defaultTheme.fontFamily.sans],
        editor: ['Red Hat Text', ...defaultTheme.fontFamily.sans],
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
          button: '#062633',
          'toc-highlight': '#E6F0FF',
          'toc-hover': '#F5FAFF',
          'toc-selected': '#538AEA',
          'block-selected': '#1D5EC7',
          'block-selected-hover': '#1650AA',
          danger: '#CC3333',
          'icon-hover': 'rgba(6, 38, 51, 0.08)',
          'text-strong': '#1a1a1a',
          'text-default': '#444444',
          'text-subtle': '#666666',
          'text-muted': '#777777',
          'text-faint': '#888888',
          'text-placeholder': '#aaaaaa',
          'text-ghost': '#bbbbbb',
          surface: '#f5f5f5',
          'surface-cool-hover': '#e4e8f0',
          'surface-muted': '#f0f0f0',
          border: '#e8e8e8',
          'accent-border-hover': '#c0d4ff',
          accent: 'rgb(29 94 199 / <alpha-value>)',
          'canvas-border': '#e2e2e2',
          'canvas-cell': '#f3f3f3',
          'text-dim': '#c4c4c4',
          'cell-border': '#c8cdd4',
          'cell-empty-text': '#9aa3ad',
          'cell-empty-sub': '#bcc2c9',
          'cell-handle': '#dadde2',
          'free-border': '#d4d4d4',
          'free-border-hover': '#999999',
          'input-border': '#a0a0a0',
          icon: 'rgb(12 24 31 / <alpha-value>)',
        },

        header: {
          '50': 'rgb(var(--colors-2-header-50) / <alpha-value>)',
          '100': 'rgb(var(--colors-2-header-100) / <alpha-value>)',
          '200': 'rgb(var(--colors-2-header-200) / <alpha-value>)',
          '300': 'rgb(var(--colors-2-header-300) / <alpha-value>)',
          '400': 'rgb(var(--colors-2-header-400) / <alpha-value>)',
          '500': 'rgb(var(--colors-2-header-500) / <alpha-value>)',
          '600': 'rgb(var(--colors-2-header-600) / <alpha-value>)',
          '700': 'rgb(var(--colors-2-header-700) / <alpha-value>)',
          '800': 'rgb(var(--colors-2-header-800) / <alpha-value>)',
          '900': 'rgb(var(--colors-2-header-900) / <alpha-value>)',
          '950': 'rgb(var(--colors-2-header-950) / <alpha-value>)',
        },
      },
      backgroundImage: {
        'editor-hatched': 'repeating-linear-gradient(45deg, #fafafa 0, #fafafa 6px, transparent 6px, transparent 12px)',
      },
      boxShadow: {
        'block-actions':
          '0 10px 28px -10px rgba(15, 23, 42, 0.22), 0 4px 10px -4px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'block-actions-hover':
          '0 14px 36px -10px rgba(15, 23, 42, 0.3), 0 6px 14px -4px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'block-action-btn': '0 2px 8px -2px rgba(29, 94, 199, 0.25)',
        'block-action-btn-danger': '0 2px 8px -2px rgba(204, 51, 51, 0.25)',
        'add-block-btn': '0 2px 8px rgba(29, 94, 199, 0.3)',
        'add-block-btn-hover': '0 4px 14px rgba(29, 94, 199, 0.45)',
        'block-outline': '0 0 0 1px rgba(255, 255, 255, 0.95), inset 0 0 0 1px rgba(255, 255, 255, 0.95)',
        'block-outline-selected': '0 0 0 1.5px white, inset 0 0 0 1.5px white',
        'card-hover': '0 0 16px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'editor-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      gridTemplateAreas: {
        'product-page': ['left-top right', 'left-bottom right'],
      },
      gridTemplateColumns: {
        'product-page': 'minmax(56%, 500px) auto',
        'search-dropdown': 'minmax(280px, 360px) 1fr',
      },
      gridTemplateRows: {
        'category-sidebar': 'min-content auto min-content',
      },
      zIndex: {
        base: '0',
        raised: '1',
        overlap: '2',
        'editor-drawer': '10',
        'editor-inline': '30',
        sticky: '40',
        dropdown: '50',
        notifications: '60',
        'drawer-backdrop': '70',
        drawer: '80',
        cookiebar: '90',
        'editor-toolbar': '100',
        'modal-backdrop': '200',
        modal: '210',
        popover: '220',
        loader: '300',
        picker: '400',
        toast: '500',
        max: '9999',
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
      containers: {
        mobile: '375px',
        tablet: '768px',
        desktop: '1024px',
        '2xs': '360px',
        xs: '376px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1366px',
        '3xl': '1536px',
        '4xl': '1920px',
      },
      width: {
        '128': '32rem',
      },
      spacing: {
        s: '1.875rem',
        m: '2.5rem',
        l: '3.125rem',
        xl: '3.75rem',
        toolbar: '54px',
      },
      maxHeight: {
        dropdown: 'calc(var(--viewport-height, 100dvh) - 120px)',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [sfTypography, require('@savvywombat/tailwindcss-grid-areas'), require('@tailwindcss/container-queries')],
} as Config;
