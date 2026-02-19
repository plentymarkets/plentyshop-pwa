import type {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
  GetBlocks,
  SaveBlocks,
} from './types';
import type { ApiError, Block } from '@plentymarkets/shop-api';
import type { TextCardContent } from '~/components/blocks/TextCard/types';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';

export const useCategoryTemplate: UseCategoryTemplateReturn = (
  identifier: string = 'unknown',
  type: string = 'unknown',
  locale: string = 'locale',
  blocks: string = 'all',
) => {
  const state = useState<UseCategoryTemplateState>(
    `useCategoryTemplate-${identifier}-${type}-${locale}-${blocks}`,
    () => ({
      data: [],
      cleanData: [],
      categoryTemplateData: null,
      defaultTemplateData: [],
      loading: false,
    }),
  );

  const migrateAllBlocks = (blocks: Block[]) => {
    const config = useRuntimeConfig().public;

    for (const block of blocks) {
      if (block.name === 'Image' && block.content) {
        block.content = migrateImageContent(block.content);
      }
      if (block.name === 'ProductRecommendedProducts' && block.content) {
        block.content = migrateRecommendedContent(block.content as OldContent | ProductRecommendedProductsContent);
      }
      if (block.name === 'TextCard' && block.content) {
        block.content = migrateTextCardContent(
          block.content as Partial<TextCardContent>,
          config.enableRichTextEditorV2,
        );
      }
      if (Array.isArray(block.content)) {
        migrateAllBlocks(block.content);
      }
    }
  };

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

  const getBlocks: GetBlocks = async (identifier, type, blocks?) => {
    state.value.loading = true;

    const response = await useSdk().plentysystems.getBlocks({ identifier, type, blocks });
    const data = response?.data;

    state.value.loading = false;

    setupBlocks(data ?? []);
  };

  const setupBlocks = (fetchedBlocks: Block[]) => {
    const blocks = fetchedBlocks.length ? fetchedBlocks : state.value.defaultTemplateData;
    const usedDefaultTemplate = !fetchedBlocks.length && state.value.defaultTemplateData.length > 0;

    if (Array.isArray(blocks)) {
      migrateAllBlocks(blocks);
    }

    if (JSON.stringify(state.value.data) !== JSON.stringify(blocks)) {
      state.value.data.splice(0, state.value.data.length, ...blocks);
    }
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(blocks)));

    const { globalBlocksCache: cache } = useGlobalBlocks();
    const footerInCache = cache.value?.find((b) => b.name === 'Footer');
    const footerInData = state.value.data.find((b) => b.name === 'Footer');

    if (footerInCache && footerInData && footerInCache.meta?.uuid !== footerInData.meta?.uuid) {
      const header = state.value.data.filter((b) => b.name === 'Header');
      const main = state.value.data.filter((b) => b.name !== 'Header' && b.name !== 'Footer');
      const footerClone = JSON.parse(JSON.stringify(footerInCache));
      state.value.data.splice(0, state.value.data.length, ...header, ...main, footerClone);
      state.value.cleanData = markRaw([...header, ...main, JSON.parse(JSON.stringify(footerInCache))]);
    }

    if (usedDefaultTemplate) {
      const { updateGlobalBlocks } = useGlobalBlocks();
      const { updateFooterCache } = useFooter();

      const clonedBlocks = JSON.parse(JSON.stringify(blocks));

      const hasGlobalBlocks = clonedBlocks.some((b: Block) => b.name === 'Header' || b.name === 'Footer');

      if (hasGlobalBlocks) {
        updateGlobalBlocks(clonedBlocks);

        const footerBlock = clonedBlocks.find((b: Block) => b.name === 'Footer');
        if (footerBlock) {
          updateFooterCache(footerBlock.content);
        }
      }
    }
  };

  const updateBlocks: UpdateBlocks = (blocks) => {
    state.value.data = blocks;
  };

  const setDefaultTemplate = (blocks: Block[]) => {
    state.value.defaultTemplateData = blocks;
  };

  const headerBlocks = computed({
    get: () => state.value.data.filter((block) => block.name === 'Header'),
    set: (newHeaderBlocks: Block[]) => {
      const main = state.value.data.filter((b) => b.name !== 'Header' && b.name !== 'Footer');
      const footer = state.value.data.filter((b) => b.name === 'Footer');
      state.value.data.splice(0, state.value.data.length, ...newHeaderBlocks, ...main, ...footer);
    },
  });

  const mainBlocks = computed({
    get: () => state.value.data.filter((block) => block.name !== 'Header' && block.name !== 'Footer'),
    set: (newMainBlocks: Block[]) => {
      const header = state.value.data.filter((b) => b.name === 'Header');
      const footer = state.value.data.filter((b) => b.name === 'Footer');
      state.value.data.splice(0, state.value.data.length, ...header, ...newMainBlocks, ...footer);
    },
  });

  const footerBlocks = computed({
    get: () => {
      const filtered = state.value.data.filter((block) => block.name === 'Footer');
      return filtered;
    },
    set: (newFooterBlocks: Block[]) => {
      const header = state.value.data.filter((b) => b.name === 'Header');
      const main = state.value.data.filter((b) => b.name !== 'Header' && b.name !== 'Footer');
      state.value.data.splice(0, state.value.data.length, ...header, ...main, ...newFooterBlocks);

      const { updateGlobalBlocks, globalBlocksCache } = useGlobalBlocks();
      if (globalBlocksCache.value) {
        const otherBlocks = globalBlocksCache.value.filter((b) => b.name !== 'Footer');
        updateGlobalBlocks([...otherBlocks, ...newFooterBlocks]);
      }
    },
  });

  const { globalBlocksCache } = useGlobalBlocks();
  watch(
    () => globalBlocksCache.value?.find((b) => b.name === 'Footer'),
    (newFooter, _oldFooter) => {
      if (!newFooter) {
        return;
      }

      const footerInState = state.value.data.find((b) => b.name === 'Footer');
      const footerInCleanData = state.value.cleanData.find((b) => b.name === 'Footer');

      if (!footerInState) {
        return;
      }

      if (footerInState.meta?.uuid !== newFooter.meta?.uuid) {
        const header = state.value.data.filter((b) => b.name === 'Header');
        const main = state.value.data.filter((b) => b.name !== 'Header' && b.name !== 'Footer');
        state.value.data.splice(0, state.value.data.length, ...header, ...main, newFooter);

        if (footerInCleanData && footerInCleanData.meta?.uuid !== newFooter.meta?.uuid) {
          const headerClean = state.value.cleanData.filter((b) => b.name === 'Header');
          const mainClean = state.value.cleanData.filter((b) => b.name !== 'Header' && b.name !== 'Footer');
          state.value.cleanData = markRaw([...headerClean, ...mainClean, JSON.parse(JSON.stringify(newFooter))]);
        }
      } else {
        const footerIndex = state.value.data.findIndex((b) => b.name === 'Footer');
        if (footerIndex !== -1) {
          state.value.data.splice(footerIndex, 1, JSON.parse(JSON.stringify(newFooter)));
        }
      }
    },
    { deep: true },
  );

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

  const saveBlocks: SaveBlocks = async (identifier: string | number, type: string, content: string) => {
    try {
      state.value.loading = true;

      await useSdk().plentysystems.doSaveBlocks({
        identifier,
        entityType: type,
        blocks: content,
      });

      state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));

      if (typeof content === 'string' && content.includes('"name":"Footer"')) {
        const { updateFooterCache, extractFooterFromBlocks, clearFooterCache, fetchFooterSettings } = useFooter();

        const footerSettings = extractFooterFromBlocks(content);
        if (footerSettings) {
          updateFooterCache(footerSettings);
        } else {
          clearFooterCache();
          try {
            await fetchFooterSettings();
          } catch (error) {
            console.warn('Failed to refresh footer settings after save:', error);
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
    headerBlocks,
    mainBlocks,
    footerBlocks,
    ...toRefs(state.value),
  };
};
