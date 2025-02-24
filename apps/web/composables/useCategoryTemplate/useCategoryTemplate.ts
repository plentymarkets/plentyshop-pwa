import type {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
  SetCategoryTemplate,
} from '~/composables/useCategoryTemplate/types';

export const useCategoryTemplate: UseCategoryTemplateReturn = () => {
  const state = useState<UseCategoryTemplateState>('useCategoryTemplate', () => ({
    data: null,
    loading: false,
  }));

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
    state.value.data = data?.value?.data ?? state.value.data;
  };

  const setCategoryTemplate: SetCategoryTemplate = async (categoryId: number, content: string) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.setCategoryTemplate({
        id: categoryId,
        content: content,
      }),
    );
    if (error.value) {
      throw new Error(error.value.message);
    }
    state.value.data = data?.value?.data ?? state.value.data;
    state.value.loading = false;
  };

  return {
    fetchCategoryTemplate,
    setCategoryTemplate,
    ...toRefs(state.value),
  };
};
