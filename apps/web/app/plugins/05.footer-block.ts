/**
 * Plugin to initialize and cache footer block on app startup
 */
export default defineNuxtPlugin({
  name: 'footer-block',
  parallel: false,
  async setup() {
    const { fetchFooterBlock } = useBlockTemplates();

    try {
      await fetchFooterBlock();
    } catch (error) {
      console.warn('Failed to preload footer block:', error);
    }
  },
});
