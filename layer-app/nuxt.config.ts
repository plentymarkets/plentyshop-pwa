// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';

export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: [
      "@storefront-ui/vue",
      "vue-tsc",
      "../apps/web",

  ],
    alias: {
        "~": path.resolve(__dirname, '../apps/web'),
        "@": path.resolve(__dirname, '../apps/web'),
    },
})
