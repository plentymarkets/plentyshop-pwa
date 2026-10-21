import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit';

export default defineNuxtModule({
  setup(_options, nuxt) {
    if (!process.env.E2E_TEST) return;

    const { resolve } = createResolver(import.meta.url);

    addServerHandler({
      middleware: true,
      handler: resolve('./runtime/e2e-config'),
    });

    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'e2e',
        path: '/smoke-e2e',
        file: resolve('./runtime/smoke-e2e.vue'),
        meta: {
          sitemap: false,
        },
      });
    });
  },
});
