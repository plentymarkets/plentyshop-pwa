import type { Category, CategoryParams } from '@plentymarkets/shop-api';
import type { UseCategoryState, UseCategoryMethodsReturn } from './types';

/**
 * @description Composable for managing the category .
 * @returns UseCategoryMethodsReturn
 * @example
 * ``` ts
 * const { data, loading, addCategory } = useCategory();
 * ```
 */
export const useCategory: UseCategoryMethodsReturn = () => {
  const state = useState<UseCategoryState>('useCategory', () => ({
    data: {} as Category,
    loading: false,
  }));

  /**
   * @description Function for adding a new category .
   * @example
   * ``` ts
   * addCategory();
   * ```
   */
  const addCategory = async (params: CategoryParams) => {
    const { togglePageModal } = useSiteConfiguration();
    const { send } = useNotification();

    state.value.loading = true;
    try {
      const data = await useSdk().plentysystems.doAddCategory(params);

      if (data?.data) {
        togglePageModal(false);
        send({ message: 'New page added', type: 'positive' });
      }

      state.value.data = data?.data ?? state.value.data;
      return state.value.data;
    } catch (error) {
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    addCategory,
    ...toRefs(state.value),
  };
};
