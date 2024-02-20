// https://nuxt.com/docs/api/configuration/nuxt-config
import cookieConfig from './cookie.config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
  },
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
      ],
    },
  },
  appConfig: {
    titleSuffix: 'plentyshop PWA',
    fallbackCurrency: 'GBP',
  },
  imports: {
    dirs: ['composables/**', 'utils/**'],
  },
  css: ['~/assets/style.scss'],
  image: {
    screens: {
      '4xl': 1920,
      '3xl': 1536,
      '2xl': 1366,
      xl: 1280,
      lg: 1024,
      md: 768,
      sm: 640,
      xs: 376,
      '2xs': 360,
    },
  },
  modules: [
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
  // eslint-disable-next-line unicorn/expiring-todo-comments
  // TODO: build is consistently failing because of this. check whether we need pre-render check.
  nitro: {
    prerender: {
      crawlLinks: false,
    },
    compressPublicAssets: true,
  },
  turnstile: {
    siteKey: process.env?.CLOUDFLARE_TURNSTILE_SITE_KEY,
  },
  routeRules: {
    '/_ipx/**': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
    '/icons/**': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
    '/favicon.ico': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
  },
  hooks: {
    'pages:extend'(pages) {
      pages.push(
        {
          name: 'category',
          path: '/c/:slug?/:slug_2?/:slug_3?/:slug_4?/:slug_5?/:slug_6?',
          file: __dirname + '/pages/category/[slug].vue',
        },
        {
          name: 'product',
          path: '/:slug?/:slug_2?/:slug_3?/:slug_4?/:slug_5?/:slug_6?_:itemId',
          file: __dirname + '/pages/product/[slug].vue',
        },
      );
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL ?? 'http://localhost:8181',
      cookieGroups: cookieConfig,
      showNetPrices: true,
      logoUrl: (process.env.API_URL ?? 'http://localhost:8181') + '/images/logo.png',
      turnstileSiteKey: process.env?.CLOUDFLARE_TURNSTILE_SITE_KEY ?? '',
      newsletterFromShowNames: process.env?.NEWSLETTER_FORM_SHOW_NAMES === '1' ?? false,
      useWebp: process.env?.USE_WEBP === '1' ?? false,
      validateReturnReasons: process.env.VALIDATE_RETURN_REASONS === '1' ?? false,
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,json,css,html,ico,svg,png,webp,ico,woff,woff2,ttf,eit,otf}', 'icons/*'],
      globIgnores: ['manifest**.webmanifest'],
      additionalManifestEntries: [
        {
          url: '/offline',
          revision: Math.random().toString(32),
        },
      ],
      navigationPreload: true,
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkOnly',
          options: {
            precacheFallback: {
              fallbackURL: '/offline',
            },
          },
        },
      ],
      cleanupOutdatedCaches: true,
    },
    manifest: {
      name: 'plentyshop PWA',
      short_name: 'plentyshopPWA',
      theme_color: '#018937',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    registerWebManifestInRouteRules: true,
  },
});
