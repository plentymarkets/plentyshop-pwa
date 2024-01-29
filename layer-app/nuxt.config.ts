// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: [
      "@storefront-ui/vue",
      "../apps/web",

  ],

  alias: {
      '~': "../apps/web",
  }
})
