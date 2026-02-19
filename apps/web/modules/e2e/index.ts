import { defineNuxtModule, addServerHandler } from '@nuxt/kit';
import { resolve } from 'pathe';

export default defineNuxtModule({
  setup(_options, nuxt) {
    if (!process.env.E2E_TEST) return;

    addServerHandler({
      middleware: true,
      handler: resolve(__dirname, './runtime/e2e-config'),
    });

    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'e2e',
        path: '/smoke-e2e',
        file: resolve(__dirname, './runtime/smoke-e2e.vue'),
      });
    });
  },
});
