/* eslint-disable max-lines */
import type {
  FetchCategoryTemplate,
  UseBlockTemplatesReturn,
  UseBlockTemplatesState,
  GetBlocks,
  SaveBlocks,
} from './types';
import type { ApiError, Block } from '@plentymarkets/shop-api';
import type { FooterContent, FooterSwitchDefinition, FooterBlock } from '~/components/blocks/Footer/types';
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { HeaderBlock } from '~/components/blocks/Header/types';
import {
  HEADER_CONTAINER_BLOCK_NAME,
  isHeaderContainerBlock,
  createHeaderContainerBlock,
  createDefaultHeaderContainerBlock,
} from '~/utils/blockTemplates/header/factory';
import { createDefaultFooterContent } from '~/utils/blockTemplates/footer/factory';
import { migrateAllBlocks } from '~/utils/migrate-blocks';
import { v4 as uuid } from 'uuid';
import { callWithNuxt } from '#app';

const FOOTER_BLOCK_NAME = 'Footer' as const;
const HEADER_BLOCK_NAME = 'Header' as const;

const FOOTER_SWITCH_DEFINITIONS: FooterSwitchDefinition[] = [
  {
    columnGroup: 'legal',
    key: 'showTermsAndConditions',
    shopTranslationKey: 'legal.termsAndConditions',
    editorTranslationKey: 'column-1-terms-and-conditions-label',
    link: paths.termsAndConditions,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationRights',
    shopTranslationKey: 'legal.cancellationRights',
    editorTranslationKey: 'column-1-cancellation-rights-label',
    link: paths.cancellationRights,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationForm',
    shopTranslationKey: 'legal.cancellationForm',
    editorTranslationKey: 'column-1-cancellation-form-label',
    link: paths.cancellationForm,
  },
  {
    columnGroup: 'legal',
    key: 'showLegalDisclosure',
    shopTranslationKey: 'legal.legalDisclosure',
    editorTranslationKey: 'column-1-legal-disclosure-label',
    link: paths.legalDisclosure,
  },
  {
    columnGroup: 'legal',
    key: 'showPrivacyPolicy',
    shopTranslationKey: 'legal.privacyPolicy',
    editorTranslationKey: 'column-1-privacy-policy-label',
    link: paths.privacyPolicy,
  },
  {
    columnGroup: 'legal',
    key: 'showDeclarationOfAccessibility',
    shopTranslationKey: 'legal.declarationOfAccessibility',
    editorTranslationKey: 'column-1-declaration-of-accessibility-label',
    link: paths.declarationOfAccessibility,
  },
  {
    columnGroup: 'services',
    key: 'showContactLink',
    shopTranslationKey: 'footer.contact.label',
    editorTranslationKey: 'column-2-contact-label',
    link: paths.contact,
  },
  {
    columnGroup: 'services',
    key: 'showRegisterLink',
    shopTranslationKey: 'footer.register.label',
    editorTranslationKey: 'column-2-register-label',
    link: paths.register,
  },
];

export const isFooterBlock = (block: Block | null | undefined): block is FooterBlock => {
  return block?.name === FOOTER_BLOCK_NAME;
};

export const isHeaderBlock = (block: Block | null | undefined): block is HeaderBlock => {
  return block?.name === HEADER_BLOCK_NAME;
};

/**
 * Check if a block is global (i.e., a system/global block like Footer or HeaderContainer)
 * @param block - The block to check
 * @returns true if the block is global, false if it's a regular/persistent block
 */
export const isGlobalBlock = (block: Block | null | undefined): boolean => {
  return isFooterBlock(block) || isHeaderContainerBlock(block);
};


export const useBlockTemplates: UseBlockTemplatesReturn = (
  identifier: string = 'unknown',
  type: string = 'unknown',
  locale: string = 'locale',
  blocks: string = 'all',
) => {
  const nuxtApp = useNuxtApp();

  const state = useState<UseBlockTemplatesState>(`useBlockTemplates-${identifier}-${type}-${locale}-${blocks}`, () => ({
    data: [],
    cleanData: [],
    categoryTemplateData: null,
    defaultTemplateData: [],
    loading: false,
  }));

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

  /** Saves blocks to the server and updates footer/header caches if those blocks are included */
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
    fetchFooterBlock,
    resetFooterToSaved,
    getFooterBlock,
    createDefaultFooterBlock,
    createFooterBlock,
    clearFooterCache,
    updateFooterCache,
    extractFooterContentFromBlocks,
    mapFooterData,
    isFooterBlock,
    FOOTER_BLOCK_NAME,
    FOOTER_SWITCH_DEFINITIONS,
    footerCache: readonly(footerCache),
    headerContainerCache,
    resetHeaderToSaved,
    fetchHeaderContainerBlock,
    fetchGlobalBlocks,
    getHeaderContainerBlock,
    createHeaderContainerBlock,
    createDefaultHeaderContainerBlock,
    clearHeaderContainerCache,
    updateHeaderContainerCache,
    isHeaderContainerBlock,
    HEADER_CONTAINER_BLOCK_NAME,
    isHeaderBlock,
    HEADER_BLOCK_NAME,
    data: computed(() => state.value.data),
    renderableBlocks: computed(() => state.value.data.filter((block) => !isHeaderContainerBlock(block))),
    cleanData: computed(() => state.value.cleanData),
    loading: computed(() => state.value.loading),
    categoryTemplateData: computed(() => state.value.categoryTemplateData),
    defaultTemplateData: computed(() => state.value.defaultTemplateData),
  };
};
