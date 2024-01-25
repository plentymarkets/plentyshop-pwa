import path from 'path';
export default defineNuxtConfig({

  app: {
    head: {
      viewport: 'minimum-scale=1, initial-scale=1, width=device-width',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'description', content: 'plentyshop PWA' },
        { name: 'theme-color', content: '#018937' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
         {rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/tailwindcss@6.8.0/dist/tailwind.min.css'}
      ],

      script: [
        { hid: 'tailwind', src: 'https://cdn.tailwindcss.com', defer: true }
      ]
    },
  },
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
