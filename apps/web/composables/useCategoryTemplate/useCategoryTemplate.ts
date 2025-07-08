import type {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
  GetBlocks,
  SaveBlocks,
} from '~/composables/useCategoryTemplate/types';
import type { Block } from '@plentymarkets/shop-api';

import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import homepageTemplateDataEn from './homepageTemplateDataEn.json';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as Block[]) : (homepageTemplateDataEn as Block[]);

export const useCategoryTemplate: UseCategoryTemplateReturn = (blocks?: string) => {
  const state = useState<UseCategoryTemplateState>(`useCategoryTemplate-${blocks}`, () => ({
    data: [],
    cleanData: [],
    categoryTemplateData: null,
    loading: false,
  }));

  const { $i18n } = useNuxtApp();

  const getBlocks: GetBlocks = async (identifier, type, blocks?) => {
    state.value.loading = true;

    const response = await useSdk().plentysystems.getBlocks({ identifier, type, ...(blocks ? { blocks } : {}) });
    const data = response?.data;

    state.value.loading = false;

    if (!data?.length && type === 'immutable') {
      state.value.data = useLocaleSpecificHomepageTemplate($i18n.locale.value);
    } else {
      state.value.data = data ?? state.value.data;
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
    const { data } = await useAsyncData(() => useSdk().plentysystems.getCategoryTemplate({ id: categoryId }));

    state.value.categoryTemplateData = data?.value?.data ?? state.value.categoryTemplateData;
  };

  const saveBlocks: SaveBlocks = async (identifier: string | number, type: string, content: string) => {
    try {
      state.value.loading = true;

      const data = await useSdk().plentysystems.doSaveBlocks({
        identifier: identifier,
        entityType: type,
        blocks: content,
      });

      state.value.data = data.data ?? state.value.data;
      state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));
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
    updateBlocks,
    ...toRefs(state.value),
  };
};
