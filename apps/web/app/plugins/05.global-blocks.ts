export default defineNuxtPlugin({
  name: 'global-blocks',
  parallel: true,
  async setup() {
    console.warn('[Plugin] Starting global blocks fetch');
    const { fetchGlobalBlocks } = useGlobalBlocks();

    try {
      await fetchGlobalBlocks();
      console.warn('[Plugin] Global blocks fetch completed');
    } catch (error) {
      console.warn('Failed to preload global blocks:', error);
    }
  },
});
