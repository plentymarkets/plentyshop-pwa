import type {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
  GetBlocks,
  SaveBlocks,
} from './types';
import type { Block } from '@plentymarkets/shop-api';
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

  const ensureFooterBlock = async () => {
    const { fetchFooterSettings } = useFooter();

    try {
      await fetchFooterSettings();
    } catch (error) {
      console.warn('Failed to ensure footer block:', error);
    }
  };

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

    await ensureFooterBlock();
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

    if (Array.isArray(blocks)) {
      migrateAllBlocks(blocks);
    }

    if (JSON.stringify(state.value.data) !== JSON.stringify(blocks)) {
      state.value.data.splice(0, state.value.data.length, ...blocks);
    }
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(blocks)));
  };

  const updateBlocks: UpdateBlocks = (blocks) => {
    state.value.data = blocks;
  };

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

  const saveBlocks: SaveBlocks = async (identifier: string | number, type: string, content: string) => {
    try {
      state.value.loading = true;

      await useSdk().plentysystems.doSaveBlocks({
        identifier,
        entityType: type,
        blocks: content,
      });

      state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));

      if (typeof content === 'string' && (content.includes('"name":"Footer"') || content.includes('"name":"Header"'))) {
        const { clearGlobalBlocksCache } = useGlobalBlocks();
        const { fetchHeaderBlocks } = useHeader();
        const { fetchFooterSettings } = useFooter();

        clearGlobalBlocksCache();

        try {
          await Promise.all([fetchHeaderBlocks(), fetchFooterSettings()]);
        } catch (error) {
          console.warn('Failed to refresh global blocks after save:', error);
        }
      }

      return true;
    } catch (error) {
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
    ...toRefs(state.value),
  };
};
