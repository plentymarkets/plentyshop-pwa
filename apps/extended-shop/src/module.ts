import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  addComponentsDir,
  addImportsDir,
  installModule }
  from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    await installModule('@nuxtjs/i18n', {
      exposeConfig: true
    })

    addComponentsDir({
      path: resolver.resolve('../../web/components/')
    })

    addImportsDir(resolver.resolve('../../web/composables'))

    addImportsDir(resolver.resolve('../../web/utils'))

    addImportsDir(resolver.resolve('../../assets/style.scss'))

    addImports({
      name: "useWishlist",
      as: "useWishlist",
      from: resolver.resolve("../../web/composables/useWishlist")
    })

    addImports({
      name: "useLanguageSelect",
      as: "useLanguageSelect",
      from: resolver.resolve("../../web/composables/useLanguageSelect")
    })

    addPlugin(resolver.resolve('./runtime/plugin'))
  }
})
