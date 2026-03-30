/* eslint-disable max-lines */
import type {
  FetchCategoryTemplate,
  UseBlockTemplatesReturn,
  UseBlockTemplatesState,
  GetBlocks,
  SaveBlocks,
  ReplaceBlock,
} from './types';
import type { ApiError, Block } from '@plentymarkets/shop-api';
import type { TextCardContent } from '~/components/blocks/TextCard/types';
import type { BannerProps } from '~/components/blocks/Banner/types';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';
import type { FooterBlock } from '~/components/blocks/Footer/types';
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { HeaderBlock } from '~/components/blocks/Header/types';
import {
  HEADER_CONTAINER_BLOCK_NAME,
  isHeaderContainerBlock,
  createDefaultHeaderContainerBlock,
} from '~/utils/blockTemplates/header/factory';
import {
  FOOTER_BLOCK_NAME,
  isFooterBlock,
  createDefaultFooterBlock,
} from '~/utils/blockTemplates/footer/factory';

export { isFooterBlock } from '~/utils/blockTemplates/footer/factory';
export { isHeaderContainerBlock } from '~/utils/blockTemplates/header/factory';

const HEADER_BLOCK_NAME = 'Header' as const;

export const isHeaderBlock = (block: Block | null | undefined): block is HeaderBlock =>
  block?.name === HEADER_BLOCK_NAME;

export const isGlobalBlock = (block: Block | null | undefined): boolean =>
  isFooterBlock(block) || isHeaderContainerBlock(block);

