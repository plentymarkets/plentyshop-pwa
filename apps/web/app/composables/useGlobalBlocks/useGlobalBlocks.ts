import { v4 as uuid } from 'uuid';
import type { Block } from '@plentymarkets/shop-api';
import { createDefaultFooterSettings } from '~/utils/footerHelper';
import type { FooterSettings } from '~/components/blocks/Footer/types';

/**
 * Composable for managing global header and footer blocks
 * Ensures header and footer are available across the application
 */
export const useGlobalBlocks = () => {
  const globalBlocksCache = useState<Block[] | null>('global-blocks-cache', () => null);
  const isFetching = useState<boolean>('global-blocks-fetching', () => false);

  /**
   * Fetches global blocks once from homepage and distributes to header/footer caches
   * Guards prevent duplicate fetches
   */
  const fetchGlobalBlocks = async (): Promise<void> => {
    console.warn(
      '📦 [FETCH] fetchGlobalBlocks called. isFetching:',
      isFetching.value,
      'cacheExists:',
      !!globalBlocksCache.value,
    );

    if (isFetching.value) {
      console.warn('📦 [FETCH] ⏸️  Already fetching, skipping duplicate call');
      return;
    }

    if (globalBlocksCache.value) {
      console.warn(
        '📦 [FETCH] ✅ Cache already populated with',
        globalBlocksCache.value.length,
        'blocks, skipping fetch',
      );
      return;
    }

    console.warn('📦 [FETCH] 🚀 Starting fresh fetch from API...');
    isFetching.value = true;

    try {
      const { $i18n } = useNuxtApp();
      const { data } = await useAsyncData(`global-blocks-${$i18n.locale.value}`, () =>
        useSdk().plentysystems.getBlocks({
          identifier: 'index',
          type: 'immutable',
        }),
      );

      const allBlocks = data.value?.data ?? [];
      globalBlocksCache.value = allBlocks;

      console.warn(
        '📦 [FETCH] ✅ Fetched and cached',
        allBlocks.length,
        'blocks:',
        allBlocks.map((b) => b.name),
      );

      // Distribute to caches
      const { updateFooterCache } = useFooter();
      const footerBlocks = allBlocks.filter((block) => block.name === 'Footer');
      if (footerBlocks.length > 0) {
        updateFooterCache((footerBlocks[0]?.content as FooterSettings) ?? createDefaultFooterSettings());
        console.warn('📦 [FETCH] Updated footer cache');
      }
    } catch (error) {
      console.warn('📦 [FETCH] ❌ Failed to fetch global blocks:', error);
      globalBlocksCache.value = [];
    } finally {
      isFetching.value = false;
    }
  };

  const clearGlobalBlocksCache = () => {
    globalBlocksCache.value = null;
    isFetching.value = false;
  };

  const injectGlobalHeader = async (blocks: Block[]): Promise<Block[]> => {
    const hasHeader = blocks.some((block) => block.name === 'Header');
    if (hasHeader) {
      console.warn('🎯 [HEADER] Header already exists in blocks, skipping injection');
      return blocks;
    }

    console.warn('🎯 [HEADER] No header in blocks, checking cache...');

    // Get header from global cache (already fetched by plugin)
    if (!globalBlocksCache.value) {
      console.warn('🎯 [HEADER] ⚠️  Cache EMPTY! Fetching as fallback (plugin may not have run yet)...');
      await fetchGlobalBlocks();
    } else {
      console.warn('🎯 [HEADER] ✅ Using cached data (', globalBlocksCache.value.length, 'blocks in cache)');
    }

    const headerBlocks = globalBlocksCache.value?.filter((block) => block.name === 'Header') ?? [];
    console.warn('🎯 [HEADER] Found', headerBlocks.length, 'header block(s) in cache');

    if (headerBlocks.length > 0) {
      console.warn('🎯 [HEADER] ✅ Injecting cached header block(s)');
      return [...headerBlocks, ...blocks];
    }

    // No header in backend data - let layout's fallback <UiHeader /> render
    console.warn('🎯 [HEADER] ℹ️  No header blocks in backend, letting layout fallback handle it');
    return blocks;
  };

  const injectGlobalFooter = async (blocks: Block[]): Promise<Block[]> => {
    const hasFooter = blocks.some((block) => block.name === 'Footer');
    if (hasFooter) {
      console.warn('👣 [FOOTER] Footer already exists in blocks, skipping injection');
      return blocks;
    }

    console.warn('👣 [FOOTER] No footer in blocks, checking cache...');
    const { footerCache, fetchFooterSettings } = useFooter();

    // Fetch footer settings if not already cached (fallback if plugin didn't run)
    if (!footerCache.value) {
      console.warn('👣 [FOOTER] ⚠️  Footer cache EMPTY! Fetching as fallback...');
      await fetchFooterSettings();
    } else {
      console.warn('👣 [FOOTER] ✅ Using cached footer settings');
    }

    const footerContent = footerCache.value || createDefaultFooterSettings();
    console.warn('👣 [FOOTER] ✅ Injecting footer block');

    const footerBlock: Block = {
      name: 'Footer',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: true,
      },
      content: footerContent,
    };

    return [...blocks, footerBlock];
  };

  const ensureAllGlobalBlocks = async (blocks: Block[]): Promise<Block[]> => {
    console.warn(
      '🎨 [ENSURE] ensureAllGlobalBlocks called with',
      blocks.length,
      'blocks:',
      blocks.map((b) => b.name),
    );

    let result = await injectGlobalHeader(blocks);
    result = await injectGlobalFooter(result);

    console.warn(
      '🎨 [ENSURE] ✅ Final blocks after injection:',
      result.length,
      'blocks:',
      result.map((b) => b.name),
    );
    return result;
  };

  return {
    fetchGlobalBlocks,
    clearGlobalBlocksCache,
    injectGlobalHeader,
    injectGlobalFooter,
    ensureAllGlobalBlocks,
    globalBlocksCache: readonly(globalBlocksCache),
  };
};
