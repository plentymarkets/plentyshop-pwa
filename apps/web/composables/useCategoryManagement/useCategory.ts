import type { CategoryEntry, CategoryParams } from '@plentymarkets/shop-api';
import type { UseCategoryState, UseCategoryMethodsReturn } from './types';

/**
 * @description Composable for managing the category .
 * @returns UseCategoryMethodsReturn
 * @example
 * ``` ts
 * const { data, loading, addCategory } = useCategoryManagement();
 * ```
 */
export const useCategoryManagement: UseCategoryMethodsReturn = () => {
  const state = useState<UseCategoryState>('useCategoryManagement', () => ({
    data: {} as CategoryEntry,
    loading: false,
  }));

  /**
   * @description Function for adding a new category .
   * @example
   * ``` ts
   * addCategory();
   * ```
   */
  const addCategory = async (params: CategoryParams): Promise<void> => {
    const { togglePageModal } = useSiteConfiguration();
    const { send } = useNotification();

    state.value.loading = true;
    try {
      const { data } = await useAsyncData(() => useSdk().plentysystems.doAddCategory(params));

      const category = data?.value?.data;

      if (category) {
        togglePageModal(false);
        send({ message: `Added page ${params.name} (category ID: ${category.id})`, type: 'positive' });
      }

      state.value.data = category ?? state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    addCategory,
    ...toRefs(state.value),
  };
};
