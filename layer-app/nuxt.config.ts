// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';
// import Composables from "../composable-holder/src/module";

export default defineNuxtConfig({
  devtools: { enabled: true },

  extends: [
      "@storefront-ui/vue",
      "@vue-storefront/sdk",
      "../apps/web",
  ],

})
