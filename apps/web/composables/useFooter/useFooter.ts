import type { FooterSettings } from '~/components/blocks/Footer/types';
import { getDefaultFooterSettings, extractFooterFromBlocks, addFooterBlock } from '~/utils/footerHelper';

/**
 * Composable for accessing global footer settings
 * Handles fetching and caching of footer configuration
 */
export const useFooter = () => {
  const footerCache = useState<FooterSettings | null>('footer-settings-cache', () => null);

  const clearFooterCache = () => {
    footerCache.value = null;
  };

  const updateFooterCache = (newFooterSettings: FooterSettings) => {
    footerCache.value = newFooterSettings;
  };

  const getFooterSettings = (): FooterSettings => {
    return footerCache.value || getDefaultFooterSettings();
  };

  const fetchFooterSettings = async (): Promise<FooterSettings> => {
    if (footerCache.value) {
      return footerCache.value;
    }

    try {
      const { data } = await useAsyncData('footer-settings', () =>
        useSdk().plentysystems.getBlocks({
          identifier: 'index',
          type: 'immutable',
          blocks: 'Footer',
        }),
      );

      const footerBlock = data.value?.data?.find((block) => block.name === 'Footer');

      if (footerBlock?.content) {
        footerCache.value = footerBlock.content as FooterSettings;
        return footerCache.value;
      }
    } catch (error) {
      console.warn('Failed to fetch footer settings, using defaults:', error);
    }

    footerCache.value = getFooterSettings();
    return footerCache.value;
  };

  return {
    footerCache: readonly(footerCache),
    fetchFooterSettings,
    getFooterSettings,
    getDefaultFooterSettings,
    clearFooterCache,
    updateFooterCache,
    extractFooterFromBlocks,
    addFooterBlock,
  };
};
