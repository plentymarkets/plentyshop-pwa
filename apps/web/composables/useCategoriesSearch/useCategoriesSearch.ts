import type { CategoryResponse, CategorySearchCriteria} from '@plentymarkets/shop-api';
import type { UseCategoriesSearchMethodsReturn, UseCategoriesSearchState } from './types';

export const useCategoriesSearch: UseCategoriesSearchMethodsReturn = () => {
  const state = useState<UseCategoriesSearchState>('useCategoriesSearch', () => ({
    data: {} as CategoryResponse,
    loading: false,
  }));

  const getCategories = async (params: CategorySearchCriteria) => {
    state.value.loading = true;
    try {
      const { data } = await useAsyncData(() => useSdk().plentysystems.getCategoriesSearch(params));
      state.value.data = data?.value?.data ?? state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  }

  return {
    getCategories,
    ...toRefs(state.value),
  }
};
