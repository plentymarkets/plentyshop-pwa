import type { CategoryData } from '@plentymarkets/shop-api';
import type { UseCategoryDetailsReturn, UseCategoryDetailState } from './types';
import type { CategorySearchById } from '../../../../../plentymarkets-sdk/packages/api-client/src';

export const useCategoryDetails: UseCategoryDetailsReturn = () => {
  const state = useState<UseCategoryDetailState>('useCategoriesSearch', () => ({
    data: {} as CategoryData,
    loading: false,
  }));

  const getCategory = async (categoryId: CategorySearchById) => {
    state.value.loading = true;
    try {
      const { data } = await useAsyncData(() => useSdk().plentysystems.getCategoryById(categoryId));
      state.value.data = data?.value?.data ?? state.value.data;
      console.log('Single category data', state.value.data);
    } catch (error) {
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

