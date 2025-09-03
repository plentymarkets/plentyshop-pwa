import type { FooterSettings } from '~/components/blocks/Footer/types';

/**
 * Simplified composable for footer block content
 * Handles content resolution with proper fallbacks
 */
export function useFooterBlock(content?: FooterSettings | null) {
  const { getFooterSettings, footerCache } = useFooterSettings();
  
  // If content is provided as prop, use it
  if (content) {
    return { 
      resolvedContent: ref(content), 
      cachedFooter: footerCache 
    };
  }

  // Otherwise use cached/default footer settings
  const resolvedContent = computed(() => getFooterSettings());

  return { 
    resolvedContent, 
    cachedFooter: footerCache 
  };
}
