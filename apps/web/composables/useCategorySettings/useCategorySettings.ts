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

  const fetchCategorySettings = async (categoryId: number) => {
    if (cache.value[categoryId]) {
      console.log('Loaded from cache:', categoryId);
      state.value.data = cache.value[categoryId];
      return cache.value[categoryId];
    }

    state.value.loading = true;

    try {
      const { fetchProducts } = useProducts(settingsId);
      const result = await fetchProducts({ categoryId: categoryId.toString() });

      const categoryData = result.category;
      console.log('Fetched from API:', categoryData);

      const cleanData = JSON.parse(JSON.stringify(categoryData));

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

  const hasChanges = computed(() => {
    return JSON.stringify(state.value.data) !== JSON.stringify(state.value.initialData);
  });

  const ready = ref(false);
  watch(
    () => state.value.id,
    async (newId: number) => {
      if (newId) {
        ready.value = false;
        await fetchCategorySettings(newId);
        ready.value = true;
        console.log('Category data ready for ID:', newId);
      }
    },
    { immediate: true },
  );

  const saveCategorySettings: SaveSettings = async (): Promise<boolean> => {
    state.value.loading = true;

    const settings = [
      {
        key: 'id',
        value: state.value.id.toString(),
      },
      {
        key: 'parentCategoryId',
        value: state.value.parentCategoryId?.toString() || '',
      },
      {
        key: 'sitemap',
        value: state.value.sitemap.toString(),
      },

      {
        key: 'linkList',
        value: state.value.linkList.toString(),
      },
      {
        key: 'name',
        value: state.value.name,
      },
      {
        key: 'canonicalLink',
        value: state.value.canonicalLink,
      },
      {
        key: 'title',
        value: state.value.title,
      },
      {
        key: 'description',
        value: state.value.description,
      },
      {
        key: 'keywords',
        value: state.value.keywords,
      },
      {
        key: 'robots',
        value: state.value.robots,
      },
    ];
    const { error } = await useAsyncData(() => useSdk().plentysystems.setConfiguration({ settings }));

    if (error.value) {
      state.value.loading = false;
      return false;
    }

    state.value.loading = false;
    return true;
  };

  return {
    ...toRefs(state.value),
    saveCategorySettings,
    fetchCategorySettings,
    ready,
    hasChanges,
  };
};
