import type { useCategorySettingsReturn, useCategoryConfigurationState } from '~/composables/useCategorySettings/types';
import { categoryGetters } from '@plentymarkets/shop-api';
import type { Category } from '@plentymarkets/shop-api';

/**
 * @description Composable for managing SEO configuration.
 * @returns useCategorySettingsReturn
 * @example
 * ``` ts
 * const { title, description, keywords, robots, canonical, includeSitemap, saveSeoSettings, seoSettingsIsDirty } = useSeoConfiguration();
 * ```
 */
export const useCategorySettings: useCategorySettingsReturn = (settingsId = '') => {
  const cache = useState<Record<number, any>>(`categoryCache-${settingsId}`, () => ({}));
  const state = useState<useCategoryConfigurationState>(`categoryConfiguration-${settingsId}`, () => ({
    data: {},
    id: 0,
    loading: false,
    drawerOpen: false,
    drawerExtraOpen: false,
    drawerView: null,
    initialData: {},
  }));

  const ready = ref(false);

  const fetchCategorySettings = async (categoryId: number) => {
    if (cache.value[categoryId]) {
      state.value.data = cache.value[categoryId];
      state.value.initialData = JSON.parse(JSON.stringify(cache.value[categoryId]));
      return cache.value[categoryId];
    }

    state.value.loading = true;

    try {
      const { fetchProducts } = useProducts(settingsId);
      const result = await fetchProducts({ categoryId: categoryId.toString() });

      const categoryData = result.category;

      const cleanData = JSON.parse(JSON.stringify(categoryData));


      const { addCategorySettings } = useCategorySettingsCollection();
      await addCategorySettings(cleanData);
      await nextTick();

      cache.value[categoryId] = cleanData;
      state.value.data = cache.value[categoryId];
      state.value.initialData = JSON.parse(JSON.stringify(cleanData));

      return cache.value[categoryId];
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  const isDirty = (id: number) => {
    return computed(() => 
      id === state.value.data.id &&
      JSON.stringify(state.value.data) !== JSON.stringify(state.value.initialData)
    );
  };

  const hasChanges = computed(() => {
    return JSON.stringify(state.value.data) !== JSON.stringify(state.value.initialData);
  });


  return {
    ...toRefs(state.value),
    fetchCategorySettings,
    ready,
    hasChanges,
    isDirty,
  };
};
