import type { useCategorySettingsReturn, useCategoryConfigurationState } from '~/composables/useCategorySettings/types';
import type { Category } from '@plentymarkets/shop-api';

export const useCategorySettings: useCategorySettingsReturn = (settingsId = '') => {
  const cache = useState<Record<number, Category>>(`categoryCache-${settingsId}`, () => ({}));
  const state = useState<useCategoryConfigurationState>(`categoryConfiguration-${settingsId}`, () => ({
    data: {} as Category,
    id: 0,
    loading: false,
    drawerOpen: false,
    drawerExtraOpen: false,
    drawerView: null,
    initialData: {} as Category,
    unlinkModalOpen: false,
  }));
  const { t } = useI18n();

  const fetchCategorySettings = async (categoryId: number): Promise<Category | null> => {
    if (cache.value[categoryId]) {
      state.value.data = cache.value[categoryId];
      state.value.initialData = JSON.parse(JSON.stringify(cache.value[categoryId]));
      return cache.value[categoryId];
    }

    state.value.loading = true;
    try {
      const { fetchProducts } = useProducts(settingsId);
      const result = await fetchProducts({ categoryId: categoryId.toString() });

      const categoryData = result.category as Category;

      const cleanData = JSON.parse(JSON.stringify(categoryData));

      const { addCategorySettings } = useCategorySettingsCollection();
      await addCategorySettings(cleanData);
      await nextTick();

      cache.value[categoryId] = cleanData;
      state.value.data = cache.value[categoryId];
      state.value.initialData = JSON.parse(JSON.stringify(cleanData));

      return cache.value[categoryId];
    } catch (error) {
      console.error('Error fetching category settings:', error);
      return null;
    } finally {
      state.value.loading = false;
    }
  };
  const toggleDeleteModal = (value: boolean) => {
    state.value.unlinkModalOpen = value;
  };
  const deletePage = async (id: number, pageName: string) => {
    const { send } = useNotification();
    try {
      const { data } = await useSdk().plentysystems.deleteCategory({
        categoryId: id,
      });
      if (data === 'Category deleted') {
        toggleDeleteModal(false);
        send({
          message: t('errorMessages.editor.categories.deleteSuccess', { pageName: pageName, id: id }),
          type: 'positive',
        });
      }
    } catch (error) {
      let errorMessage = '';
      if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMessage = (error as { message: string }).message;
        }
      }
      send({
        message: t('errorMessages.editor.categories.deleteError', {
          pageName: pageName,
          id: id,
          errorMessage: errorMessage,
        }),
        type: 'negative',
      });
    }
  };
  return {
    ...toRefs(state.value),
    fetchCategorySettings,
    toggleDeleteModal,
    deletePage,
  };
};
