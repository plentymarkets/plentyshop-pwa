/**
 * Plugin to initialize global page blocks (header container, footer) on app startup.
 * Uses getBlocksServer to leverage Nuxt SSR caching on the initial load.
 */
export default defineNuxtPlugin({
  name: 'global-blocks',
  parallel: true,
  async setup() {
    const nuxtApp = useNuxtApp();
    const { getBlocksServer } = useBlockTemplates('index', 'immutable', nuxtApp.$i18n.locale.value);

    await getBlocksServer('index', 'immutable');
  },
});
