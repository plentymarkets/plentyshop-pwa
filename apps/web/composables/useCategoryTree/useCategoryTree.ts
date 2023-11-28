import type { CategoryTreeItem } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import type { UseCategoryTreeState, UseCategoryTreeMethodsReturn, GetCategoryTree, SetCategoryTree } from './types';

/**
 * @description Composable for managing the category tree.
 * @returns UseCategoryTreeMethodsReturn
 * @example
 * ``` ts
 * const { data, loading, getCategoryTree } = useCategoryTree();
 * ```
 */
export const useCategoryTree: UseCategoryTreeMethodsReturn = () => {
  const state = useState<UseCategoryTreeState>('useCategoryTree', () => ({
    data: [] as CategoryTreeItem[],
    loading: false,
  }));

  /**
   * @description Function for fetching the category tree.
   * @example
   * ``` ts
   * getCategoryTree();
   * ```
   */
  const getCategoryTree: GetCategoryTree = async () => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() => useSdk().plentysystems.getCategoryTree());
      useHandleError(error.value);
      state.value.data = data?.value?.data ?? state.value.data;
      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for setting the category tree data.
   * @example
   * ``` ts
   * setCategoryTree();
   * ```
   */
  const setCategoryTree: SetCategoryTree = (data: CategoryTreeItem[]) => {
    state.value.data = data;
  };

  return {
    getCategoryTree,
    setCategoryTree,
    ...toRefs(state.value),
  };
};
