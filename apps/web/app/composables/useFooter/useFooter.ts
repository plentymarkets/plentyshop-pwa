import type { FooterBlock } from '~/components/blocks/Footer/types';
import { createDefaultFooterBlock, extractFooterFromBlocks } from '~/utils/footerHelper';
import { callWithNuxt } from '#app';

/**
 * Composable for accessing global footer settings
 * Handles fetching and caching of footer configuration
 */
export const useFooter = () => {
  const footerCache = useState<FooterBlock>('footer-settings-cache', () => ({}) as FooterBlock);

  const clearFooterCache = () => {
    footerCache.value = {} as FooterBlock;
  };

  const updateFooterCache = (newFooterSettings: FooterBlock) => {
    footerCache.value = newFooterSettings;
  };

  const getFooterBlocks = (): FooterBlock => {
    return footerCache.value || createDefaultFooterBlock();
  };

  const fetchFooterBlocks = async (): Promise<FooterBlock> => {
    if (footerCache.value) {
      return footerCache.value;
    }

    const nuxtApp = useNuxtApp();

    return callWithNuxt(nuxtApp, async () => {
      try {
        const { data } = await useAsyncData(`footer-settings-${nuxtApp.$i18n.locale}`, () =>
          useSdk().plentysystems.getBlocks({
            identifier: 'index',
            type: 'immutable',
            blocks: 'Footer',
          }),
        );

        const footerBlock = data.value?.data?.find((block) => block.name === 'Footer') as FooterBlock;

        if (footerBlock?.content) {
          footerCache.value = footerBlock;
          return footerCache.value;
        }
      } catch (error) {
        console.warn('Failed to fetch footer blocks, using defaults:', error);
      }

      footerCache.value = getFooterBlocks();
      return footerCache.value;
    });
  };

  return {
    footerCache,
    fetchFooterBlocks,
    getFooterBlocks,
    createDefaultFooterBlock,
    clearFooterCache,
    updateFooterCache,
    extractFooterFromBlocks,
  };
};
