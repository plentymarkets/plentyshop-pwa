/**
 * Plugin to initialize and cache global blocks (header/footer) on app startup
 * Fetches once and distributes to caches
 */
export default defineNuxtPlugin({
  name: 'global-blocks',
  parallel: true,
  async setup() {
    const { fetchGlobalBlocks } = useGlobalBlocks();

    try {
      await fetchGlobalBlocks();
    } catch (error) {
      console.warn('Failed to preload global blocks:', error);
    }
  },
});
