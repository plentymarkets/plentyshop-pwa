/* eslint-disable max-lines */
import type {
  FetchCategoryTemplate,
  UseBlockTemplatesReturn,
  UseBlockTemplatesState,
  GetBlocks,
  SaveBlocks,
} from './types';
import type { ApiError, Block } from '@plentymarkets/shop-api';
import type { TextCardContent } from '~/components/blocks/TextCard/types';
import type { BannerProps } from '~/components/blocks/Banner/types';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';
import type { FooterContent, FooterSwitchDefinition, FooterBlock } from '~/components/blocks/Footer/types';
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { HeaderBlock } from '~/components/blocks/Header/types';
import {
  HEADER_CONTAINER_BLOCK_NAME,
  isHeaderContainerBlock,
  createHeaderContainerBlock,
  createDefaultHeaderContainerBlock,
} from '~/utils/blockTemplates/header/factory';
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

const createDefaultFooterContent = (): FooterContent => {
  const runtimeConfig = useRuntimeConfig();

  return {
    column1: {
      title: t('footer.legal.label'),
      showTermsAndConditions: true,
      showCancellationRights: true,
      showCancellationForm: true,
      showLegalDisclosure: true,
      showPrivacyPolicy: true,
      showDeclarationOfAccessibility: true,
    },
    column2: {
      title: t('footer.services.label'),
      description: '',
      showContactLink: true,
      showRegisterLink: true,
    },
    column3: { title: '', description: '' },
    column4: { title: '', description: '' },
    footnote: `© ${runtimeConfig.public.storename} ${new Date().getFullYear()}`,
    footnoteAlign: 'right',
    colors: {
      background: '#cfe4ec',
      text: '#1c1c1c',
      footnoteBackground: '#161a16',
      footnoteText: '#959795',
    },
  };
};

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

const createFooterBlockHelper = (
  content: FooterContent,
  meta?: { uuid?: string; isGlobalTemplate?: boolean },
): FooterBlock => {
  return {
    name: FOOTER_BLOCK_NAME,
    type: 'content',
    meta: {
      uuid: meta?.uuid || uuid(),
      isGlobalTemplate: meta?.isGlobalTemplate ?? true,
    },
    content,
  };
};

const createDefaultFooterBlockHelper = (): FooterBlock => createFooterBlockHelper(createDefaultFooterContent());

const extractFooterContentFromBlocksHelper = (content: string): FooterContent | null => {
  try {
    const blocks = JSON.parse(content);
    const footerBlock = Array.isArray(blocks) ? blocks.find((block: Block) => isFooterBlock(block)) : null;

    return footerBlock?.content || null;
  } catch (error) {
    console.warn('Failed to extract footer from blocks:', error);
    return null;
  }
};

