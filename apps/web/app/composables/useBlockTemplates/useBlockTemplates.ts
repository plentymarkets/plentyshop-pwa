import type { UseBlockTemplatesState } from './types';

export const useBlockTemplates = () => {
  const state = useState<UseBlockTemplatesState>('useBlockTemplates', () => ({
    categoryTemplateData: null,
  }));

  const fetchCategoryTemplate = async (categoryId: number) => {
    const { data } = await useAsyncData(`fetchCategoryTemplate-${categoryId}`, () =>
      useSdk().plentysystems.getCategoryTemplate({ id: categoryId }),
    );

    state.value.categoryTemplateData = data?.value?.data ?? state.value.categoryTemplateData;
  };

  const clearCategoryTemplate = () => {
    state.value.categoryTemplateData = null;
  };

  return {
    fetchCategoryTemplate,
    clearCategoryTemplate,
    categoryTemplateData: computed(() => state.value.categoryTemplateData),
  };
};
