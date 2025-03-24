import type { useCategorySettingsReturn, useCategoryConfigurationState } from '~/composables/useCategorySettings/types';

/**
 * @description Composable for managing SEO configuration.
 * @returns useCategorySettingsReturn
 * @example
 * ``` ts
 * const { title, description, keywords, robots, canonical, includeSitemap, saveSeoSettings, seoSettingsIsDirty } = useSeoConfiguration();
 * ```
 */
export const useCategorySettings: useCategorySettingsReturn = () => {
  const state = useState<useCategoryConfigurationState>('categoryConfiguration', () => ({
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
    return (
      state.value.id !== state.value.initialData.id ||
      state.value.parentCategoryId !== state.value.initialData.parentCategoryId ||
      state.value.sitemap !== state.value.initialData.sitemap ||
      state.value.linkList !== state.value.initialData.linkList ||
      state.value.name !== state.value.initialData.name ||
      state.value.canonicalLink !== state.value.initialData.canonicalLink ||
      state.value.position !== state.value.initialData.position ||
      state.value.title !== state.value.initialData.title ||
      state.value.description !== state.value.initialData.description ||
      state.value.keywords !== state.value.initialData.keywords ||
      state.value.robots !== state.value.initialData.robots ||
      state.value.canonical !== state.value.initialData.canonical ||
      state.value.includeSitemap !== state.value.initialData.includeSitemap
    );
  });

    // const saveCategorySettings: SaveSettings = async (): Promise<boolean> => {
  //   state.value.loading = true;

  //   const settings = {
  //     id: 16,
  //     parentCategoryId: 17,
  //     linkList: state.value.linkList,
  //     name: state.value.name,
  //     canonicalLink: state.value.canonicalLink,
  //     position: state.value.position,
  //     metaTitle: state.value.title,
  //     metaDescription: state.value.description,
  //     metaKeywords: state.value.keywords,
  //     metaRobots: state.value.robots,
  //     sitemap: state.value.sitemap,
  //   };

  //   const { error } = await useAsyncData(() => useSdk().plentysystems.setCategorySettings(settings));
  //   if (error.value) {
  //     state.value.loading = false;
  //     return false;
  //   }

  //   state.value.initialData = {
  //     id: state.value.id,
  //     parentCategoryId: state.value.parentCategoryId,
  //     sitemap: state.value.sitemap,
  //     linkList: state.value.linkList,
  //     name: state.value.name,
  //     canonicalLink: state.value.canonicalLink,
  //     position: state.value.position,
  //     title: state.value.title,
  //     description: state.value.description,
  //     keywords: state.value.keywords,
  //     robots: state.value.robots,
  //     canonical: state.value.canonical,
  //     includeSitemap: state.value.includeSitemap,
  //   };

  //   state.value.loading = false;
  //   return true;
  // };

  const saveCategorySettings: SaveSettings = async (): Promise<boolean> => {
    state.value.loading = true;

    const settings = [
      {
        key: 'id',
        value: '17',
      },
      {
        key: 'parentCategoryId',
        value: '16',
      },
      {
        key: 'sitemap',
        value: 'sitemap',
      },

      {
        key: 'linkList',
        value: 'linkList',
      },
      {
        key: 'name',
        value: 'name',
      },
      {
        key: 'canonicalLink',
        value: 'canonicalLink',
      },
      {
        key: 'position',
        value: state.value.position.toString(),
      },
      {
        key: 'title',
        value: 'title',
      },
      {
        key: 'description',
        value: 'description',
      },
      {
        key: 'keywords',
        value: 'keywords',
      },
      {
        key: 'robots',
        value: 'robots',
      },
      {
        key: 'canonical',
        value: 'canonical',
      },
      {
        key: 'includeSitemap',
        value: 'includeSitemap',
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

  const setPageId = (id: number) => {
    state.value.id = id;
  };

  return {
    ...toRefs(state.value),
    categorySettingsIsDirty,
    saveCategorySettings,
    setPageId,
  };
};
