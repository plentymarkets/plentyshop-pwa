import type { FooterBlock, FooterContent } from '~/components/blocks/Footer/types';
import {
  FOOTER_BLOCK_NAME,
  isFooterBlock,
  createFooterBlock,
  createDefaultFooterBlock,
  mapFooterData,
  extractFooterContentFromBlocks,
  FOOTER_SWITCH_DEFINITIONS,
} from '~/utils/blockTemplates/footer/factory';

export const useFooterBlock = (locale?: string) => {
  const nuxtApp = useNuxtApp();
  const resolvedLocale = locale ?? nuxtApp.$i18n.locale.value;
  const { data, replaceBlock } = useBlockTemplates('index', 'immutable', resolvedLocale);

  const footerBlock = computed<FooterBlock | null>(
    () => (data.value.find(isFooterBlock) as FooterBlock | undefined) ?? null,
  );

  const resetFooterToSaved = async () => {
    try {
      const response = await useSdk().plentysystems.getBlocks({
        identifier: 'index',
        type: 'immutable',
        blocks: FOOTER_BLOCK_NAME,
      });

      const fetched = response?.data?.find(isFooterBlock) as FooterBlock | undefined;
      replaceBlock(isFooterBlock, fetched ? JSON.parse(JSON.stringify(fetched)) : createDefaultFooterBlock());
    } catch (error) {
      console.warn('Failed to reset footer to saved:', error);
      replaceBlock(isFooterBlock, createDefaultFooterBlock());
    }
  };

  return {
    footerBlock,
    resetFooterToSaved,
    createFooterBlock,
    createDefaultFooterBlock,
    mapFooterData,
    extractFooterContentFromBlocks,
    isFooterBlock,
    FOOTER_BLOCK_NAME,
    FOOTER_SWITCH_DEFINITIONS,
  };
};

export type { FooterBlock, FooterContent };