export const useBlockTemplates: UseBlockTemplatesReturn = (
  identifier: string = 'unknown',
  type: string = 'unknown',
  locale: string = 'locale',
  blocks: string = 'all',
) => {
  const state = useState<UseBlockTemplatesState>(`useBlockTemplates-${identifier}-${type}-${locale}-${blocks}`, () => ({
    data: [],
    cleanData: [],
    categoryTemplateData: null,
    defaultTemplateData: [],
    loading: false,
  }));

  /** Replaces the first block in data that matches the predicate with a new block */
  const replaceBlock: ReplaceBlock = (predicate, newBlock) => {
    const index = state.value.data.findIndex(predicate);
    if (index !== -1) {
      state.value.data[index] = newBlock;
    }
  };

  const migrateAllBlocks = (blocks: Block[]) => {
    const blocksToMigrateTextContent = ['TextCard', 'Banner', 'ProductRecommendedProducts', 'NewsletterSubscribe'];
    const config = useRuntimeConfig().public;

    const firstTextContentBlock = (() => {
      let headerContainerBlock: Block = {} as Block;
      for (const block of blocks) {
        if (isHeaderContainerBlock(block)) headerContainerBlock = block;
        if (
          (Array.isArray(headerContainerBlock.content) && headerContainerBlock?.content.includes(block)) ||
          isHeaderBlock(block) ||
          isHeaderContainerBlock(block)
        )
          continue;
        if (blocksToMigrateTextContent.includes(block.name)) return block;
        if (Array.isArray(block.content)) {
          const firstChild = block.content.find((child) => blocksToMigrateTextContent.includes(child.name));
          if (firstChild) return firstChild;
        }
      }
      return undefined;
    })();

    const migrate = (blocks: Block[]) => {
      blocks.forEach((block) => {
        if (block.name === 'Image' && block.content) {
          block.content = migrateImageContent(block.content);
        }

        if (block.name === 'ProductRecommendedProducts' && block.content) {
          block.content = migrateRecommendedContent(block.content as OldContent | ProductRecommendedProductsContent);
        }

        if (blocksToMigrateTextContent.includes(block.name) && block.content) {
          const isFirstTextContentBlock = block === firstTextContentBlock;

          block.content = migrateTextCardContent(
            block.content as Partial<TextCardContent>,
            config.enableRichTextEditorV2,
            isFirstTextContentBlock,
          );
        }

        if (block.name === 'Banner' && block.content && config.enableRichTextEditorV2) {
          const content = (block as BannerProps).content;
          const textAlignment = content.text?.textAlignment;
          if (textAlignment && !content?.button?.alignment) {
            content.button = content.button ?? {};
            content.button.alignment = textAlignment;
          }
        }

        if (Array.isArray(block.content)) {
          migrate(block.content);
        }
      });
    };

    migrate(blocks);
  };

  /** Fetches blocks from server using useAsyncData with Nuxt caching */
  const getBlocksServer: GetBlocks = async (identifier, type, blocks?) => {
    state.value.loading = true;

    const { $i18n } = useNuxtApp();

    const { data, error } = await useAsyncData(`${$i18n.locale.value}-${type}-${identifier}-${blocks}`, () =>
      useSdk().plentysystems.getBlocks({ identifier, type, blocks }),
    );

    state.value.loading = false;

    if (error.value) {
      const { send } = useNotification();
      send({ type: 'negative', message: error.value.message });
      return;
    }

    setupBlocks(data?.value?.data ?? []);
  };

  /** Fetches blocks directly from SDK without Nuxt caching */
  const getBlocks: GetBlocks = async (identifier, type, blocks?) => {
    state.value.loading = true;

    const response = await useSdk().plentysystems.getBlocks({ identifier, type, blocks });
    const data = response?.data;

    state.value.loading = false;

    setupBlocks(data ?? []);
  };

  /**
   * Sets up blocks in state. Single gatekeeper for applying defaults.
   * Always derives header container and footer from fetched blocks; falls back to defaults if not found.
   */
  const setupBlocks = (fetchedBlocks: Block[]) => {
    if (!Array.isArray(fetchedBlocks)) {
      console.warn('Invalid blocks data received');
      return;
    }

    migrateAllBlocks(fetchedBlocks);

    // Extract header container and handle legacy flat header migration
    let headerContainerToUse = fetchedBlocks.find(isHeaderContainerBlock) as HeaderContainerBlock | undefined;

    if (headerContainerToUse && Array.isArray(headerContainerToUse.content) && headerContainerToUse.content.length === 0) {
      const flatHeader = fetchedBlocks.find(isHeaderBlock);
      if (flatHeader) headerContainerToUse = { ...headerContainerToUse, content: [flatHeader] } as HeaderContainerBlock;
    }

    const finalHeaderContainer =
      headerContainerToUse && Array.isArray(headerContainerToUse.content) && headerContainerToUse.content.length > 0
        ? headerContainerToUse
        : createDefaultHeaderContainerBlock();

    const fetchedFooter = fetchedBlocks.find(isFooterBlock) as FooterBlock | undefined;
    const finalFooter = fetchedFooter ?? createDefaultFooterBlock();

    const mainBlocks = fetchedBlocks.filter(
      (block) => !isHeaderContainerBlock(block) && !isFooterBlock(block) && !isHeaderBlock(block),
    );

    const blocksToUse =
      mainBlocks.length > 0
        ? mainBlocks
        : state.value.defaultTemplateData.filter((block) => !isFooterBlock(block) && !isHeaderContainerBlock(block));

    const finalBlocks = [finalHeaderContainer, ...blocksToUse, finalFooter];

    if (JSON.stringify(state.value.data) !== JSON.stringify(finalBlocks)) {
      state.value.data.splice(0, state.value.data.length, ...finalBlocks);
    }
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(finalBlocks)));
  };

  /** Updates the blocks in state with new block data */
  const updateBlocks: UpdateBlocks = (blocks) => {
    state.value.data = blocks;
  };

  /** Sets the default template data used when no blocks are fetched */
  const setDefaultTemplate = (blocks: Block[]) => {
    state.value.defaultTemplateData = blocks;
  };

  /**
   * @description Function for fetching the category template from a category id
   * @param categoryId
   * @return CategoryTemplate
   * @example
   * ``` ts
   * fetchCategoryTemplate({
   *    id: 16
   * })
   * ```
   */
  const fetchCategoryTemplate: FetchCategoryTemplate = async (categoryId) => {
    const { data } = await useAsyncData(`fetchCategoryTemplate-${categoryId}`, () =>
      useSdk().plentysystems.getCategoryTemplate({ id: categoryId }),
    );

    state.value.categoryTemplateData = data?.value?.data ?? state.value.categoryTemplateData;
  };

  /** Saves blocks to the server and updates state via setupBlocks */
  const saveBlocks: SaveBlocks = async (identifier: string | number, type: string, content: string) => {
    try {
      state.value.loading = true;

      const response = await useSdk().plentysystems.doSaveBlocks({
        identifier,
        entityType: type,
        blocks: content,
      });

      setupBlocks(response?.data ?? state.value.data);

      return true;
    } catch (error) {
      useHandleError(error as ApiError);
      console.error('Error saving blocks:', error);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    fetchCategoryTemplate,
    saveBlocks,
    getBlocks,
    getBlocksServer,
    updateBlocks,
    setupBlocks,
    setDefaultTemplate,
    replaceBlock,
    isFooterBlock,
    isHeaderContainerBlock,
    isHeaderBlock,
    isGlobalBlock,
    FOOTER_BLOCK_NAME,
    HEADER_CONTAINER_BLOCK_NAME,
    HEADER_BLOCK_NAME,
    data: computed(() => state.value.data),
    renderableBlocks: computed(() => state.value.data.filter((block) => !isHeaderContainerBlock(block))),
    cleanData: computed(() => state.value.cleanData),
    loading: computed(() => state.value.loading),
    categoryTemplateData: computed(() => state.value.categoryTemplateData),
    defaultTemplateData: computed(() => state.value.defaultTemplateData),
  };
};
