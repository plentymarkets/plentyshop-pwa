/**
 * Plugin to initialize and cache global blocks (header/footer) on app startup
 * Fetches once from homepage and distributes to caches
 */
export default defineNuxtPlugin({
  name: 'global-blocks',
  parallel: true,
  async setup() {
    console.warn('🔌 [PLUGIN] Starting global-blocks plugin...');
    const { fetchGlobalBlocks, globalBlocksCache } = useGlobalBlocks();

    const cacheStateBefore = globalBlocksCache.value ? 'ALREADY CACHED' : 'EMPTY';
    console.warn(`🔌 [PLUGIN] Cache state before fetch: ${cacheStateBefore}`);

    try {
      await fetchGlobalBlocks();
      console.warn(
        '🔌 [PLUGIN] Global blocks plugin completed. Cache now has:',
        globalBlocksCache.value?.length ?? 0,
        'blocks',
      );
    } catch (error) {
      console.warn('🔌 [PLUGIN] Failed to preload global blocks:', error);
    }
  },
});
