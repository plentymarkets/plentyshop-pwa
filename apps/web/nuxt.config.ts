// https://nuxt.com/docs/api/configuration/nuxt-config
import { validateApiUrl } from './utils/pathHelper';
import cookieConfig from './configuration/cookie.config';
import { nuxtI18nOptions } from './configuration/i18n.config';
import { appConfiguration } from './configuration/app.config';

export default defineNuxtConfig({
  telemetry: false,
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
  },
  app: appConfiguration,
  experimental: {
    asyncContext: true,
  },
  appConfig: {
    titleSuffix: process.env.STORENAME || 'PlentyONE Shop',
    fallbackCurrency: 'GBP',
  },
  imports: {
    dirs: ['composables', 'composables/**', 'utils/**'],
  },
  css: ['~/assets/style.scss'],
  // TODO: build is consistently failing because of this. check whether we need pre-render check.
  nitro: {
    prerender: {
      crawlLinks: false,
    },
    compressPublicAssets: true,
  },
  routeRules: {
    '/_ipx/**': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
    '/_nuxt-plenty/icons/**': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
    '/_nuxt-plenty/favicon.ico': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
    '/_nuxt-plenty/images/**': { headers: { 'cache-control': `max-age=604800` } },
  },
  site: {
    url: '',
  },
  pages: true,
  runtimeConfig: {
    public: {
      domain: validateApiUrl(process.env.API_URL) ?? process.env.API_ENDPOINT,
      apiEndpoint: process.env.API_ENDPOINT,
      cookieGroups: cookieConfig,
      turnstileSiteKey: process.env?.TURNSTILESITEKEY ?? '',
      useAvif: process.env?.IMAGEAVIF === 'true',
      useWebp: process.env?.IMAGEWEBP === 'true',
      validateReturnReasons: process.env.VALIDATE_RETURN_REASONS === '1',
      enableQuickCheckoutTimer: process.env.ENABLE_QUICK_CHECKOUT_TIMER === '1',
      showConfigurationDrawer: process.env.SHOW_CONFIGURATION_DRAWER === '1',
      defaultItemsPerPage: Number(process.env.DEFAULT_FEEDBACK_ITEMS_PER_PAGE ?? 10),
      headerLogo: process.env.LOGO || '/_nuxt-plenty/images/logo.svg',
      homepageCategoryId: Number(process.env.HOMEPAGE) ?? null,
      shippingTextCategoryId: Number(process.env.SHIPPINGTEXT) ?? null,
      enableGuestLogin: process.env?.ENABLE_GUEST_LOGIN === 'true',
      storename: process.env.STORENAME || 'PLENTYSYSTEMS AG',
      noCache: process.env.NO_CACHE || '',
      configId: process.env.CONFIG_ID || '',
      isHero: true,
      font: process.env.NUXT_PUBLIC_FONT || 'Red Hat Text',
      blockSize: process.env.NUXT_PUBLIC_BLOCK_SIZE || 'm',
      primaryColor: process.env.NUXT_PUBLIC_PRIMARY_COLOR || '#062633',
      secondaryColor: process.env.NUXT_PUBLIC_SECONDARY_COLOR || '#31687d',
    },
  },
  modules: [
    '@plentymarkets/shop-module-gtag',
    '@plentymarkets/shop-core',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/turnstile',
    'nuxt-lazy-hydrate',
    'nuxt-viewport',
    '@vee-validate/nuxt',
    '@vite-pwa/nuxt',
    '@vue-storefront/nuxt',
  ],
  vsf: {
    middleware: {
      apiUrl: validateApiUrl(process.env.API_URL) ?? 'http://localhost:8181',
    },
  },
  fonts: {
    defaults: {
      weights: [300, 400, 500, 700],
    },
    assets: {
      prefix: '/_nuxt-plenty/fonts/',
    },
  },
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
  i18n: nuxtI18nOptions,
  sitemap: {
    autoLastmod: true,
    xsl: '/sitemap_style.xsl',
    xslColumns: [
      // URL column must always be set, no value needed
      { label: 'URL', width: '75%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
    ],
    sitemaps: {
      'sitemap/content': {
        exclude: [
          `/${nuxtI18nOptions.defaultLocale}/**`,
          '/search',
          '/offline',
          '/my-account/**',
          '/readonly-checkout',
          '/set-new-password',
          '/reset-password-success',
          '/cart',
          '/checkout',
          '/confirmation',
          '/wishlist',
          '/login',
          '/signup',
          '/reset-password',
        ],
        includeAppSources: true,
      },
    },
  },
  tailwindcss: {
    configPath: '~/configuration/tailwind.config.ts',
    exposeConfig: true,
  },
  turnstile: {
    siteKey: process.env?.TURNSTILESITEKEY,
  },
  viewport: {
    breakpoints: {
      xs: 380,
      sm: 640,
      md: 768,
      lg: 1024,
      '4xl': 1920,
    },
    defaultBreakpoints: {
      mobile: 'sm',
      tablet: 'md',
      desktop: 'lg',
      wideScreen: '4xl',
    },
    fallbackBreakpoint: 'lg',
    cookie: {
      expires: 365,
      name: 'plenty-viewport',
      path: '/',
      sameSite: 'Strict',
      secure: true,
    },
  },
  veeValidate: {
    autoImports: false,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,json,css,html,ico,svg,png,webp,ico,woff,woff2,ttf,eit,otf}', '_nuxt-plenty/icons/*'],
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
      theme_color: '#0C7992',
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