const mapFooterDataHelper = (data: Block | null): FooterBlock => {
  if (!data) return createDefaultFooterBlockHelper();

  const defaultContent = createDefaultFooterContent();
  const dataContent = data.content as FooterContent | undefined;

  return createFooterBlockHelper(
    {
      ...defaultContent,
      ...dataContent,
      column1: {
        ...defaultContent.column1,
        ...dataContent?.column1,
      },
      column2: {
        ...defaultContent.column2,
        ...dataContent?.column2,
      },
      column3: {
        ...defaultContent.column3,
        ...dataContent?.column3,
      },
      column4: {
        ...defaultContent.column4,
        ...dataContent?.column4,
      },
      colors: {
        ...defaultContent.colors,
        ...dataContent?.colors,
      },
    },
    {
      uuid: data.meta?.uuid,
      isGlobalTemplate: data.meta?.isGlobalTemplate,
    },
  );
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

  const footerCache = useState<FooterBlock | null>(`footer-block-cache-${nuxtApp.$i18n.locale.value}`, () => null);

  const headerContainerCache = useState<HeaderContainerBlock | null>(
    `header-container-cache-${nuxtApp.$i18n.locale.value}`,
    () => null,
  );

  /** Clears the cached footer block, forcing a fresh fetch on next access */
  const clearFooterCache = () => (footerCache.value = null);

  /** Updates the cached footer block with a new footer configuration */
  const updateFooterCache = (newFooterBlock: FooterBlock) => (footerCache.value = newFooterBlock);

  /** Returns the cached footer block or creates a default one if cache is empty */
  const getFooterBlock = (): FooterBlock => footerCache.value || createDefaultFooterBlockHelper();

  const clearHeaderContainerCache = () => (headerContainerCache.value = null);
  const updateHeaderContainerCache = (block: HeaderContainerBlock) => (headerContainerCache.value = block);
  const getHeaderContainerBlock = (): HeaderContainerBlock =>
    headerContainerCache.value || createDefaultHeaderContainerBlock();

  const createFooterBlock = createFooterBlockHelper;
  const createDefaultFooterBlock = createDefaultFooterBlockHelper;
  const extractFooterContentFromBlocks = extractFooterContentFromBlocksHelper;
  const mapFooterData = mapFooterDataHelper;

  /** Resets the footer block in data to the saved/cached state, discarding unsaved changes */
  const resetFooterToSaved = async () => {
    footerCache.value = null;
    await fetchFooterBlock();

    const footerIndex = state.value.data.findIndex((block) => isFooterBlock(block));
    if (footerIndex !== -1 && footerCache.value) {
      state.value.data[footerIndex] = JSON.parse(JSON.stringify(footerCache.value));
    }
  };

  const resetHeaderToSaved = async () => {
    headerContainerCache.value = null;

    try {
      const response = await useSdk().plentysystems.getBlocks({
        identifier: 'index',
        type: 'immutable',
        blocks: HEADER_CONTAINER_BLOCK_NAME,
      });

      const headerBlock = response?.data?.find((block) => isHeaderContainerBlock(block)) as
        | HeaderContainerBlock
        | undefined;

      if (headerBlock && Array.isArray(headerBlock.content) && headerBlock.content.length > 0) {
        headerContainerCache.value = headerBlock;
      } else {
        headerContainerCache.value = createDefaultHeaderContainerBlock();
      }
    } catch (error) {
      console.warn('Failed to reset header to saved:', error);
      headerContainerCache.value = createDefaultHeaderContainerBlock();
    }

    const headerIndex = state.value.data.findIndex((block) => isHeaderContainerBlock(block));
    if (headerIndex !== -1 && headerContainerCache.value) {
      state.value.data[headerIndex] = JSON.parse(JSON.stringify(headerContainerCache.value));
    }
  };

  /** Fetches the footer block from the server or returns cached version */
  const fetchFooterBlock = async (): Promise<FooterBlock> => {
    if (footerCache.value) return footerCache.value;

    return callWithNuxt(nuxtApp, async () => {
      try {
        const { data } = await useAsyncData(`footer-block-${nuxtApp.$i18n.locale.value}`, () =>
          useSdk().plentysystems.getBlocks({
            identifier: 'index',
            type: 'immutable',
            blocks: FOOTER_BLOCK_NAME,
          }),
        );

        const footerBlock = data.value?.data?.find((block) => isFooterBlock(block));

        if (footerBlock) {
          footerCache.value = footerBlock as FooterBlock;
          return footerCache.value;
        }
      } catch (error) {
        console.warn('Failed to fetch footer block, using defaults:', error);
      }

      footerCache.value = getFooterBlock();
      return footerCache.value;
    });
  };

  const fetchHeaderContainerBlock = async (force = false): Promise<HeaderContainerBlock> => {
    if (!force && headerContainerCache.value) return headerContainerCache.value;

    return callWithNuxt(nuxtApp, async () => {
      try {
        const { data } = await useAsyncData(`header-container-block-${nuxtApp.$i18n.locale.value}`, () =>
          useSdk().plentysystems.getBlocks({
            identifier: 'index',
            type: 'immutable',
          }),
        );

        const allBlocks = data.value?.data ?? [];
        const headerBlock = allBlocks.find((block) => isHeaderContainerBlock(block));

        let resolvedHeaderBlock = headerBlock;
        if (headerBlock && Array.isArray(headerBlock.content) && headerBlock.content.length === 0) {
          const flatHeader = allBlocks.find((block) => isHeaderBlock(block));
          if (flatHeader) resolvedHeaderBlock = { ...headerBlock, content: [flatHeader] };
        }

        if (
          resolvedHeaderBlock &&
          Array.isArray(resolvedHeaderBlock.content) &&
          resolvedHeaderBlock.content.length > 0
        ) {
          headerContainerCache.value = resolvedHeaderBlock;
          return headerContainerCache.value;
        }
      } catch (error) {
        console.warn('Failed to fetch header container block, using defaults:', error);
      }

      headerContainerCache.value = getHeaderContainerBlock();
      return headerContainerCache.value;
    });
  };

  const fetchGlobalBlocks = async (): Promise<void> => {
    if (footerCache.value && headerContainerCache.value) return;

    await callWithNuxt(nuxtApp, async () => {
      try {
        const { data } = await useAsyncData(`global-blocks-${nuxtApp.$i18n.locale.value}`, () =>
          useSdk().plentysystems.getBlocks({ identifier: 'index', type: 'immutable' }),
        );

        const allBlocks = data.value?.data ?? [];

        if (!footerCache.value) {
          const footerBlock = allBlocks.find((block) => isFooterBlock(block));
          footerCache.value = footerBlock ? (footerBlock as FooterBlock) : createDefaultFooterBlockHelper();
        }

        if (!headerContainerCache.value) {
          const headerBlock = allBlocks.find((block) => isHeaderContainerBlock(block));
          let resolvedHeaderBlock = headerBlock;
          if (headerBlock && Array.isArray(headerBlock.content) && headerBlock.content.length === 0) {
            const flatHeader = allBlocks.find((block) => isHeaderBlock(block));
            if (flatHeader) resolvedHeaderBlock = { ...headerBlock, content: [flatHeader] };
          }
          headerContainerCache.value =
            resolvedHeaderBlock && Array.isArray(resolvedHeaderBlock.content) && resolvedHeaderBlock.content.length > 0
              ? resolvedHeaderBlock
              : getHeaderContainerBlock();
        }
      } catch (error) {
        console.warn('Failed to preload global blocks, using defaults:', error);
        if (!footerCache.value) footerCache.value = createDefaultFooterBlockHelper();
        if (!headerContainerCache.value) headerContainerCache.value = getHeaderContainerBlock();
      }
    });
  };

  const migrateAllBlocks = (blocks: Block[]) => {
    const blocksToMigrateTextContent = ['TextCard', 'Banner', 'ProductRecommendedProducts', 'NewsletterSubscribe'];

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

          block.content = migrateTextCardContent(block.content as Partial<TextCardContent>, isFirstTextContentBlock);
        }

        if (block.name === 'Banner' && block.content) {
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

  /** Sets up blocks in state, applying migrations and extracting footer and header container from response */
  const setupBlocks = (fetchedBlocks: Block[]) => {
    if (!Array.isArray(fetchedBlocks)) {
      console.warn('Invalid blocks data received');
      return;
    }

    const fetchedHeaderContainer = fetchedBlocks.find((block) => isHeaderContainerBlock(block));

    if (fetchedHeaderContainer && Array.isArray(fetchedHeaderContainer.content)) {
      let resolvedHeaderContainer = fetchedHeaderContainer;
      if (fetchedHeaderContainer.content.length === 0) {
        const flatHeader = fetchedBlocks.find((block) => isHeaderBlock(block));
        if (flatHeader) resolvedHeaderContainer = { ...fetchedHeaderContainer, content: [flatHeader] };
      }

      if (resolvedHeaderContainer.content.length > 0 && !headerContainerCache.value)
        headerContainerCache.value = resolvedHeaderContainer;
    }

    const mainBlocks = fetchedBlocks.filter(
      (block) => !isHeaderContainerBlock(block) && !isFooterBlock(block) && !isHeaderBlock(block),
    );

    const headerContainerToUse = headerContainerCache.value || createDefaultHeaderContainerBlock();
    const footerToUse = footerCache.value || createDefaultFooterBlockHelper();
    const blocksToUse =
      mainBlocks.length > 0
        ? mainBlocks
        : state.value.defaultTemplateData.filter((block) => !isFooterBlock(block) && !isHeaderContainerBlock(block));

    const finalBlocks = [headerContainerToUse, ...blocksToUse, footerToUse];

    migrateAllBlocks(finalBlocks);

    if (JSON.stringify(state.value.data) !== JSON.stringify(finalBlocks)) {
      state.value.data.splice(0, state.value.data.length, ...finalBlocks);
    }
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(finalBlocks)));
  };

  /** Updates the blocks in state with new block data */
  const updateBlocks: UpdateBlocks = (blocks) => {
    state.value.data = blocks;

    const headerBlock = blocks.find((block) => isHeaderContainerBlock(block)) as HeaderContainerBlock | undefined;
    if (headerBlock) {
      headerContainerCache.value = headerBlock;
    }
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

  const syncHeaderCacheAfterSave = (content: string) => {
    if (!content.includes(`"name":"${HEADER_CONTAINER_BLOCK_NAME}"`)) return;
    try {
      const parsed: Block[] = JSON.parse(content);
      const headerBlock = parsed.find((block) => isHeaderContainerBlock(block)) as HeaderContainerBlock | undefined;
      if (headerBlock && Array.isArray(headerBlock.content) && headerBlock.content.length > 0) {
        updateHeaderContainerCache(headerBlock);
      } else {
        clearHeaderContainerCache();
      }
    } catch {
      clearHeaderContainerCache();
    }
  };

  const syncFooterCacheAfterSave = async (content: string) => {
    if (!content.includes(`"name":"${FOOTER_BLOCK_NAME}"`)) return;
    const footerSettings = extractFooterContentFromBlocks(content);
    if (footerSettings) {
      updateFooterCache(createFooterBlock(footerSettings));
    } else {
      clearFooterCache();
      try {
        await fetchFooterBlock();
      } catch (error) {
        console.warn('Failed to refresh footer block after save:', error);
      }
    }
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
      syncHeaderCacheAfterSave(content);
      await syncFooterCacheAfterSave(content);

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
