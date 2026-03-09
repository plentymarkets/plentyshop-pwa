/**
 * Plugin to initialize and cache global page blocks (header container, footer) on app startup
 */
export default defineNuxtPlugin({
  name: 'global-blocks',
  parallel: false,
  async setup() {
    const { fetchHeaderContainerBlock, fetchFooterBlock } = useBlockTemplates();

    try {
      await Promise.all([fetchHeaderContainerBlock(), fetchFooterBlock()]);
    } catch (error) {
      console.warn('Failed to preload global blocks:', error);
    }
  },
});
