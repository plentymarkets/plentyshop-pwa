import type { FooterSettings } from '~/components/blocks/Footer/types';
import { createDefaultFooterSettings, extractFooterFromBlocks } from '~/utils/footerHelper';

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
    return footerCache.value || createDefaultFooterSettings();
  };

  const fetchFooterSettings = async (): Promise<FooterSettings> => {
    return getFooterSettings();
  };

  return {
    footerCache: readonly(footerCache),
    fetchFooterSettings,
    getFooterSettings,
    createDefaultFooterSettings,
    clearFooterCache,
    updateFooterCache,
    extractFooterFromBlocks,
  };
};
