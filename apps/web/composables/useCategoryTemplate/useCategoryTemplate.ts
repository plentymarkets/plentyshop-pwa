import {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
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
    const { data } = await useSdk().plentysystems.getCategoryTemplate({ id: categoryId });
    state.value.loading = false;
    state.value.data = data;
    return data;
  };

  return {
    fetchCategoryTemplate,
    ...toRefs(state.value),
  };
};
