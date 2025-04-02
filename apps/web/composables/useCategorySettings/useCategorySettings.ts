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
export const useCategorySettings: useCategorySettingsReturn = () => {
  const state = useState<useCategoryConfigurationState>(`categoryConfiguration`, () => ({
    data: {},
    loading: false,
    drawerOpen: false,
    drawerExtraOpen: false,
    id: 0,
    parentCategoryId: 0,
    sitemap: false,
    linkList: false,
    name: '',
    path: '',
    canonicalLink: '',
    title: '',
    description: '',
    keywords: '',
    robots: '',
    right: '', 
    drawerView: null,
    initialData: {
      id: 0,
      parentCategoryId: 0,
      sitemap: false,
      linkList: false,
      name: '',
      path: '',
      canonicalLink: '',
      title: '',
      description: '',
      keywords: '',
      robots: '',
      right: '', 
    },
  }));
  const getPageId = computed(() => state.value.id);
  const getParentCategoryId = computed(() => state.value.parentCategoryId);

  const categorySettingsIsDirty = computed(() => {
    return (
      state.value.name !== state.value.initialData.name ||
      state.value.canonicalLink !== state.value.initialData.canonicalLink ||
      state.value.title !== state.value.initialData.title ||
      state.value.description !== state.value.initialData.description ||
      state.value.keywords !== state.value.initialData.keywords ||
      state.value.robots !== state.value.initialData.robots
    );
  });

  const fetchCategorySettings = async (categoryId: number) => {
    state.value.loading = true;
    if (!state.value.data[categoryId]) {
      try {
        const { data, fetchProducts } = useProducts();

        await fetchProducts({ categoryId: categoryId.toString() });

        if (data) {
          state.value.data[categoryId] = {
            id: categoryId,
            parentCategoryId: data.value.category.parentCategoryId,
            sitemap: data.value.category.sitemap,
            linkList: data.value.category.linklist,
            name: categoryGetters.getCategoryName(data.value.category),
            path: categoryGetters.getCategoryDetails(data.value.category),
            canonicalLink: categoryGetters.getCategoryDetails(data.value.category),
            title: categoryGetters.getMetaTitle(data.value.category),
            description: categoryGetters.getMetaDescription(data.value.category),
            keywords: categoryGetters.getMetaKeywords(data.value.category) || '',
            robots: data.value.category.robots,
          };
            state.value.initialData = {
            ...state.value.initialData,
            [categoryId]: {
              id: categoryId,
              parentCategoryId: data.value.category.parentCategoryId,
              sitemap: data.value.category.sitemap,
              linkList: data.value.category.linklist,
              name: categoryGetters.getCategoryName(data.value.category),
              path: categoryGetters.getCategoryDetails(data.value.category),
              canonicalLink: categoryGetters.getCategoryDetails(data.value.category),
              title: categoryGetters.getMetaTitle(data.value.category),
              description: categoryGetters.getMetaDescription(data.value.category),
              keywords: categoryGetters.getMetaKeywords(data.value.category) || '',
              robots: data.value.category.robots,
            },
            };
          state.value.id = categoryId;
          state.value.parentCategoryId = data.value.category.parentCategoryId;
          state.value.sitemap = data.value.category.sitemap === 'Y';
          state.value.linkList = data.value.category.linklist === 'Y';
          state.value.name = categoryGetters.getCategoryName(data.value.category!);
          state.value.path = categoryGetters.getCategoryDetails(data.value.category)?.nameUrl || '';
          state.value.canonicalLink = categoryGetters.getCategoryDetails(data.value.category)?.canonicalLink || '';
          state.value.title = categoryGetters.getMetaTitle(data.value.category);
          state.value.description = categoryGetters.getMetaDescription(data.value.category);
          state.value.keywords = categoryGetters.getMetaKeywords(data.value.category);
          state.value.robots = data.value.category.robots || '';

          state.value.initialData = {
            id: categoryId,
            parentCategoryId: data.value.category.parentCategoryId,
            sitemap: data.value.category.sitemap  === 'Y',
            linkList: data.value.category.linklist === 'Y',
            right:  data.value.category.right,
            name: '',
            path: categoryGetters.getCategoryDetails(data.value.category)?.nameUrl || '',
            canonicalLink: categoryGetters.getCategoryDetails(data.value.category)?.canonicalLink || '',
            title: categoryGetters.getMetaTitle(data.value.category),
            description: categoryGetters.getMetaDescription(data.value.category),
            keywords: categoryGetters.getMetaKeywords(data.value.category),
            robots: data.value.category.robots  || '',
          };
        } else {
          console.error('Invalid data structure returned by getFacet:', data);
        }
      } catch (err) {
        console.error('Error fetching category settings:', err);
      } finally {
        state.value.loading = false;
      }
    }
  };

  const setPageId = (id: number, parentCategoryId?: number) => {
    state.value.id = id;
    if (parentCategoryId !== undefined) {
      state.value.parentCategoryId = parentCategoryId;
    }
  };

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
    categorySettingsIsDirty,
    saveCategorySettings,
    setPageId,
    getPageId,
    getParentCategoryId,
    fetchCategorySettings,
  };
};
