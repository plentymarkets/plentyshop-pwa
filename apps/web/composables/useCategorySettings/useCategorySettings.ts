import type { useCategorySettingsReturn, useCategoryConfigurationState } from '~/composables/useCategorySettings/types';
import type { CategoryEntry } from '@plentymarkets/shop-api';

export const useCategorySettings: useCategorySettingsReturn = (settingsId = '') => {
  const cache = useState<Record<string, CategoryEntry>>(`categoryCache-${settingsId}`, () => ({}));
  const state = useState<useCategoryConfigurationState>(`categoryConfiguration-${settingsId}`, () => ({
    data: {} as CategoryEntry,
    id: 0,
    loading: false,
    drawerOpen: false,
    drawerExtraOpen: false,
    drawerView: null,
    initialData: {} as CategoryEntry,
    unlinkModalOpen: false,
  }));
  const { locale } = useI18n();
  const { t } = useI18n();

  const fetchCategorySettings = async (categoryId: number): Promise<CategoryEntry | null> => {
    const cacheKey = `${categoryId}-${locale.value}`;
    if (cache.value[cacheKey]) {
      state.value.data = cache.value[cacheKey];
      state.value.initialData = JSON.parse(JSON.stringify(cache.value[cacheKey]));
      return cache.value[cacheKey];
    }

    state.value.loading = true;
    try {
      const { getCategory } = useCategoryDetails();
      const result = await getCategory(categoryId);

      const cleanData = JSON.parse(JSON.stringify(result));

      const { addCategorySettings } = useCategorySettingsCollection();
      await addCategorySettings(cleanData);
      await nextTick();

      cache.value[cacheKey] = cleanData;
      state.value.data = cleanData;
      state.value.initialData = JSON.parse(JSON.stringify(cleanData));
      return cache.value[cacheKey];
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
    const { deletePageFromTree } = useCategoriesSearch();
    const { setSettingsCategory } = useSiteConfiguration();
    try {
      const { data } = await useSdk().plentysystems.deleteCategory({
        categoryId: id,
      });
      if (data === 'Category deleted') {
        toggleDeleteModal(false);
        setSettingsCategory(null);
        deletePageFromTree(id);
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
