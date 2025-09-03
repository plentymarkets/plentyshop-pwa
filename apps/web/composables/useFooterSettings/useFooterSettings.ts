import type { FooterSettings } from '~/components/blocks/Footer/types';

// Centralized default footer settings factory
export function createDefaultFooterSettings(t: (key: string) => string): FooterSettings {
  return {
    meta: {
      uuid: '',
      isGlobalTemplate: true,
    },
    column1: { title: t('categories.legal.label') },
    column2: { title: t('categories.contact.label'), description: '', showContactLink: true },
    column3: { title: '', description: '' },
    column4: { title: '', description: '' },
    footnote: `© PlentyONE GmbH ${new Date().getFullYear()}`,
    footnoteAlign: 'right',
    colors: {
      background: '#cfe4ec',
      text: '#1c1c1c',
      footnoteBackground: '#161a16',
      footnoteText: '#959795',
    },
  };
}

// Convenience function that uses useI18n internally
export function getDefaultFooterSettings(): FooterSettings {
  const { t } = useI18n();
  return createDefaultFooterSettings(t);
}

/**
 * Simple composable for accessing global footer settings
 * Handles fetching and caching of footer configuration
 */
export function useFooterSettings() {
  const footerCache = useState<FooterSettings | null>('footer-settings-cache', () => null);

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

    // Fallback to defaults
    const defaults = getDefaultFooterSettings();
    footerCache.value = defaults;
    return defaults;
  };

  const getFooterSettings = (): FooterSettings => {
    return footerCache.value || getDefaultFooterSettings();
  };

  const clearFooterCache = () => {
    footerCache.value = null;
  };

  return {
    footerCache: readonly(footerCache),
    fetchFooterSettings,
    getFooterSettings,
    getDefaultFooterSettings,
    createDefaultFooterSettings,
    clearFooterCache,
  };
}
