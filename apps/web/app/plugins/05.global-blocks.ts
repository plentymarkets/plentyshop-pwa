/**
 * Plugin to initialize and cache global blocks (header/footer) on app startup
 * Fetches once and distributes to caches
 */
export default defineNuxtPlugin({
  name: 'global-blocks',
  parallel: true,
  async setup() {
    const { fetchGlobalBlocks, clearGlobalBlocksCache } = useGlobalBlocks();
    const { clearFooterCache } = useFooter();
    const { getCategoryTree } = useCategoryTree();
    const { $i18n } = useNuxtApp();

    try {
      await fetchGlobalBlocks();
    } catch (error) {
      console.warn('Failed to preload global blocks:', error);
    }

    watch(
      () => $i18n.locale.value,
      async () => {
        clearGlobalBlocksCache();
        clearFooterCache();

        try {
          await Promise.all([fetchGlobalBlocks(), getCategoryTree()]);
        } catch (error) {
          console.warn('Failed to refetch global blocks after locale change:', error);
        }
      },
    );
  },
});
