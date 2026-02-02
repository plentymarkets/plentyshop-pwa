// https://nuxt.com/docs/api/configuration/nuxt-config
import { validateApiUrl } from './app/utils/pathHelper';
import { nuxtI18nOptions } from './app/configuration/i18n.config';
import { appConfiguration } from './app/configuration/app.config';
import cookieConfig from './app/configuration/cookie.config';
import { paths } from './app/utils/paths';
import { resolve } from 'pathe';
import settingsConfig from './app/configuration/settings.config';
import featureFlagsConfig from './app/configuration/feature-flags.config';

export default defineNuxtConfig({
  srcDir: 'app/',
  telemetry: false,
  devtools: { enabled: true },
  css: ['~/assets/richtext.css'],
  typescript: {
    typeCheck: true,
  },
  app: appConfiguration,
  experimental: {
    asyncContext: true,
  },
  appConfig: {
    titleSuffix: process.env.NAME || 'PlentyONE Shop',
    fallbackCurrency: 'GBP',
  },
  imports: {
    dirs: ['~/composables', '~/composables/**', '~/utils/**'],
  },
  vite: {
    server: {
      fs: {
        allow: ['../../..'], // relative to the current nuxt.config.ts
      },
      watch: {
        usePolling: process.env.NODE_ENV === 'development', // see apps/web/app/plugins/02.pwa-cookie.ts
      },
    },
    plugins: [
      {
        name: 'fail-on-large-chunks',
        generateBundle(_, bundle) {
          if (!process.env.CI) return;
          const LIMIT = 600 * 1024; // 600 KB
          for (const [fileName, chunk] of Object.entries(bundle)) {
            if (fileName === 'server.mjs') continue; // skip server bundle
            if (chunk.type === 'chunk' && chunk.code.length > LIMIT) {
              throw new Error(
                `❌ Chunk "${fileName}" is too large (${(chunk.code.length / 1024).toFixed(2)} KB). ` +
                  `Limit is ${LIMIT / 1024} KB.`,
              );
            }
          }
        },
      },
    ],
    optimizeDeps: {
      include: [
        '@floating-ui/vue',
        '@intlify/core-base',
        '@intlify/shared',
        '@paypal/paypal-js',
        '@plentymarkets/shop-api',
        '@plentymarkets/tailwind-colors',
        '@storefront-ui/shared',
        '@storefront-ui/vue',
        '@tanstack/vue-virtual',
        '@vee-validate/yup',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@vueuse/core',
        '@vueuse/shared',
        'cookie',
        'country-flag-icons/string/3x2',
        'dotenv',
        'drift-zoom',
        'js-sha256',
        'swiper/modules',
        'swiper/vue',
        'uuid',
        'vue-multiselect',
        'vue3-lazy-hydration',
        'vue-tel-input',
        'vuedraggable/src/vuedraggable',
        'yup',
      ],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            tiptap: [
              '@tiptap/vue-3',
              '@tiptap/core',
              '@tiptap/starter-kit',
              '@tiptap/extension-link',
              '@tiptap/extension-underline',
              '@tiptap/extension-text-style',
              '@tiptap/extension-color',
              '@tiptap/extension-highlight',
              '@tiptap/extension-text-align',
            ],
            vuetify: ['vuetify', '@mdi/js'],
            cmmain: ['codemirror'],
            cmplugins: [
              'js-beautify',
              '@codemirror/lang-css',
              '@codemirror/lang-javascript',
              '@codemirror/theme-one-dark',
            ],
          },
        },
      },
    },
  },
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
      activeLanguages: process.env.LANGUAGELIST || 'en,de',
      disabledEditorSettings: process.env?.ENABLE_ALL_EDITOR_SETTINGS === '1' ? [] : ['shop-search'],
      cookieGroups: cookieConfig,
      turnstileSiteKey: process.env?.CLOUDFLARETURNSTILEAPISITEKEY ?? '',
      noCache: process.env.NO_CACHE || '',
      configId: process.env.CONFIG_ID || '',
      ...settingsConfig,
      ...featureFlagsConfig,
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
        defaultSet: 'mdi-svg',
      },
    },
  },
  shopCore: {
    apiUrl: validateApiUrl(process.env.API_URL) ?? 'http://localhost:8181',
    apiEndpoint: process.env.API_ENDPOINT,
    configId: Number(process.env.CONFIG_ID) || 1,
  },
  shopModuleMollie: {
    checkoutUrl: paths.checkout,
    liveMode: !process.env.MOLLIE_TEST_MODE,
    confirmationUrl: paths.confirmation,
  },
  fonts: {
    defaults: {
      weights: [300, 400, 500, 700],
      preload: true,
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
    registerType: 'prompt',
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
          handler: 'NetworkFirst',
          options: {
            precacheFallback: {
              fallbackURL: '/offline',
            },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'plenty-image-cache',
            expiration: {
              maxEntries: 300,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
      cleanupOutdatedCaches: true,
    },
    manifest: {
      name: process.env.NUXT_PUBLIC_OG_TITLE || process.env.OG_TITLE || 'PlentyONE Shop',
      short_name: process.env.NUXT_PUBLIC_OG_TITLE || process.env.OG_TITLE || 'PlentyONE Shop',
      description: process.env.NUXT_PUBLIC_META_DESCRIPTION || process.env.METADESC || 'PlentyONE Shop',
      theme_color: process.env.NUXT_PUBLIC_PRIMARY_COLOR || '#062633',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: '/_nuxt-plenty/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/_nuxt-plenty/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/_nuxt-plenty/icons/icon-512x512.maskable.png',
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
