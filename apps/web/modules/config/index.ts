import { createResolver, defineNuxtModule, installModule } from 'nuxt/kit';

export interface ModuleOptions {
  priority: number;
  turnstileSiteKey: string;
  newsletterShowNames: boolean;
  useWebp: boolean;
  validateReturnReasons: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'config',
  },

  defaults: {
    priority: Number(process.env.CONFIG_PRIORITY) ?? 1,
    turnstileSiteKey: process.env.CLOUDFLARE_TURNSTILE_SITE_KEY ?? '0x4AAAAAAANx3aXDh7UR35x0',
    newsletterShowNames: Boolean(process.env.NEWSLETTER_FORM_SHOW_NAMES) ?? true,
    useWebp: Boolean(process.env.USE_WEBP) ?? false,
    validateReturnReasons: Boolean(process.env.VALIDATE_RETURN_REASONS) ?? false,
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    installModule('@nuxtjs/turnstile', {
      siteKey: options.turnstileSiteKey,
    });

    nuxt.options.runtimeConfig.public.newsletterFromShowNames = options.newsletterShowNames;
    nuxt.options.runtimeConfig.public.turnstileSiteKey = options.turnstileSiteKey;
    nuxt.options.runtimeConfig.public.useWebp = options.useWebp;
    nuxt.options.runtimeConfig.public.validateReturnReasons = options.validateReturnReasons;
  },
});
