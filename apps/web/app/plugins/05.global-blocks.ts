/**
 * Plugin to initialize and cache global page blocks (header container, footer) on app startup
 */
export default defineNuxtPlugin({
  name: 'global-blocks',
  parallel: true,
  async setup() {
    const nuxtApp = useNuxtApp();
    const { fetchGlobalBlocks } = useBlockTemplates('index', 'immutable', nuxtApp.$i18n.locale.value);

    await fetchGlobalBlocks();
  },
});
