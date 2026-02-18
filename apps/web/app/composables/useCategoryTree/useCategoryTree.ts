import type { CategoryTreeItem } from '@plentymarkets/shop-api';

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

  const pendingRequest = useState<Promise<CategoryTreeItem[]> | null>('useCategoryTree-pending', () => null);

  /**
   * @description Function for fetching the category tree.
   * @example
   * ``` ts
   * getCategoryTree();
   * ```
   */
  const getCategoryTree: GetCategoryTree = async () => {
    if (pendingRequest.value) return pendingRequest.value;

    state.value.loading = true;

    const request = (async () => {
      try {
        const data = await useSdk().plentysystems.getCategoryTree();
        state.value.data = data?.data ?? state.value.data;
        return state.value.data;
      } catch (error) {
        throw new Error(error as string);
      } finally {
        state.value.loading = false;
        pendingRequest.value = null;
      }
    })();

    pendingRequest.value = request;
    return request;
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
