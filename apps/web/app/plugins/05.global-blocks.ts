/**
 * Plugin to initialize and cache global page blocks (header container, footer) on app startup
 */
export default defineNuxtPlugin({
  name: 'global-blocks',
  parallel: true,
  async setup() {
    const nuxtApp = useNuxtApp();
    const { fetchHeaderContainerBlock, fetchFooterBlock } = useBlockTemplates(
      'index',
      'immutable',
      nuxtApp.$i18n.locale.value,
    );

    try {
      await Promise.all([fetchHeaderContainerBlock(), fetchFooterBlock()]);
    } catch (error) {
      console.warn('Failed to preload global blocks:', error);
    }
  },
});
