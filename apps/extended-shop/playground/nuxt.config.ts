import path from 'path';
export default defineNuxtConfig({
  modules: ['../src/module',
    '@nuxtjs/turnstile',
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          'Red Hat Display': [400, 500, 700],
          'Red Hat Text': [300, 400, 500, 700],
        },
      },
    ],
    [
      '@nuxtjs/i18n',
      {
        locales: [
          {
            code: 'en',
            file: 'en.json',
          },
          {
            code: 'de',
            file: 'de.json',
          },
        ],
        lazy: true,
        langDir: 'lang',
        defaultLocale: 'en',
      },
    ],
    [
      '@vee-validate/nuxt',
      {
        autoImports: true,
        componentNames: {
          Form: 'VeeForm',
          Field: 'VeeField',
          FieldArray: 'VeeFieldArray',
          ErrorMessage: 'VeeErrorMessage',
        },
      },
    ],
    '@nuxt/image',
    '@vite-pwa/nuxt',
    '@nuxt/test-utils/module',
    'nuxt-lazy-hydrate',
  ],

  css: ['~/assets/style.scss'],

  devtools: { enabled: true },
  alias: {
    "~": path.resolve(__dirname, '../../web'),
    "@": path.resolve(__dirname, '../../web'),
  },
})
