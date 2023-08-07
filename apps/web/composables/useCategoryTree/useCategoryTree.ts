import type { CategoryTreeItem } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import type { UseCategoryTreeState, UseCategoryTreeMethodsReturn, GetCategoryTree } from './types';

/**
 * @description Composable for managing cart.
 * @returns {@link UseCartReturn}
 * @example
 * const { data, loading } = useCart();
 */
export const useCategoryTree: UseCategoryTreeMethodsReturn = () => {
  const state = useState<UseCategoryTreeState>('useCategoryTree', () => ({
    data: [] as CategoryTreeItem[],
    loading: false,
  }));

  /**
   * @description Function for fetching the cart.
   * @example
   * getCart();
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

  return {
    getCategoryTree,
    ...toRefs(state.value),
  };
};
