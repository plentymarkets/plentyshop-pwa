import type { CategoryTemplate } from '@plentymarkets/shop-api';

interface UseBlockTemplatesState {
  categoryTemplateData: CategoryTemplate | null;
}

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

  return {
    fetchCategoryTemplate,
    categoryTemplateData: computed(() => state.value.categoryTemplateData),
  };
};
