import type { useCategorySettingsReturn, useCategoryConfigurationState } from '~/composables/useCategorySettings/types';

/**
 * @description Composable for managing SEO configuration.
 * @returns useCategorySettingsReturn
 * @example
 * ``` ts
 * const { title, description, keywords, robots, canonical, includeSitemap, saveSeoSettings, seoSettingsIsDirty } = useSeoConfiguration();
 * ```
 */
export const useCategorySettings: useCategorySettingsReturn = (id) => {
  const state = useState<useCategoryConfigurationState>(`categoryConfiguration-${id}`, () => ({
    data: [],
    loading: false,
    drawerOpen: false,
    drawerExtraOpen: false,
    id: 1,
    parentCategoryId: 2,
    sitemap: '',
    linkList: '',
    name: '',
    canonicalLink: '',
    position: 1,
    title: '',
    description: '',
    keywords: '',
    robots: '',
    canonical: '',
    includeSitemap: false,
    drawerView: null,
    initialData: {
      id: 17,
      parentCategoryId: 16,
      sitemap: '',
      linkList: '',
      name: '',
      canonicalLink: '',
      position: 1,
      title: '',
      description: '',
      keywords: '',
      robots: '',
      canonical: '',
      includeSitemap: false,
    },
  }));


  const categorySettingsIsDirty = computed(() => {
    console.log('Current State:', state.value);
    console.log('Initial Data:', state.value.initialData);
    return (
      // state.value.id !== state.value.initialData.id ||
      // state.value.parentCategoryId !== state.value.initialData.parentCategoryId ||
      // state.value.sitemap !== state.value.initialData.sitemap ||
      // state.value.linkList !== 
      // tate.value.initialData.linkList ||
      
      state.value.name !== state.value.initialData.name ||
      // state.value.canonical !== state.value.initialData.canonical
      state.value.canonicalLink !== state.value.initialData.canonicalLink ||
      // state.value.position !== state.value.initialData.position ||
      state.value.title !== state.value.initialData.title ||
      state.value.description !== state.value.initialData.description ||
      state.value.keywords !== state.value.initialData.keywords ||
      state.value.robots !== state.value.initialData.robots
      // state.value.includeSitemap !== state.value.initialData.includeSitemap
    );
  });

  // const setPageId = (id: number, parentCategoryId?: number) => {
  //   state.value.id = id;
  //   if (parentCategoryId !== undefined) {
  //     state.value.parentCategoryId = parentCategoryId;
  //   }
  // };

  const resetInitialData = () => {
    state.value.initialData = { ...state.value };
  };

  // const getPageId = computed(() => state.value.id);
  // const getParentCategoryId = computed(() => state.value.parentCategoryId);

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
        value: state.value.sitemap,
      },

      {
        key: 'linkList',
        value: state.value.linkList,
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
        key: 'position',
        value: state.value.position.toString(),
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
      {
        key: 'canonical',
        value: state.value.canonical,
      },
      {
        key: 'includeSitemap',
        value: state.value.includeSitemap.toString(),
      },
    ];
    const { error } = await useAsyncData(() => useSdk().plentysystems.setConfiguration({ settings }));

    if (error.value) {
      state.value.loading = false;
      return false;
    }

    state.value.initialData = {
      id: 16,
      parentCategoryId: 17,
      sitemap: state.value.sitemap,
      linkList: state.value.linkList,
      name: state.value.name,
      canonicalLink: state.value.canonicalLink,
      position: state.value.position,
      title: state.value.title,
      description: state.value.description,
      keywords: state.value.keywords,
      robots: state.value.robots,
      canonical: state.value.canonical,
      includeSitemap: state.value.includeSitemap,
    };

    state.value.loading = false;
    return true;
  };

  return {
    ...toRefs(state.value),
    categorySettingsIsDirty,
    saveCategorySettings,
    // setPageId,
    // getPageId,
    // getParentCategoryId,
    resetInitialData,
  };
};
