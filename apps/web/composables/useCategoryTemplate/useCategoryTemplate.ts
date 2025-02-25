import type {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
  SetCategoryTemplate,
  GetBlocks,
} from '~/composables/useCategoryTemplate/types';

export const useCategoryTemplate: UseCategoryTemplateReturn = () => {
  const state = useState<UseCategoryTemplateState>('useCategoryTemplate', () => ({
    data: [],
    categoryTemplateData: null,
    loading: false,
  }));

  const getBlocks: GetBlocks = async (identifier, type) => {
    state.value.loading = true;
    const { data } = await useAsyncData(() => useSdk().plentysystems.getBlocks({ identifier, type }));

    state.value.loading = false;
    state.value.data = data?.value?.data ?? state.value.data;
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
    state.value.loading = true;
    const { data } = await useAsyncData(() => useSdk().plentysystems.getCategoryTemplate({ id: categoryId }));

    state.value.loading = false;
    state.value.categoryTemplateData = data?.value?.data ?? state.value.categoryTemplateData;
  };

  const setCategoryTemplate: SetCategoryTemplate = async (categoryId: number, content: string) => {
    state.value.loading = true;

    try {
      const { data } = await useAsyncData(() =>
        useSdk().plentysystems.doSaveBlocks({
          url: 'index',
          entityType: 'immutable',
          blocks: content,
        }),
      );
      state.value.data = data?.value?.data ?? state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    fetchCategoryTemplate,
    setCategoryTemplate,
    getBlocks,
    ...toRefs(state.value),
  };
};
