import type { FooterSettings } from '~/components/blocks/Footer/types';

/**
 * Composable for footer block content
 * Handles content resolution with proper fallbacks
 */
export function useFooterBlock(content?: FooterSettings | null) {
  const { getFooterSettings, footerCache } = useFooterSettings();
  
  if (content) {
    return { 
      resolvedContent: ref(content), 
      cachedFooter: footerCache 
    };
  }

  const resolvedContent = computed(() => getFooterSettings());

  return { 
    resolvedContent, 
    cachedFooter: footerCache 
  };
}
