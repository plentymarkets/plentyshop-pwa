import type {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
  GetBlocks,
  SaveBlocks,
} from './types';
import type { Block } from '@plentymarkets/shop-api';

import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import categoryTemplateData from './categoryTemplateData.json';
import productTemplateData from './productTemplateData.json';
import { migrateImageContent } from '~/utils/migrate-image-content';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as Block[]) : (homepageTemplateDataEn as Block[]);

const useProductTemplateData = () => productTemplateData as Block[];

const useCategoryTemplateData = () => categoryTemplateData as Block[];

export const useCategoryTemplate: UseCategoryTemplateReturn = (blocks?: string) => {
  const state = useState<UseCategoryTemplateState>(`useCategoryTemplate${blocks ? `-${blocks}` : ''}`, () => ({
    data: [],
    cleanData: [],
    categoryTemplateData: null,
    loading: false,
  }));

  const { $i18n } = useNuxtApp();

  const ensureFooterBlock = async () => {
    const { fetchFooterSettings } = useFooter();

    try {
      await fetchFooterSettings();
    } catch (error) {
      console.warn('Failed to ensure footer block:', error);
    }
  };

  const migrateAllImageBlocks = (blocks: Block[]) => {
    for (const block of blocks) {
      if (block.name === 'Image' && block.content) {
        block.content = migrateImageContent(block.content);
      }
      if (Array.isArray(block.content)) {
        migrateAllImageBlocks(block.content);
      }
    }
  };

  const getBlocksServer: GetBlocks = async (identifier, type, blocks?) => {
    state.value.loading = true;

    const { $i18n } = useNuxtApp();
    const { data: productsCatalog } = useProducts();

    const { data, error } = await useAsyncData(`${$i18n.locale.value}-${type}-${identifier}-${blocks}`, () =>
      useSdk().plentysystems.getBlocks({ identifier, type, blocks }),
    );

    state.value.loading = false;

    if (error.value) {
      const { send } = useNotification();
      send({ type: 'negative', message: error.value.message });
      return;
    }

    let fetchedBlocks: Block[] = data?.value?.data ?? [];

    if (!fetchedBlocks.length && type === 'immutable') {
      fetchedBlocks = useLocaleSpecificHomepageTemplate($i18n.locale.value);
    }

    if (!fetchedBlocks.length && type === 'category' && productsCatalog.value.category?.type === 'item') {
      fetchedBlocks = useCategoryTemplateData();
    }

    if (!fetchedBlocks.length && type === 'product') {
      fetchedBlocks = useProductTemplateData();
    }

    if (Array.isArray(fetchedBlocks)) {
      migrateAllImageBlocks(fetchedBlocks);
    }

    state.value.data = fetchedBlocks;
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(fetchedBlocks)));

    await ensureFooterBlock();
  };

  const getBlocks: GetBlocks = async (identifier, type, blocks?) => {
    state.value.loading = true;

    const { data: productsCatalog } = useProducts();

    const response = await useSdk().plentysystems.getBlocks({ identifier, type, blocks });
    const data = response?.data;

    state.value.loading = false;

    if (!data?.length) {
      if (type === 'immutable') {
        state.value.data = useLocaleSpecificHomepageTemplate($i18n.locale.value);
      }

      if (type === 'category' && productsCatalog.value.category?.type === 'item') {
        state.value.data = useCategoryTemplateData();
      }
    } else {
      state.value.data = data ?? state.value.data;
    }

    if (Array.isArray(state.value.data)) {
      migrateAllImageBlocks(state.value.data);
    }

    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));
  };
  const updateBlocks: UpdateBlocks = (blocks) => {
    state.value.data = blocks;
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
    } catch (error) {
      console.error('Error saving blocks:', error);
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
    ...toRefs(state.value),
  };
};
