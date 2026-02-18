/**
 * Plugin to initialize and cache global blocks (header/footer) on app startup
 * Fetches once and distributes to caches
 * Refetches when locale changes
 */
export default defineNuxtPlugin({
  name: 'global-blocks',
  parallel: true,
  async setup() {
    const { fetchGlobalBlocks, clearGlobalBlocksCache } = useGlobalBlocks();
    const { $i18n } = useNuxtApp();

    try {
      await fetchGlobalBlocks();
    } catch (error) {
      console.warn('Failed to preload global blocks:', error);
    }

    watch(
      () => $i18n.locale.value,
      async () => {
        const { clearFooterCache } = useFooter();

        clearGlobalBlocksCache();
        clearFooterCache();

        try {
          await fetchGlobalBlocks();
        } catch (error) {
          console.warn('Failed to refetch global blocks after locale change:', error);
        }
      },
    );
  },
});
