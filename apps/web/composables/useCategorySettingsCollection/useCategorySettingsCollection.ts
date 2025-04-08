import type { Category } from '@plentymarkets/shop-api';

interface useCategorySettingsCollectionState {
  data: Category[];
  initialData: Category[];
  loading: boolean;
}

export const useCategorySettingsCollection = () => {
  const state = useState<useCategorySettingsCollectionState>('categorySettingsCollection', () => ({
    data: [],
    initialData: [],
    loading: false,
  }));

  const addCategorySettings = async (category: Category) => {
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
      const settings = JSON.parse(
        JSON.stringify(
          state.value.data.map((category) => {
            const detail = category.details[0];
            return {
              id: category.id,
              parentCategoryId: category.parentCategoryId,
              sitemap: category.sitemap,
              linklist: category.linklist,
              right: category.right,
              categoryId: detail.categoryId,
              lang: detail.lang,
              name: detail.name,
              nameUrl: detail.nameUrl,
              type: category.type,
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

      console.log('Settings being sent:', settings);

      const { error } = await useAsyncData(() => useSdk().plentysystems.setCategorySettings(settings));

      if (error.value) {
        console.error('Error saving category settings:', error.value);
        state.value.loading = false;
        return false;
      }
      state.value.initialData = JSON.parse(JSON.stringify(state.value.data));
      state.value.loading = false;
      return true;
    } catch (e) {
      state.value.loading = false;
      console.error('Error saving category settings:', e);
      return false;
    }
  };

  return {
    ...toRefs(state.value),
    addCategorySettings,
    isCategoryDirty,
    saveCategorySettings,
    hasChanges,
  };
};
