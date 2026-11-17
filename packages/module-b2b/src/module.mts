import { defineNuxtModule, createResolver, addPlugin, addComponentsDir, addImportsDir } from '@nuxt/kit';
import type {} from '@nuxtjs/i18n';
import type { SkuToCartPosition } from './runtime/types';

type TailwindContent = string[] | { files: string[] };

// Hook of @nuxtjs/tailwindcss, which is installed in the shop app and not in this package.
declare module '@nuxt/schema' {
  interface NuxtHooks {
    'tailwindcss:config': (config: { content?: TailwindContent }) => void;
  }
}

export interface SkuToCartOptions {
  /** Where the SKU form is shown in the cart, relative to the coupon field. */
  position: SkuToCartPosition;
}

export interface ModuleOptions {
  enabled: boolean;
  skuToCart: SkuToCartOptions;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    // Must match package.json "name" and runtime/extension.config.ts
    name: '@plentymarkets/b2b',
    configKey: 'plentymarketsB2b',
  },
  defaults: {
    enabled: true,
    skuToCart: { position: 'aboveCoupon' },
  },
  moduleDependencies: {
    '@nuxtjs/i18n': { version: '>=9.5.4' },
    '@plentymarkets/shop-core': { version: '>=1.50.0' },
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      return;
    }

    const resolver = createResolver(import.meta.url);

    // Default of the site setting. A saved value of the merchant takes precedence.
    nuxt.options.runtimeConfig.public.skuToCartPosition = options.skuToCart.position;

    // The component is rendered through the shop's injection areas, so it has to be registered globally.
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      global: true,
      // Settings panels are discovered by the shop's editor, not registered as components.
      ignore: ['settings/**'],
    });
    addImportsDir(resolver.resolve('./runtime/composables'));
    addPlugin(resolver.resolve('./runtime/plugins/sku-to-cart.plugin'));

    // Make Tailwind pick up the classes used in the extension's components.
    nuxt.hook('tailwindcss:config', (config) => {
      const content = Array.isArray(config.content) ? config.content : config.content?.files;
      content?.push(resolver.resolve('./runtime/**/*.{vue,mjs,ts}'));
    });

    nuxt.hook('i18n:registerModule', (register) => {
      register({
        langDir: resolver.resolve('./runtime/lang'),
        locales: [
          { code: 'en', file: 'en.json' },
          { code: 'de', file: 'de.json' },
        ],
      });
    });
  },
});
