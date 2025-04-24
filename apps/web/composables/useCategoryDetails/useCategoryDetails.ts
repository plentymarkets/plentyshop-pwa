import type { CategoryData } from '@plentymarkets/shop-api';

export const useCategoryDetails: UseCategoryDetailsReturn = () => {
  const state = useState<UseCategoryDetailState>('useCategoriesSearch', () => ({
    data: {} as CategoryData,
    loading: false,
  }));

  const getCategory = async (categoryId: number): Promise<CategoryData> => {
    state.value.loading = true;
    try {
      const { data } = await useAsyncData<{ data: CategoryData }>(() =>
        useSdk().plentysystems.getCategoryById({ categoryId, with: 'details,clients' }),
      );
      const result = data?.value?.data;
      state.value.data = result ?? state.value.data;
      return result!;
    } catch (error) {
      console.error('getCategory error:', error);
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    getCategory,
    ...toRefs(state.value),
  };
};
