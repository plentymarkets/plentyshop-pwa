// https://nuxt.com/docs/api/configuration/nuxt-config
import { validateApiUrl } from './utils/pathHelper';
import cookieConfig from './cookie.config';
import { nuxtI18nOptions } from './i18n.config';
import fetchConfiguration from './build/fetchConfiguration';

export default defineNuxtConfig({
  telemetry: false,
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
        { name: 'title', content: process.env.METATITLE || 'plentyShop PWA Demo' },
        { name: 'shop-name', content: 'plentyShop PWA Demo' },
        { name: 'description', content: process.env.METADESC || 'Demo shop for plentyShop PWA' },
        { name: 'keywords', content: process.env.METAKEYWORDS || 'plentysystems, plentyshop, pwa' },
        { name: 'theme-color', content: '#0C7992' },
        { property: 'og:title', content: process.env.OGTITLE || '' },
        { property: 'og:image', content: process.env.OGIMAGE || '' },
        { property: 'og:type', content: process.env.OGTYPE || 'website' },
        { property: 'og:url', content: process.env.OGURL || 'plentyshop.plentymarkets.com' },
        { property: 'og:site_name', content: process.env.OGSITENAME || 'plentyShop PWA Demo' },
        { property: 'og:description', content: process.env.OGDESCRIPTION || 'Demo shop for plentyShop PWA' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
      ],
    },
  },
  experimental: {
    asyncContext: true,
  },
  appConfig: {
    titleSuffix: 'plentyshop PWA',
    fallbackCurrency: 'GBP',
  },
  imports: {
    dirs: ['composables', 'composables/**', 'utils/**'],
  },
  css: ['~/assets/style.scss'],
  // eslint-disable-next-line unicorn/expiring-todo-comments
  // TODO: build is consistently failing because of this. check whether we need pre-render check.
  nitro: {
    prerender: {
      crawlLinks: false,
    },
    compressPublicAssets: true,
  },
  routeRules: {
    '/_ipx/**': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
    '/icons/**': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
    '/favicon.ico': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
  },
  site: {
    url: '',
  },
  pages: true,
  hooks: {
    'build:before': async () => await fetchConfiguration(),
  },
  runtimeConfig: {
    public: {
      domain: validateApiUrl(process.env.API_URL) ?? process.env.API_ENDPOINT,
      apiEndpoint: process.env.API_ENDPOINT,
      cookieGroups: cookieConfig,
      showNetPrices: true,
      turnstileSiteKey: process.env?.CLOUDFLARE_TURNSTILE_SITE_KEY ?? '',
      newsletterFromShowNames: process.env?.NEWSLETTER_FORM_SHOW_NAMES === '1' ?? false,
      useAvif: process.env?.USE_AVIF === '1' ?? false,
      useWebp: process.env?.USE_WEBP === '1' ?? false,
      validateReturnReasons: process.env.VALIDATE_RETURN_REASONS === '1' ?? false,
      enableQuickCheckoutTimer: process.env.ENABLE_QUICK_CHECKOUT_TIMER === '1' ?? false,
      showConfigurationDrawer: process.env.SHOW_CONFIGURATION_DRAWER === '1' ?? false,
    },
  },
  modules: [
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@nuxtjs/google-fonts',
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
  googleFonts: {
    families: {
      'Red Hat Display': { wght: [400, 500, 700] },
      'Red Hat Text': { wght: [300, 400, 500, 700] },
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
          '/thank-you',
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
    configPath: '~/tailwind.config.ts',
  },
  turnstile: {
    siteKey: process.env?.CLOUDFLARE_TURNSTILE_SITE_KEY,
  },
  viewport: {
    breakpoints: {
      sm: 640,
      md: 640,
      lg: 1024,
    },
    defaultBreakpoints: {
      mobile: 'sm',
      tablet: 'md',
      desktop: 'lg',
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
    autoImports: true,
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
          // @ts-ignore
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
