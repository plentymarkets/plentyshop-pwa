import type { Block } from '@plentymarkets/shop-api';
import { callWithNuxt } from '#app';
import type { FooterSettings } from '~/components/blocks/Footer/types';
import { createDefaultFooterSettings } from '~/utils/footerHelper';

export const useGlobalBlocks = () => {
  const globalBlocksCache = useState<Block[] | null>('global-blocks-cache', () => null);
  const isFetching = useState<boolean>('global-blocks-fetching', () => false);

  const fetchGlobalBlocks = async (): Promise<void> => {
    if (isFetching.value || globalBlocksCache.value) return;

    isFetching.value = true;
    const nuxtApp = useNuxtApp();

    return callWithNuxt(nuxtApp, async () => {
      try {
        const { data } = await useAsyncData(`global-blocks-${nuxtApp.$i18n.locale}`, () =>
          useSdk().plentysystems.getBlocks({
            identifier: 'index',
            type: 'immutable',
          }),
        );

        const allBlocks = data.value?.data ?? [];
        globalBlocksCache.value = allBlocks;

        distributeBlocks(allBlocks);
      } catch (error) {
        console.warn('Failed to fetch global blocks:', error);
        globalBlocksCache.value = [];
      } finally {
        isFetching.value = false;
      }
    });
  };

  const distributeBlocks = (blocks: Block[]) => {
    const { updateHeaderCache } = useHeader();
    const { updateFooterCache } = useFooter();

    const headerBlocks = blocks.filter((block) => block.name === 'Header');
    updateHeaderCache(headerBlocks);

    const footerBlock = blocks.find((block) => block.name === 'Footer');
    updateFooterCache((footerBlock?.content as FooterSettings) ?? createDefaultFooterSettings());
  };

  const clearGlobalBlocksCache = () => {
    globalBlocksCache.value = null;
    isFetching.value = false;
  };

  return {
    fetchGlobalBlocks,
    clearGlobalBlocksCache,
    globalBlocksCache: readonly(globalBlocksCache),
  };
};
