// https://nuxt.com/docs/api/configuration/nuxt-config
import { validateApiUrl } from './utils/pathHelper';
import cookieConfig from './configuration/cookie.config';
import { nuxtI18nOptions } from './configuration/i18n.config';
import { appConfiguration } from './configuration/app.config';
import { paths } from './utils/paths';
import { resolve } from 'pathe';

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
  vite: {
    server: {
      fs: {
        allow: ['../../..'], // relative to the current nuxt.config.ts
      },
      watch: {
        usePolling: process.env.NODE_ENV === 'development', // see apps/web/plugins/02.pwa-cookie.ts
      },
    },
    optimizeDeps: {
      include: ['dotenv', 'validator', 'js-sha256'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vuetify: ['vuetify', '@fortawesome/fontawesome-free'],
          },
        },
      },
    },
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
  image: {
    provider: 'none',
  },
  site: {
    url: '',
  },
  pages: true,
  runtimeConfig: {
    public: {
      domain: validateApiUrl(process.env.API_URL) ?? process.env.API_ENDPOINT,
      apiEndpoint: process.env.API_ENDPOINT,
      isDev: process.env.NODE_ENV === 'development',
      cookieGroups: cookieConfig,
      turnstileSiteKey: process.env?.TURNSTILESITEKEY ?? '',
      useAvif: process.env?.IMAGEAVIF === 'true' || process.env?.NUXT_PUBLIC_USE_AVIF === 'true',
      useWebp: process.env?.IMAGEWEBP === 'true' || process.env?.NUXT_PUBLIC_USE_WEBP === 'true',
      validateReturnReasons: process.env.VALIDATE_RETURN_REASONS === '1',
      enableQuickCheckoutTimer: process.env.ENABLE_QUICK_CHECKOUT_TIMER === '1',
      useTagsOnCategoryPage: process.env.USE_TAGS_ON_CATEGORY_PAGE === '1',
      isPreview: false,
      showConfigurationDrawer: process.env.SHOW_CONFIGURATION_DRAWER === '1',
      defaultItemsPerPage: Number(process.env.DEFAULT_FEEDBACK_ITEMS_PER_PAGE ?? 10),
      favicon: process.env.NUXT_PUBLIC_FAVICON || '/_nuxt-plenty/favicon.ico',
      ogTitle: process.env.NUXT_PUBLIC_OG_TITLE || process.env.OG_TITLE || 'PlentyONE Shop',
      ogImg: process.env.NUXT_PUBLIC_OG_IMG || process.env.OG_IMG || '/_nuxt-plenty/images/logo.svg',
      ogType: process.env.NUXT_PUBLIC_OG_TYPE || process.env.OG_TYPE || 'website',
      metaTitle: process.env.NUXT_PUBLIC_META_TITLE || process.env.METATITLE || 'PlentyONE Shop',
      metaDescription:
        process.env.NUXT_PUBLIC_META_DESCRIPTION || process.env.METADESC || 'Demo shop for PlentyONE Shop',
      metaKeywords: process.env.NUXT_PUBLIC_META_KEYWORDS || process.env.METAKEYWORDS || 'PlentyONE, plentyshop, pwa',
      robots: process.env.NUXT_PUBLIC_ROBOTS || 'all',
      robotsHomePage: process.env.NUXT_PUBLIC_ROBOTS_HOME_PAGE || 'all',
      robotsContactPage: process.env.NUXT_PUBLIC_ROBOTS_CONTACT_PAGE || 'all',
      robotsCancellationRights: process.env.NUXT_PUBLIC_ROBOTS_CANCELATION_RIGHTS || 'all',
      robotsCancellationForm: process.env.NUXT_PUBLIC_ROBOTS_CANCELATION_FORM || 'all',
      robotsLegalDisclosure: process.env.NUXT_PUBLIC_ROBOTS_LEGAL_DISCOLSURE || 'all',
      robotsPrivacyPolicy: process.env.NUXT_PUBLIC_ROBOTS_PRIVACY_POLICY || 'all',
      robotsTermsAndConditions: process.env.NUXT_PUBLIC_ROBOTS_TERMS_AND_CONDITIONS || 'all',
      robotsSearchResult: process.env.NUXT_PUBLIC_SEARCH_RESULT || 'all',
      robotsAccessibilityDeclarationResult: process.env.NUXT_PUBLIC_DECLARATION_RESULT || 'all',
      themeColor: process.env.NUXT_PUBLIC_PRIMARY_COLOR || '#062633',
      headerLogo:
        process.env.NUXT_PUBLIC_HEADER_LOGO ||
        process.env.LOGO ||
        'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Logo/logo.svg',
      homepageCategoryId: Number(process.env.HOMEPAGE) ?? null,
      shippingTextCategoryId: Number(process.env.SHIPPINGTEXT) ?? null,
      storename: process.env.STORENAME || 'PlentyONE GmbH',
      noCache: process.env.NO_CACHE || '',
      configId: process.env.CONFIG_ID || '',
      isHero: true,
      font: process.env.NUXT_PUBLIC_FONT || 'Red Hat Text',
      blockSize: process.env.NUXT_PUBLIC_BLOCK_SIZE || 'm',
      primaryColor: process.env.NUXT_PUBLIC_PRIMARY_COLOR || '#062633',
      defaultSortingOption: process.env.NUXT_PUBLIC_DEFAULT_SORTING_OPTION ?? 'texts.name1_asc',
      availableSortingOptions:
        process.env.NUXT_PUBLIC_AVAILABLE_SORTING_OPTIONS ||
        '["texts.name1_asc","default.recommended_sorting","sorting.price.avg_asc","sorting.price.avg_desc","variation.availability.averageDays_asc","variation.availability.averageDays_desc"]',
      recommendedFirstSortingOption:
        process.env.NUXT_PUBLIC_RECOMMENDED_FIRST_SORTING_OPTION ?? 'variation.position_desc',
      recommendedSecondSortingOption:
        process.env.NUXT_PUBLIC_RECOMMENDED_SECOND_SORTING_OPTION ?? 'sorting.price.avg_asc',
      recommendedThirdSortingOption:
        process.env.NUXT_PUBLIC_RECOMMENDED_THIRD_SORTING_OPTION ?? 'variation.availability.averageDays_asc',
      secondaryColor: process.env.NUXT_PUBLIC_SECONDARY_COLOR || '#31687d',
      headerBackgroundColor:
        process.env.NUXT_PUBLIC_HEADER_BACKGROUND_COLOR || process.env.NUXT_PUBLIC_PRIMARY_COLOR || '#062633',
      iconColor: process.env.NUXT_PUBLIC_ICON_COLOR || '#ffffff',
      showCustomerWishComponent: process.env?.SHOW_CUSTOMER_WISH_COMPONENT === '1',
      bundleItemDisplay: process.env.NUXT_PUBLIC_BUNDLE_ITEM_DISPLAY || '2',
      vatNumberValidation: process.env.NUXT_PUBLIC_VAT_NUMBER_VALIDATION || 'true',
      fetchDynamicTranslations: false,
    },
  },
  modules: [
    '@plentymarkets/shop-core',
    '@plentymarkets/shop-module-mollie',
    '@plentymarkets/shop-module-gtag',
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
    'vuetify-nuxt-module',
  ],
  vuetify: {
    moduleOptions: {
      disableVuetifyStyles: true,
    },
    vuetifyOptions: {
      icons: {
        defaultSet: 'fa',
      },
    },
  },
  shopCore: {
    apiUrl: validateApiUrl(process.env.API_URL) ?? 'http://localhost:8181',
  },
  shopModuleMollie: {
    checkoutUrl: paths.checkout,
    liveMode: !process.env.MOLLIE_TEST_MODE,
    confirmationUrl: paths.confirmation,
  },
  fonts: {
    defaults: {
      weights: [300, 400, 500, 700],
    },
    assets: {
      prefix: '/_nuxt-plenty/fonts/',
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
      name: 'PlentyONE Shop',
      short_name: 'PlentyONEShop',
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
  hooks: {
    'pages:extend'(pages) {
      if (process.env.E2E_TEST) {
        pages.push({
          name: 'e2e',
          path: '/smoke-e2e',
          file: resolve(__dirname, 'e2e/smoke-e2e.vue'),
        });
      }
    },
  },
});
