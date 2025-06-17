import type { useCategorySettingsCollectionReturn, useCategorySettingsCollectionState } from './types';
import type { CategoryEntry } from '@plentymarkets/shop-api';

export const useCategorySettingsCollection: useCategorySettingsCollectionReturn = () => {
  const state = useState<useCategorySettingsCollectionState>('categorySettingsCollection', () => ({
    data: [],
    initialData: [],
    loading: false,
  }));

  const { send } = useNotification();
  const { $i18n } = useNuxtApp();

  const addCategorySettings = async (category: CategoryEntry) => {
    const exists = state.value.data.some((item) => item.id === category.id);
    if (exists) return;

    state.value.data.push(category);
    state.value.initialData.push(JSON.parse(JSON.stringify(category)));
  };

  const hasChanges = computed(() => {
    return JSON.stringify(state.value.data) !== JSON.stringify(state.value.initialData);
  });

  const isCategoryDirty = (id: number) => {
    const current = state.value.data.find((item) => item.id === id);
    const initial = state.value.initialData.find((item) => item.id === id);
    if (!current || !initial) return false;

    return JSON.stringify(current) !== JSON.stringify(initial);
  };

  const saveCategorySettings: SaveSettings = async (): Promise<boolean> => {
    state.value.loading = true;
    try {
      const dirtyCategories = state.value.data.filter((category) => {
        const initial = state.value.initialData.find((item) => item.id === category.id);
        if (!initial) return false;
        return JSON.stringify(category) !== JSON.stringify(initial);
      });
      if (dirtyCategories.length === 0) {
        state.value.loading = false;
        return true;
      }
      const settings = JSON.parse(
        JSON.stringify(
          dirtyCategories.map((category) => {
            const detail = category.details[0];
            return {
              id: category.id,
              parentCategoryId: category.parentCategoryId,
              sitemap: category.sitemap,
              linklist: category.linklist,
              linkCategoryToWebstore: category.isLinkedToWebstore,
              right: category.right,
              categoryId: detail.categoryId,
              lang: detail.lang,
              name: detail.name,
              nameUrl: detail.nameUrl,
              type: category.type,
              position: detail.position,
              metaTitle: detail.metaTitle,
              metaDescription: detail.metaDescription,
              metaKeywords: detail.metaKeywords,
              metaRobots: detail.metaRobots,
              canonicalLink: detail.canonicalLink,
              pageView: detail.pageView,
              itemListView: detail.itemListView,
              singleItemView: detail.singleItemView,
              clients: category.clients.map((client) => ({
                categoryId: client.categoryId,
                plentyId: client.plentyId,
              })),
            };
          }),
        ),
      );
      await useSdk().plentysystems.setCategorySettings(settings);

      dirtyCategories.forEach((category) => {
        const idx = state.value.initialData.findIndex((item) => item.id === category.id);
        if (idx !== -1) {
          state.value.initialData[idx] = JSON.parse(JSON.stringify(category));
        }
      });
      state.value.loading = false;
    } catch (e) {
      console.error('Error saving category settings:', e);
    } finally {
      state.value.loading = false;
    }

    return true;
  };

  const save = async () => {
    const successMessage = $i18n.t('errorMessages.editor.categories.success');
    const errorMessage = $i18n.t('errorMessages.editor.categories.error');

    const isSaved = await saveCategorySettings();

    if (isSaved) {
      send({
        message: successMessage,
        type: 'positive',
      });
    } else {
      send({
        message: errorMessage,
        type: 'negative',
      });
    }
  };

  return {
    ...toRefs(state.value),
    addCategorySettings,
    isCategoryDirty,
    saveCategorySettings,
    save,
    hasChanges,
  };
};
