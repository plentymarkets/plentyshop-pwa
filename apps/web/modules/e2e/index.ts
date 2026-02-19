import { defineNuxtModule, addServerHandler } from '@nuxt/kit';
import { resolve } from 'pathe';

export default defineNuxtModule({
  setup() {
    if (!process.env.E2E_TEST) return;

    addServerHandler({
      middleware: true,
      handler: resolve(__dirname, './runtime/e2e-config'),
    });
  },
});
