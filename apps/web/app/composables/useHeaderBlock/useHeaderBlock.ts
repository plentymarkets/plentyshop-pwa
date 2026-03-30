import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import {
  HEADER_CONTAINER_BLOCK_NAME,
  isHeaderContainerBlock,
  createHeaderContainerBlock,
  createDefaultHeaderContainerBlock,
} from '~/utils/blockTemplates/header/factory';

export const useHeaderBlock = (locale?: string) => {
  const nuxtApp = useNuxtApp();
  const resolvedLocale = locale ?? nuxtApp.$i18n.locale.value;
  const { data, replaceBlock } = useBlockTemplates('index', 'immutable', resolvedLocale);

  const headerContainerBlock = computed<HeaderContainerBlock | null>(
    () => (data.value.find(isHeaderContainerBlock) as HeaderContainerBlock | undefined) ?? null,
  );

  const resetHeaderToSaved = async () => {
    try {
      const response = await useSdk().plentysystems.getBlocks({
        identifier: 'index',
        type: 'immutable',
        blocks: HEADER_CONTAINER_BLOCK_NAME,
      });

      const headerBlock = response?.data?.find(isHeaderContainerBlock) as HeaderContainerBlock | undefined;
      const resolved =
        headerBlock && Array.isArray(headerBlock.content) && headerBlock.content.length > 0
          ? JSON.parse(JSON.stringify(headerBlock))
          : createDefaultHeaderContainerBlock();

      replaceBlock(isHeaderContainerBlock, resolved);
    } catch (error) {
      console.warn('Failed to reset header to saved:', error);
      replaceBlock(isHeaderContainerBlock, createDefaultHeaderContainerBlock());
    }
  };

  return {
    headerContainerBlock,
    resetHeaderToSaved,
    createHeaderContainerBlock,
    createDefaultHeaderContainerBlock,
    isHeaderContainerBlock,
    HEADER_CONTAINER_BLOCK_NAME,
  };
};

export type { HeaderContainerBlock };
