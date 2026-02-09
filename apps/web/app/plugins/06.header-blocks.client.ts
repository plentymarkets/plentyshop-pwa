export default defineNuxtPlugin({
  name: 'header-blocks',
  parallel: true,
  async setup() {
    const { fetchHeaderBlocks } = useHeader();

    try {
      await fetchHeaderBlocks();
    } catch (error) {
      console.warn('Failed to preload header blocks:', error);
    }
  },
});
