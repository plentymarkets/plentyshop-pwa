import type {
  FetchCategoryTemplate,
  UseBlockTemplatesReturn,
  UseBlockTemplatesState,
  GetBlocks,
  SaveBlocks,
} from './types';
import type { ApiError, Block } from '@plentymarkets/shop-api';
import type { TextCardContent } from '~/components/blocks/TextCard/types';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';
import type { FooterContent, FooterSwitchDefinition, FooterBlock } from '~/components/blocks/Footer/types';
import { v4 as uuid } from 'uuid';
import { callWithNuxt } from '#app';

const FOOTER_BLOCK_NAME = 'Footer' as const;

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

const isFooterBlock = (block: Block | null | undefined): block is FooterBlock => {
  return block?.name === FOOTER_BLOCK_NAME;
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

  /** Clears the cached footer block, forcing a fresh fetch on next access */
  const clearFooterCache = () => (footerCache.value = null);

  /** Updates the cached footer block with a new footer configuration */
  const updateFooterCache = (newFooterBlock: FooterBlock) => (footerCache.value = newFooterBlock);

  /** Returns the cached footer block or creates a default one if cache is empty */
  const getFooterBlock = (): FooterBlock => footerCache.value || createDefaultFooterBlockHelper();

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

  const migrateAllBlocks = (blocks: Block[]) => {
    const config = useRuntimeConfig().public;

    const migrate = (blocks: Block[], isRootLevel = true) => {
      blocks.forEach((block, index) => {
        if (block.name === 'Image' && block.content) {
          block.content = migrateImageContent(block.content);
        }

        if (block.name === 'ProductRecommendedProducts' && block.content) {
          block.content = migrateRecommendedContent(block.content as OldContent | ProductRecommendedProductsContent);
        }

        if (block.name === 'TextCard' && block.content) {
          const isFirstBlock = isRootLevel && index === 0;

          block.content = migrateTextCardContent(
            block.content as Partial<TextCardContent>,
            config.enableRichTextEditorV2,
            isFirstBlock,
          );
        }

        if (Array.isArray(block.content)) {
          migrate(block.content, false);
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

  /** Sets up blocks in state, applying migrations and extracting footer from response */
  const setupBlocks = (fetchedBlocks: Block[]) => {
    if (!Array.isArray(fetchedBlocks)) {
      console.warn('Invalid blocks data received');
      return;
    }

    migrateAllBlocks(fetchedBlocks);

    const contentBlocks: Block[] = [];

    for (const block of fetchedBlocks) {
      if (!isFooterBlock(block)) {
        contentBlocks.push(block);
      }
    }

    const footerToUse = footerCache.value || createDefaultFooterBlockHelper();
    const blocksToUse =
      contentBlocks.length > 0
        ? contentBlocks
        : state.value.defaultTemplateData.filter((block) => !isFooterBlock(block));

    const finalBlocks = [...blocksToUse, footerToUse];

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

  /** Saves blocks to the server and updates footer cache if footer block is included */
  const saveBlocks: SaveBlocks = async (identifier: string | number, type: string, content: string) => {
    try {
      state.value.loading = true;

      const response = await useSdk().plentysystems.doSaveBlocks({
        identifier,
        entityType: type,
        blocks: content,
      });

      const data = response?.data ?? state.value.data;

      setupBlocks(data);

      if (typeof content === 'string' && content.includes(`"name":"${FOOTER_BLOCK_NAME}"`)) {
        const footerSettings = extractFooterContentFromBlocks(content);
        if (footerSettings) {
          const footerBlock = createFooterBlock(footerSettings);
          updateFooterCache(footerBlock);
        } else {
          clearFooterCache();
          try {
            await fetchFooterBlock();
          } catch (error) {
            console.warn('Failed to refresh footer block after save:', error);
          }
        }
      }
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
    data: computed(() => state.value.data),
    cleanData: computed(() => state.value.cleanData),
    loading: computed(() => state.value.loading),
    categoryTemplateData: computed(() => state.value.categoryTemplateData),
    defaultTemplateData: computed(() => state.value.defaultTemplateData),
  };
};
